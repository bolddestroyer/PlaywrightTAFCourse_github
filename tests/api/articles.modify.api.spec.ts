import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { ArticlePayload } from '@_src/api/models/article.api.model';
import { expect, test } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify articles modification operations',
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

    test.describe('fully modify article', () => {
      test(
        'should modify and replace content for an article with logged-in user',
        { tag: '@GAD-R10-01' },
        async ({ articlesRequestLogged }) => {
          const article = await responseArticle.json();
          const modifiedArticleData = prepareArticlePayload();
          const responseArticlePut = await articlesRequestLogged.put(
            modifiedArticleData,
            article.id,
          );

          const actualResponseStatus = responseArticlePut.status();
          const expectedStatusCode = 200;
          expect(
            actualResponseStatus,
            `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          const modifiedArticleJson = await responseArticlePut.json();
          expect
            .soft(modifiedArticleJson.title)
            .toEqual(modifiedArticleData.title);
          expect
            .soft(modifiedArticleJson.body)
            .toEqual(modifiedArticleData.body);
          expect.soft(modifiedArticleJson.title).not.toEqual(articleData.title);
          expect.soft(modifiedArticleJson.body).not.toEqual(articleData.body);
        },
      );

      test(
        'should not modify an article with a non logged-in user',
        { tag: '@GAD-R10-01' },
        async ({ articlesRequest }) => {
          const article = await responseArticle.json();
          const modifiedArticleData = prepareArticlePayload();
          const responseArticlePut = await articlesRequest.put(
            modifiedArticleData,
            article.id,
          );

          const actualResponseStatus = responseArticlePut.status();
          const expectedStatusCode = 401;
          expect(
            actualResponseStatus,
            `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          const nonModifiedArticle = await articlesRequest.getOne(article.id);
          const nonModifiedArticleJson = await nonModifiedArticle.json();
          expect
            .soft(nonModifiedArticleJson.title)
            .not.toEqual(modifiedArticleData.title);
          expect
            .soft(nonModifiedArticleJson.body)
            .not.toEqual(modifiedArticleData.body);
          expect.soft(nonModifiedArticleJson.title).toEqual(articleData.title);
          expect.soft(nonModifiedArticleJson.body).toEqual(articleData.body);
        },
      );
    });

    test.describe('partially modify article', () => {
      test(
        'should partially modify an article with logged-in user',
        { tag: '@GAD-R10-03' },
        async ({ articlesRequestLogged }) => {
          const article = await responseArticle.json();
          const modifiedArticleData = {
            title: `Patched title ${new Date().toISOString()}`,
          };
          const responseArticlePatch = await articlesRequestLogged.patch(
            modifiedArticleData,
            article.id,
          );

          const actualResponseStatus = responseArticlePatch.status();
          const expectedStatusCode = 200;
          expect(
            actualResponseStatus,
            `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          const modifiedArticleJson = await responseArticlePatch.json();
          expect
            .soft(modifiedArticleJson.title)
            .toEqual(modifiedArticleData.title);
          expect.soft(modifiedArticleJson.title).not.toEqual(articleData.title);
          expect.soft(modifiedArticleJson.body).toEqual(articleData.body);
        },
      );

      test(
        'should not partially modify an article with a non logged-in user',
        { tag: '@GAD-R10-03' },
        async ({ articlesRequest }) => {
          const article = await responseArticle.json();
          const modifiedArticleData = {
            title: `Patched title ${new Date().toISOString()}`,
          };
          const responseArticlePatch = await articlesRequest.patch(
            modifiedArticleData,
            article.id,
          );

          const actualResponseStatus = responseArticlePatch.status();
          const expectedStatusCode = 401;
          expect(
            actualResponseStatus,
            `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          const nonModifiedArticle = await articlesRequest.getOne(article.id);

          const nonModifiedArticleJson = await nonModifiedArticle.json();
          expect
            .soft(nonModifiedArticleJson.title)
            .not.toEqual(modifiedArticleData.title);
          expect.soft(nonModifiedArticleJson.title).toEqual(articleData.title);
          expect.soft(nonModifiedArticleJson.body).toEqual(articleData.body);
        },
      );

      test(
        'should not partially modify an article with improper field logged-in user',
        { tag: '@GAD-R10-03' },
        async ({ articlesRequestLogged }) => {
          const article = await responseArticle.json();

          const nonExistingField = 'nonExistingField';
          const modifiedArticleData = {};
          modifiedArticleData[nonExistingField] = 'Hello';

          const responseArticlePatch = await articlesRequestLogged.patch(
            modifiedArticleData,
            article.id,
          );

          const actualResponseStatus = responseArticlePatch.status();
          const expectedStatusCode = 422;
          expect(
            actualResponseStatus,
            `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          const responseArticlePutJson = await responseArticlePatch.json();
          expect
            .soft(responseArticlePutJson.error.message)
            .toEqual(
              `One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "${nonExistingField}" not in [id,user_id,title,body,date,image]`,
            );
        },
      );
    });
  },
);
