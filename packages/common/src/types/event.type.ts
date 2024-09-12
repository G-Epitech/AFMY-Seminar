import { IdOf } from "../utils";
import { Employee } from "./employee.type";

export type EventLocation = {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
};

export type MeetingEvent = {
  id: number;
  legacyId: number | null;
  title: string;
  start: Date;
  end: Date;
  maxParticipants: number;
  locationId: IdOf<EventLocation>;
  type: string;
  employeeId: IdOf<Employee>;
};

export type EventsFilters = {
  month?: number;
  year: number;
};
