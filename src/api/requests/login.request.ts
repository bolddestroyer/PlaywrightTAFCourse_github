import { Headers } from '@_src/api/models/headers.api.model';
import { LoginData } from '@_src/api/models/login.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

// Similar to basePage
export class LoginRequest {
  url: string;

  constructor(
    protected request: APIRequestContext,
    protected headers?: Headers,
  ) {
    this.url = apiUrls.loginUrl;
  }

  async get(): Promise<APIResponse> {
    return await this.request.get(this.url);
  }

  async post(data: LoginData): Promise<APIResponse> {
    return await this.request.post(this.url, { headers: this.headers, data });
  }
}
