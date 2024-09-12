import { MeetingEvent } from '@seminar/common';

export type UpdateEventCandidate = Partial<Omit<MeetingEvent, 'id'>>;

export type CreateEventCandidate = Omit<MeetingEvent, 'id'>;
