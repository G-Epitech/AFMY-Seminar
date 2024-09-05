import { Employee } from '../../types';

export type OutGetMeDto = Omit<Employee, 'photo' | 'photoFormat'>;
