import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { ArticlePayload } from '@_src/api/models/article.api.model';
import { expect, test } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify articles create operations',
  { tag: ['@crud', '@api', '@article', '@create'] },
  () => {
    test(
      'should not create an article without a logged-in user',
      { tag: '@GAD-R09-01' },
      async ({ articlesRequest }) => {
        const articleData = prepareArticlePayload();
        const response = await articlesRequest.post(articleData);

        expect(response.status()).toBe(401);
      },
    );

    test.describe('create operations', () => {
      let responseArticle: APIResponse;
      let articleData: ArticlePayload;

      test(
        'should create an article with logged-in user',
        { tag: '@GAD-R09-01' },
        async ({ articlesRequestLogged }) => {
          articleData = prepareArticlePayload();
          responseArticle = await createArticleWithApi(
            articlesRequestLogged,
            articleData,
          );

          const actualResponseStatus = responseArticle.status();
          const expectedStatusCode = 201;
          expect(
            actualResponseStatus,
            `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          const articleJson = await responseArticle.json();
          expect.soft(articleJson.title).toEqual(articleData.title);
          expect.soft(articleJson.body).toEqual(articleData.body);
        },
      );

      test(
        'should create new article when modified article id not exist with logged-in user',
        { tag: '@GAD-R10-01' },
        async ({ articlesRequestLogged }) => {
          const articleData = prepareArticlePayload();
          const responseArticlePut =
            await articlesRequestLogged.put(articleData);

          const actualResponseStatus = responseArticlePut.status();
          const expectedStatusCode = 201;
          expect(
            actualResponseStatus,
            `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          const articleJson = await responseArticlePut.json();
          expect.soft(articleJson.title).toEqual(articleData.title);
          expect.soft(articleJson.body).toEqual(articleData.body);
        },
      );
    });
  },
);
