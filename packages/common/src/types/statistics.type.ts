export type History = {
  date: Date;
  count: number;
}[];

export type Statistics = {
  customers: {
    count: number; // Total number of customers in the time frame
    evolution_count: number; // Percentage of customers evolution in the time frame compared to the previous one
    doing_meetings: number; // Number of customers doing meetings in the time frame
    evolution_doing_meetings: number; // Percentage of customers doing meetings evolution in the time frame compared to the previous one
    customers_by_coach: number; // Average number of customers by coach in the time frame
    history: History; // Number of customers by date in the time frame
    history_previous: History; // Number of customers by date in the previous time frame
    countries: { country: string; count: number; percentage: number }[]; // Number of customers by country in the time frame
  };
  events: {
    count_month: number; // Number of events in the 'sliding' month (30 days from the time frame's end)
    evolution_count_month: number; // Percentage of events evolution in the 'sliding' month compared to the previous one
    count_week: number; // Number of events in the 'sliding' week (7 days from the time frame's end)
    evolution_count_week: number; // Percentage of events evolution in the 'sliding' week compared to the previous one
    daily_average: number; // Average number of events per day in the time frame
    evolution_daily_average: number; // Percentage of events evolution in the daily average compared to the previous one
    history: History; // Number of events by date in the time frame
  };
  meetings: { source: string; count: number; percentage: number }[]; // Number of meetings by source in the time frame
};

export type TimeFrame = {
  start: Date;
  end: Date;
};
