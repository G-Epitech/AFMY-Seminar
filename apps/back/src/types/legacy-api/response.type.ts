import { LegacyApiEndpoints } from './endpoints.type';

export type LegacyApiResponse<R extends keyof LegacyApiEndpoints> = {
  data: LegacyApiEndpoints[R]['response'];
  status: number;
};
