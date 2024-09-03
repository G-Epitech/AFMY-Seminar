import { IdOf } from '../utils';
import { Employee } from './employee.type';

export type EventLocation = {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  }
}

export type MeetingEvent = {
  id: number;
  title: string;
  date: Date;
  maxParticipants: number;
  locationId: IdOf<EventLocation>;
  type: string;
  employeeId: IdOf<Employee>;
}
