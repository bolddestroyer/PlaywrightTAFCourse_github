import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe(
  'Verify comments create operations',
  { tag: ['@crud', '@api', '@comment', '@create'] },
  () => {
    let articleId: number;

    test.beforeAll('create an article', async ({ articlesRequestLogged }) => {
      const responseArticle = await createArticleWithApi(articlesRequestLogged);

      const article = await responseArticle.json();
      articleId = article.id;
    });

    test(
      'should not create an comment without a logged-in user',
      { tag: '@GAD-R09-02' },
      async ({ commentsRequest }) => {
        const commentData = prepareCommentPayload(articleId);
        const response = await commentsRequest.post(commentData);

        expect(response.status()).toBe(401);
      },
    );

    test(
      'should create a comment with logged-in user',
      { tag: '@GAD-R09-02' },
      async ({ commentsRequestLogged }) => {
        // commentData provides articleId
        const commentData = prepareCommentPayload(articleId);
        const responseComment = await createCommentWithApi(
          commentsRequestLogged,
          commentData,
        );

        const actualResponseStatus = responseComment.status();
        const expectedStatusCode = 201;
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        const comment = await responseComment.json();
        expect.soft(comment.body).toEqual(commentData.body);
      },
    );

    test('should create a comment when modification on nonexisting id requested with logged-in user @GAD-R10-02', async ({
      commentsRequest,
      commentsRequestLogged,
    }) => {
      const commentData = prepareCommentPayload(articleId);
      const responseComment = await commentsRequestLogged.put(commentData);

      const actualResponseStatus = responseComment.status();
      const expectedStatusCode = 201;
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const comment = await responseComment.json();
      const commentGet = await commentsRequest.getOne(comment.id);
      const commentGetJson = await commentGet.json();
      expect.soft(commentGetJson.body).toEqual(commentData.body);
    });
  },
);
