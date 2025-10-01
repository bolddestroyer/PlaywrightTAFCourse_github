import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment.api.model';
import { expect, test } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify comments modification operations',
  { tag: ['@crud', '@api', '@comment', '@modify'] },
  () => {
    let articleId: number;
    let responseComment: APIResponse;
    let commentData: CommentPayload;

    test.beforeAll('create an article', async ({ articlesRequestLogged }) => {
      const responseArticle = await createArticleWithApi(articlesRequestLogged);

      const article = await responseArticle.json();
      articleId = article.id;
    });

    test.beforeEach('create a comment', async ({ commentsRequestLogged }) => {
      commentData = prepareCommentPayload(articleId);
      responseComment = await createCommentWithApi(
        commentsRequestLogged,
        commentData,
      );
    });

    test.describe(
      'Verify comments full modify operations',
      { tag: ['@crud', '@api', '@comment', '@modify'] },
      () => {
        test(
          'should modify a comment with logged-in user',
          {
            tag: '@GAD-R10-02',
          },
          async ({ commentsRequestLogged }) => {
            const comment = await responseComment.json();
            const modifiedCommentData = prepareCommentPayload(articleId);
            const responseCommentModified = await commentsRequestLogged.put(
              modifiedCommentData,
              comment.id,
            );

            const actualResponseStatus = responseCommentModified.status();
            const expectedStatusCode = 200;
            expect(
              actualResponseStatus,
              `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
            ).toBe(expectedStatusCode);

            const modifiedComment = await commentsRequestLogged.getOne(
              comment.id,
            );
            const modifiedCommentJson = await modifiedComment.json();
            expect
              .soft(modifiedCommentJson.body)
              .toEqual(modifiedCommentData.body);
            expect.soft(modifiedCommentJson.body).not.toEqual(commentData.body);
          },
        );

        test(
          'should not modify a comment with a non logged-in user',
          { tag: '@GAD-R10-02' },
          async ({ commentsRequest }) => {
            const comment = await responseComment.json();
            const nonModifiedCommentData = prepareCommentPayload(articleId);
            const responseCommentNonModified = await commentsRequest.put(
              nonModifiedCommentData,
              comment.id,
            );

            const actualResponseStatus = responseCommentNonModified.status();
            const expectedStatusCode = 401;
            expect(
              actualResponseStatus,
              `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
            ).toBe(expectedStatusCode);

            const nonModifiedComment = await commentsRequest.getOne(comment.id);
            const nonModifiedCommentJson = await nonModifiedComment.json();
            expect
              .soft(nonModifiedCommentJson.body)
              .not.toEqual(nonModifiedCommentData.body);
            expect.soft(nonModifiedCommentJson.body).toEqual(commentData.body);
          },
        );
      },
    );

    test.describe(
      'Verify comments partial modify operations',
      { tag: ['@crud', '@api', '@comment', '@modify'] },
      () => {
        test(
          'should partially modify a comment with logged-in user',
          { tag: '@GAD-R10-04' },
          async ({ commentsRequest, commentsRequestLogged }) => {
            const comment = await responseComment.json();
            const modifiedCommentData = {
              body: `Patched body ${new Date().toISOString()}`,
            };
            const responseCommentModified = await commentsRequestLogged.patch(
              modifiedCommentData,
              comment.id,
            );

            const actualResponseStatus = responseCommentModified.status();
            const expectedStatusCode = 200;
            expect(
              actualResponseStatus,
              `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
            ).toBe(expectedStatusCode);

            const modifiedComment = await commentsRequest.getOne(comment.id);
            const modifiedCommentJson = await modifiedComment.json();
            expect
              .soft(modifiedCommentJson.body)
              .toEqual(modifiedCommentData.body);
            expect.soft(modifiedCommentJson.body).not.toEqual(commentData.body);
            expect.soft(modifiedCommentJson.date).toEqual(commentData.date);
          },
        );

        test(
          'should not partially modify a comment with a non logged-in user',
          { tag: '@GAD-R10-04' },
          async ({ commentsRequest }) => {
            const comment = await responseComment.json();
            const nonModifiedCommentData = {
              body: `Patched body ${new Date().toISOString()}`,
            };
            const responseCommentNotModified = await commentsRequest.patch(
              nonModifiedCommentData,
              comment.id,
            );

            const actualResponseStatus = responseCommentNotModified.status();
            const expectedStatusCode = 401;
            expect(
              actualResponseStatus,
              `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
            ).toBe(expectedStatusCode);

            const nonModifiedComment = await commentsRequest.getOne(comment.id);
            const nonModifiedCommentJson = await nonModifiedComment.json();
            expect
              .soft(nonModifiedCommentJson.body)
              .not.toEqual(nonModifiedCommentData.body);
            expect.soft(nonModifiedCommentJson.body).toEqual(commentData.body);
          },
        );

        test(
          'should not partially modify a comment with a non existing field for logged-in user',
          { tag: '@GAD-R10-04' },
          async ({ commentsRequest, commentsRequestLogged }) => {
            const comment = await responseComment.json();
            const nonExistingField = 'nonExistingField';
            const modifiedCommentData = {};
            modifiedCommentData[nonExistingField] =
              `Patched body ${new Date().toISOString()}`;

            const responseCommentNotModified =
              await commentsRequestLogged.patch(
                modifiedCommentData,
                comment.id,
              );

            const actualResponseStatus = responseCommentNotModified.status();
            const expectedStatusCode = 422;
            expect(
              actualResponseStatus,
              `expected status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
            ).toBe(expectedStatusCode);

            const responseCommentNotModifiedJson =
              await responseCommentNotModified.json();
            expect
              .soft(responseCommentNotModifiedJson.error.message)
              .toEqual(
                `One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "${nonExistingField}" not in [id,user_id,article_id,body,date]`,
              );

            // Verify that comment was not modified (body is the same as before)
            const nonModifiedComment = await commentsRequest.getOne(comment.id);
            const nonModifiedCommentJson = await nonModifiedComment.json();
            expect.soft(nonModifiedCommentJson.body).toEqual(commentData.body);
          },
        );
      },
    );
  },
);
