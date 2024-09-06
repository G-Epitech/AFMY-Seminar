import {
  ConflictException,
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Allow } from '../employees/decorators/allow.decorator';
import {
  Permission,
  QueryGetStatisticsDTO,
  Statistics,
  TimeFrame,
} from '@seminar/common';

@Controller('statistics')
export class StatisticsController {
  @Inject(StatisticsService)
  private readonly _statisticsService: StatisticsService;

  @Get()
  @Allow(Permission.MANAGER)
  async getStatistics(
    @Query() query: QueryGetStatisticsDTO,
  ): Promise<Statistics> {
    if (query.from > query.to) {
      throw new ConflictException('From date cannot be greater than to date');
    }
    const timeFrame: TimeFrame = {
      start: query.from,
      end: query.to,
    };
    const previousTimeFrame: TimeFrame =
      this._statisticsService.getPreviousTimeframe(timeFrame);

    const customers_count =
      await this._statisticsService.getCustomersCount(timeFrame);

    const customers_last_count =
      await this._statisticsService.getCustomersCount(previousTimeFrame);

    const customers_evolution_count =
      customers_last_count === 0
        ? 0
        : (customers_count - customers_last_count) / customers_last_count;

    const doing_meetings =
      await this._statisticsService.getCustomersDoingMeetingsCount(timeFrame);

    const customers_doing_meetings_last_count =
      await this._statisticsService.getCustomersDoingMeetingsCount(
        previousTimeFrame,
      );

    const customers_evolution_doing_meetings =
      customers_doing_meetings_last_count === 0
        ? 0
        : (doing_meetings - customers_doing_meetings_last_count) /
          customers_doing_meetings_last_count;

    const events_month_count = await this._statisticsService.getEventsCount(
      this._statisticsService.sizeTimeframe(timeFrame, 'month'),
    );

    const events_last_month_count =
      await this._statisticsService.getEventsCount(
        this._statisticsService.sizeTimeframe(previousTimeFrame, 'month'),
      );

    const events_evolution_count_month =
      events_last_month_count === 0
        ? 0
        : (events_month_count - events_last_month_count) /
          events_last_month_count;

    const events_week_count = await this._statisticsService.getEventsCount(
      this._statisticsService.sizeTimeframe(timeFrame, 'week'),
    );

    const events_last_week_count = await this._statisticsService.getEventsCount(
      this._statisticsService.sizeTimeframe(previousTimeFrame, 'week'),
    );

    const events_evolution_count_week =
      events_last_week_count === 0
        ? 0
        : (events_week_count - events_last_week_count) / events_last_week_count;

    const daily_average =
      await this._statisticsService.getEventsDailyAverage(timeFrame);

    const daily_average_last =
      await this._statisticsService.getEventsDailyAverage(previousTimeFrame);

    const evolution_daily_average =
      daily_average_last === 0
        ? 0
        : (daily_average - daily_average_last) / daily_average_last;

    return {
      customers: {
        count: customers_count,
        evolution_count: customers_evolution_count || 0,
        doing_meetings,
        evolution_doing_meetings: customers_evolution_doing_meetings || 0,
        customers_by_coach:
          await this._statisticsService.getCustomersByCoachAverage(timeFrame),
        history: await this._statisticsService.getCustomersHistory(timeFrame),
        history_previous:
          await this._statisticsService.getCustomersHistory(previousTimeFrame),
        countries:
          await this._statisticsService.getCustomersByCountry(timeFrame),
      },
      events: {
        count_month: events_month_count,
        evolution_count_month: events_evolution_count_month,
        count_week: events_week_count,
        evolution_count_week: events_evolution_count_week,
        daily_average: daily_average,
        evolution_daily_average: evolution_daily_average,
        history: await this._statisticsService.getEventsHistory(timeFrame),
      },
      meetings: await this._statisticsService.getMeetingsBySource(timeFrame),
    };
  }
}
