import { ArticlePayload } from '@_src/api/models/article.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiUrls, timestamp } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

// Similar to basePage
export class ArticlesRequest {
  url: string;

  constructor(
    protected request: APIRequestContext,
    protected headers?: Headers,
  ) {
    this.url = apiUrls.articlesUrl;
  }

  async get(): Promise<APIResponse> {
    return await this.request.get(this.url, { headers: this.headers });
  }

  async getOne(articleId: string): Promise<APIResponse> {
    return await this.request.get(`${this.url}/${articleId}`, {
      headers: this.headers,
    });
  }

  async post(data: ArticlePayload): Promise<APIResponse> {
    return await this.request.post(this.url, { headers: this.headers, data });
  }

  async put(data: ArticlePayload, articleId?: string): Promise<APIResponse> {
    const articleIdPut = articleId || timestamp();
    return await this.request.put(`${this.url}/${articleIdPut}`, {
      headers: this.headers,
      data,
    });
  }

  async patch(
    // Allow injecting part of ArticlePayload, e.g. single field
    data: Partial<ArticlePayload>,
    articleId: string,
  ): Promise<APIResponse> {
    return await this.request.patch(`${this.url}/${articleId}`, {
      headers: this.headers,
      data,
    });
  }

  async delete(articleId: string): Promise<APIResponse> {
    return await this.request.delete(`${this.url}/${articleId}`, {
      headers: this.headers,
    });
  }
}
