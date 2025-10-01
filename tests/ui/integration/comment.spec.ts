import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareAndCreateCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { expect, test } from '@_src/merge.fixture';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';
import { waitForResponse } from '@_src/ui/utils/wait.util';

test.describe('Verify comment', () => {
  test(
    'should return created comment',
    { tag: ['@GAD-R07-06', '@logged'] },
    async ({ createRandomArticle, page }) => {
      let articlePage = createRandomArticle.articlePage;
      const addCommentView = await articlePage.clickAddCommentButton();

      const newCommentData = prepareRandomComment();
      articlePage = await addCommentView.createComment(newCommentData);

      const responsePromise = waitForResponse(page, '/api/comments', 'GET');
      const response = await responsePromise;

      await expect
        .soft(articlePage.alertPopup)
        .toHaveText('Comment was created');
      expect(response.ok()).toBeTruthy();
    },
  );

  //Test setup with API, assertion on the UI
  test(
    'should not allow edit comment with empty message',
    { tag: ['@GAD-R07-06', '@logged'] },
    async ({ articlesRequestLogged, commentsRequestLogged, commentPage }) => {
      // Create article and comment with API
      const responseArticle = await createArticleWithApi(articlesRequestLogged);
      const article = await responseArticle.json();

      const responseComment = await prepareAndCreateCommentWithApi(
        commentsRequestLogged,
        article.id,
      );
      const comment = await responseComment.json();

      await commentPage.gotoId(comment.id);

      // Verify test on the UI
      const editCommentView = await commentPage.clickEditButton();
      // Instead of using updateComment() from edit-comment.view, which is only intended for happy cases
      await editCommentView.bodyInput.clear();
      await editCommentView.updateButton.click();

      await expect(commentPage.alertPopup).toHaveText(
        'Comment was not updated',
      );
      await editCommentView.cancelButton.click();
      await expect(commentPage.commentBody).toHaveText(comment.body);
    },
  );
});
