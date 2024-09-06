export type History = {
  date: Date;
  count: number;
}[];

export type Statistics = {
  customers: {
    count: number; // Total number of customers in the time frame
    evolutionCount: number; // Percentage of customers evolution in the time frame compared to the previous one
    doingMeetings: number; // Number of customers doing meetings in the time frame
    evolutionDoingMeetings: number; // Percentage of customers doing meetings evolution in the time frame compared to the previous one
    customersByCoach: number; // Average number of customers by coach in the time frame
    history: History; // Number of customers by date in the time frame
    historyPrevious: History; // Number of customers by date in the previous time frame
    countries: { country: string; count: number; percentage: number }[]; // Number of customers by country in the time frame
  };
  events: {
    countMonth: number; // Number of events in the 'sliding' month (30 days from the time frame's end)
    evolutionCountMonth: number; // Percentage of events evolution in the 'sliding' month compared to the previous one
    countWeek: number; // Number of events in the 'sliding' week (7 days from the time frame's end)
    evolutionCountWeek: number; // Percentage of events evolution in the 'sliding' week compared to the previous one
    dailyAverage: number; // Average number of events per day in the time frame
    evolutionDailyAverage: number; // Percentage of events evolution in the daily average compared to the previous one
    history: History; // Number of events by date in the time frame
  };
  meetings: { source: string; count: number; percentage: number }[]; // Number of meetings by source in the time frame
};

export type TimeFrame = {
  start: Date;
  end: Date;
};
