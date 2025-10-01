import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { ArticlePayload } from '@_src/api/models/article.api.model';
import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { expect } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

export async function createArticleWithApi(
  // ArticlesRequest contains headers and loggin is handled there, not in createArticleWithApi()
  articlesRequest: ArticlesRequest,
  articleData?: ArticlePayload,
): Promise<APIResponse> {
  // If articleData is not provided, article with default data from prepareArticlePayload() is created
  const articleDataFinal = articleData || prepareArticlePayload();
  const responseArticle = await articlesRequest.post(articleDataFinal);

  const articleJson = await responseArticle.json();

  const expectedStatusCode = 200;
  await expect(async () => {
    const responseArticleCreated = await articlesRequest.getOne(articleJson.id);
    expect(
      responseArticleCreated.status(),
      `Expected status: ${expectedStatusCode} and observed: ${responseArticleCreated.status()}`,
    ).toBe(expectedStatusCode);
  }).toPass({ timeout: 2_000 });

  return responseArticle;
}
