import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers';
import { History, TimeFrame } from '@seminar/common';

@Injectable()
export class StatisticsService {
  @Inject(PrismaService)
  protected readonly _prismaService: PrismaService;

  public getPreviousTimeframe(timeframe: TimeFrame): TimeFrame {
    // Shift the timeframe by the same amount of time
    const diff = timeframe.end.getTime() - timeframe.start.getTime();
    return {
      start: new Date(timeframe.start.getTime() - diff),
      end: new Date(timeframe.end.getTime() - diff),
    };
  }

  public sizeTimeframe(
    timeframe: TimeFrame,
    size: 'month' | 'week',
  ): TimeFrame {
    switch (size) {
      case 'month': // 30 days from the end of the timeframe
        return {
          start: new Date(
            timeframe.end.getFullYear(),
            timeframe.end.getMonth(),
            timeframe.end.getDate() - 30,
          ),
          end: timeframe.end,
        };
      case 'week': // 7 days from the end of the timeframe
        return {
          start: new Date(
            timeframe.end.getFullYear(),
            timeframe.end.getMonth(),
            timeframe.end.getDate() - 7,
          ),
          end: timeframe.end,
        };
    }
  }

  public async getCustomersCount(timeframe: TimeFrame): Promise<number> {
    return this._prismaService.customer.count({
      where: {
        createdAt: {
          gte: timeframe.start,
          lte: timeframe.end,
        },
      },
    });
  }

  public async getCustomersDoingMeetingsCount(
    timeframe: TimeFrame,
  ): Promise<number> {
    return this._prismaService.customer.count({
      where: {
        createdAt: {
          gte: timeframe.start,
          lte: timeframe.end,
        },
        encounters: {
          some: {
            date: {
              gte: timeframe.start,
              lte: timeframe.end,
            },
          },
        },
      },
    });
  }

  public async getCustomersByCoachAverage(
    timeframe: TimeFrame,
  ): Promise<number> {
    const customersCount = await this._prismaService.customer.count({
      where: {
        createdAt: {
          gte: timeframe.start,
          lte: timeframe.end,
        },
      },
    });
    const coachesCount = await this._prismaService.employee.count();

    return customersCount / coachesCount;
  }

  private getHistoryStep(timeframe: TimeFrame): 'month' | 'week' | 'day' {
    const diff = timeframe.end.getTime() - timeframe.start.getTime();

    const nbOfMonthsForMonthsStep = 2 * 12; // 2 years
    const nbOfMonthsForWeeksStep = 3; // 3 months (12 weeks)

    if (diff > nbOfMonthsForMonthsStep * 30 * 24 * 60 * 60 * 1000) {
      return 'month';
    }

    if (diff > nbOfMonthsForWeeksStep * 30 * 24 * 60 * 60 * 1000) {
      return 'week';
    }

    return 'day';
  }

  private async getStepDates(timeframe: TimeFrame): Promise<Date[]> {
    const step = this.getHistoryStep(timeframe);
    const stepDates: Date[] = [];

    let currentDate = new Date(timeframe.start);

    const endDate = new Date(timeframe.end);

    switch (step) {
      case 'month':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'week':
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 'day':
        endDate.setDate(endDate.getDate() + 1);
        break;
    }

    while (currentDate.getTime() < endDate.getTime()) {
      stepDates.push(currentDate);

      switch (step) {
        case 'month':
          currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
          );
          break;
        case 'week':
          currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 7,
          );
          break;
        case 'day':
          currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1,
          );
          break;
      }
    }

    return stepDates;
  }

  public async getCustomersHistory(timeframe: TimeFrame): Promise<History> {
    const stepDates = await this.getStepDates(timeframe);
    const history: History = [];

    for (let i = 0; i < stepDates.length; i++) {
      const customersCount = await this.getCustomersCount({
        start: stepDates[i],
        end: stepDates[i + 1],
      });

      history.push({
        date: stepDates[i],
        count: customersCount,
      });
    }
    history.pop();
    return history;
  }

  public async getCustomersByCountry(
    timeframe: TimeFrame,
  ): Promise<{ country: string; count: number; percentage: number }[]> {
    const customers = await this._prismaService.customer.findMany({
      where: {
        createdAt: {
          gte: timeframe.start,
          lte: timeframe.end,
        },
      },
      select: {
        country: true,
      },
    });

    const countries = customers
      .map((customer) => customer.country)
      .filter((country) => country !== null)
      .reduce(
        (acc, country) => {
          if (acc[country]) {
            acc[country]++;
          } else {
            acc[country] = 1;
          }
          return acc;
        },
        {} as { [country: string]: number },
      );

    const totalCustomers = customers.length;

    return Object.entries(countries).map(([country, count]) => ({
      country,
      count,
      percentage: (count / totalCustomers) * 100,
    }));
  }

  public async getEventsCount(timeframe: TimeFrame): Promise<number> {
    return this._prismaService.event.count({
      where: {
        start: {
          gte: timeframe.start,
          lte: timeframe.end,
        },
      },
    });
  }

  public async getEventsDailyAverage(timeframe: TimeFrame): Promise<number> {
    const diff = timeframe.end.getTime() - timeframe.start.getTime();
    const days = diff / (24 * 60 * 60 * 1000);
    const eventsCount = await this.getEventsCount(timeframe);

    return eventsCount / days;
  }

  public async getEventsHistory(timeframe: TimeFrame): Promise<History> {
    const stepDates = await this.getStepDates(timeframe);
    const history: History = [];

    for (let i = 0; i < stepDates.length; i++) {
      const eventsCount = await this.getEventsCount({
        start: stepDates[i],
        end: stepDates[i + 1],
      });

      history.push({
        date: stepDates[i],
        count: eventsCount,
      });
    }
    history.pop();
    return history;
  }

  public async getMeetingsBySource(
    timeframe: TimeFrame,
  ): Promise<{ source: string; count: number; percentage: number }[]> {
    const encounters = await this._prismaService.encounter.findMany({
      where: {
        date: {
          gte: timeframe.start,
          lte: timeframe.end,
        },
      },
      select: {
        source: true,
      },
    });

    const sources = encounters
      .map((encounter) => encounter.source)
      .reduce(
        (acc, source) => {
          if (acc[source]) {
            acc[source]++;
          } else {
            acc[source] = 1;
          }
          return acc;
        },
        {} as { [source: string]: number },
      );

    const totalEncounters = encounters.length;

    return Object.entries(sources).map(([source, count]) => ({
      source,
      count,
      percentage: (count / totalEncounters) * 100,
    }));
  }
}
