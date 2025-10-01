import { expectGetOneResponseStatus } from '@_src/api/assertions/assertions.api';
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareAndCreateCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { expect, test } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify comments delete operations',
  { tag: ['@crud', '@api', '@comment', '@delete'] },
  () => {
    let articleId: number;
    let responseComment: APIResponse;

    test.beforeAll('create an article', async ({ articlesRequestLogged }) => {
      const responseArticle = await createArticleWithApi(articlesRequestLogged);

      const article = await responseArticle.json();
      articleId = article.id;
    });

    test.beforeEach('create a comment', async ({ commentsRequestLogged }) => {
      responseComment = await prepareAndCreateCommentWithApi(
        commentsRequestLogged,
        articleId,
      );
    });

    test(
      'should delete a comment with logged-in user',
      {
        tag: '@GAD-R09-04',
      },
      async ({ commentsRequestLogged }) => {
        const comment = await responseComment.json();
        const responseCommentDeleted = await commentsRequestLogged.delete(
          comment.id,
        );

        const actualResponseStatus = responseCommentDeleted.status();
        const expectedStatusCode = 200;
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Check that deleted comment is not to be found
        await expectGetOneResponseStatus(
          commentsRequestLogged,
          comment.id,
          404,
        );
      },
    );

    test(
      'should not delete a comment with a non logged-in user',
      { tag: '@GAD-R09-04' },
      async ({ commentsRequest }) => {
        const comment = await responseComment.json();
        const responseCommentNotDeleted = await commentsRequest.delete(
          comment.id,
        );

        const actualResponseStatus = responseCommentNotDeleted.status();
        const expectedStatusCode = 401;
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Check that not deleted comment is found
        await expectGetOneResponseStatus(commentsRequest, comment.id, 200);
      },
    );
  },
);
