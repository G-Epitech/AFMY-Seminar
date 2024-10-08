import {
  ClotheLegacyDto,
  CustomerLegacyDto,
  EmployeeLegacyDto,
  EncounterLegacyDto,
  EventLegacyDto,
  PaymentHistoryLegacyDto,
  ShortCustomerLegacyDto,
  ShortEmployeeLegacyDto,
  ShortEncounterLegacyDto,
  ShortEventLegacyDto,
  TipLegacyDto,
  TokenLegacyDto,
} from './dtos';

export interface LegacyApiEndpoint<
  ResponseType,
  ParametersType = never,
  BodyType = never,
  NeedAuth extends boolean = true,
> {
  auth: NeedAuth;
  body: BodyType;
  response: ResponseType;
  parameters: ParametersType;
}

export interface LegacyApiEndpoints {
  'GET /employees': LegacyApiEndpoint<ShortEmployeeLegacyDto[]>;

  'POST /employees/login': LegacyApiEndpoint<
    TokenLegacyDto,
    never,
    {
      email: string;
      password: string;
    },
    false
  >;

  'GET /employees/me': LegacyApiEndpoint<EmployeeLegacyDto>;

  'GET /employees/{employee_id}': LegacyApiEndpoint<
    EmployeeLegacyDto,
    { employee_id: number }
  >;

  'GET /employees/{employee_id}/image': LegacyApiEndpoint<
    Buffer,
    { employee_id: number }
  >;

  'GET /customers': LegacyApiEndpoint<ShortCustomerLegacyDto[]>;

  'GET /customers/{customer_id}': LegacyApiEndpoint<
    CustomerLegacyDto,
    {
      customer_id: number;
    }
  >;

  'GET /customers/{customer_id}/image': LegacyApiEndpoint<
    Buffer,
    {
      customer_id: number;
    }
  >;

  'GET /customers/{customer_id}/payments_history': LegacyApiEndpoint<
    PaymentHistoryLegacyDto[],
    {
      customer_id: number;
    }
  >;

  'GET /customers/{customer_id}/clothes': LegacyApiEndpoint<
    ClotheLegacyDto[],
    {
      customer_id: number;
    }
  >;

  'GET /encounters': LegacyApiEndpoint<ShortEncounterLegacyDto[]>;

  'GET /encounters/{encounter_id}': LegacyApiEndpoint<
    EncounterLegacyDto,
    {
      encounter_id: number;
    }
  >;

  'GET /encounters/customer/{customer_id}': LegacyApiEndpoint<
    ShortEncounterLegacyDto[],
    {
      customer_id: number;
    }
  >;

  'GET /tips': LegacyApiEndpoint<TipLegacyDto[]>;

  'GET /events': LegacyApiEndpoint<ShortEventLegacyDto[]>;

  'GET /events/{event_id}': LegacyApiEndpoint<
    EventLegacyDto,
    {
      event_id: number;
    }
  >;

  'GET /clothes/{clothe_id}/image': LegacyApiEndpoint<
    Buffer,
    {
      clothe_id: number;
    }
  >;
}

export type LegacyApiEndpointData<R extends keyof LegacyApiEndpoints> =
  LegacyApiEndpoints[R]['body'] extends never
    ? LegacyApiEndpoints[R]['parameters'] extends never
      ? Record<string, never>
      : { parameters: LegacyApiEndpoints[R]['parameters'] }
    : LegacyApiEndpoints[R]['parameters'] extends never
      ? { body: LegacyApiEndpoints[R]['body'] }
      : {
          parameters: LegacyApiEndpoints[R]['parameters'];
          body: LegacyApiEndpoints[R]['body'];
        };
