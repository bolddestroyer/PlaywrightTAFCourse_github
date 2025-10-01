import { expectGetOneResponseStatus } from '@_src/api/assertions/assertions.api';
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { ArticlePayload } from '@_src/api/models/article.api.model';
import { expect, test } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify articles DELETE operations',
  { tag: ['@crud', '@api', '@article'] },
  () => {
    let responseArticle: APIResponse;
    let articleData: ArticlePayload;

    test.beforeEach('create an article', async ({ articlesRequestLogged }) => {
      // Create a header once for all tests, but an article for each test
      articleData = prepareArticlePayload();
      responseArticle = await createArticleWithApi(
        articlesRequestLogged,
        articleData,
      );
    });

    test(
      'should delete an article with logged-in user',
      { tag: '@GAD-R08-05' },
      async ({ articlesRequestLogged }) => {
        const article = await responseArticle.json();
        const responseArticleDelete = await articlesRequestLogged.delete(
          article.id,
        );

        const actualResponseStatus = responseArticleDelete.status();
        const expectedStatusCode = 200;
        expect(
          actualResponseStatus,
          `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Check that deleted article is not to be found
        await expectGetOneResponseStatus(
          articlesRequestLogged,
          article.id,
          404,
        );
      },
    );

    test(
      'should not delete an article with non logged-in user',
      { tag: '@GAD-R08-05' },
      async ({ articlesRequest }) => {
        const article = await responseArticle.json();
        const responseArticleDelete = await articlesRequest.delete(article.id);

        const actualResponseStatus = responseArticleDelete.status();
        const expectedStatusCode = 401;
        expect(
          actualResponseStatus,
          `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Check that not deleted article is found
        await expectGetOneResponseStatus(articlesRequest, article.id, 200);
      },
    );
  },
);
