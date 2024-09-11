import { Injectable } from '@nestjs/common';
import {
  LegacyApiEndpointData,
  LegacyApiEndpoints,
} from '../../types/legacy-api/endpoints.type';
import fetch from 'node-fetch';
import * as process from 'node:process';
import { LegacyApiResponse } from '../../types/legacy-api/response.type';
import { LegacyApiError } from '../../classes/legacy-api/legacy-api-error';
import { getHeader } from '../../utils/http';

@Injectable()
export class LegacyApiService {
  private getPathAndMethod<R extends keyof LegacyApiEndpoints>(
    endpoint: R,
    data: LegacyApiEndpointData<R>,
  ): [string, string] {
    const [method, templatePath] = endpoint.split(' ');
    let path = templatePath;

    if ('parameters' in data && data.parameters) {
      const parameters: Record<string, any> = data.parameters;

      Object.keys(parameters).forEach((key) => {
        path = path.replace(`{${key}}`, parameters[key]);
      });
    }

    return [method, path];
  }

  private async handleResponse<R extends keyof LegacyApiEndpoints>(
    response: fetch.Response,
  ): Promise<LegacyApiResponse<R>> {
    if (response.ok) {
      if (getHeader(response.headers, 'Content-Type')?.includes('image/')) {
        return {
          data: await response.buffer(),
          status: response.status,
        };
      }
      return {
        data: await response.json(),
        status: response.status,
      };
    }

    throw new LegacyApiError(
      response.statusText,
      response.status,
      getHeader(response.headers, 'Content-Type')?.includes('application/json')
        ? await response.json()
        : {
            detail: 'Unknown error',
          },
    );
  }

  async request<R extends keyof LegacyApiEndpoints>(
    endpoint: R,
    data: LegacyApiEndpointData<R>,
    ...rest: LegacyApiEndpoints[R]['auth'] extends true ? [string] : []
  ): Promise<LegacyApiResponse<R>> {
    const [method, path] = this.getPathAndMethod(endpoint, data);
    const token = rest.length ? rest[0] : undefined;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Group-Authorization': process.env.LEGACY_API_KEY || '',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${process.env.LEGACY_API_URL}${path}`, {
        method,
        headers,
        body: 'body' in data ? JSON.stringify(data.body) : undefined,
      });
      return await this.handleResponse<R>(response);
    } catch (e) {
      throw new LegacyApiError('Unknown error', 500, e);
    }
  }
}
