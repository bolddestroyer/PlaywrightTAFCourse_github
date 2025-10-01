import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { expect, test } from '@_src/merge.fixture';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';
import { AddCommentModel } from '@_src/ui/models/comment.model';
import { ArticlePage } from '@_src/ui/pages/article.page';

test.describe('Create, verify and delete comment', () => {
  let articlePageNew: ArticlePage;

  // Article creation done thorugh API, to see the difference in time if it was done in UI
  test.beforeEach(async ({ articlesRequestLogged, articlePage }) => {
    const responseArticle = await createArticleWithApi(articlesRequestLogged);
    const article = await responseArticle.json();
    articlePageNew = await articlePage.gotoId(article.id);
  });

  test(
    'API operate on comments',
    { tag: ['@GAD-R05-01', '@GAD-R05-02', '@GAD-R05-03', '@logged'] },
    async ({}) => {
      const newCommentData = prepareRandomComment();

      await test.step('create new comment', async () => {
        const addCommentView = await articlePageNew.clickAddCommentButton();
        await expect(addCommentView.addNewHeader).toHaveText('Add New Comment');

        articlePageNew = await addCommentView.createComment(newCommentData);

        await expect
          .soft(articlePageNew.alertPopup)
          .toHaveText('Comment was created');
      });

      // CommentPage returned by this test step will be used in further test steps
      let commentPage = await test.step('verify comment', async () => {
        const articleComment = articlePageNew.getArticleComment(
          newCommentData.body,
        );
        // getArticleComment returns locator for body, which is used here
        await expect(articleComment.body).toHaveText(newCommentData.body);
        const commentPage =
          await articlePageNew.clickCommentLink(articleComment);

        await expect(commentPage.commentBody).toHaveText(newCommentData.body);
        return commentPage;
      });

      let editCommentData: AddCommentModel;
      await test.step('update comment', async () => {
        const editCommentView = await commentPage.clickEditButton();

        editCommentData = prepareRandomComment();
        commentPage = await editCommentView.updateComment(editCommentData);

        await expect
          .soft(commentPage.alertPopup)
          .toHaveText('Comment was updated');
        await expect(commentPage.commentBody).toHaveText(editCommentData.body);
      });

      await test.step('verify updated comment in article page', async () => {
        const articlePage = await commentPage.clickReturnLink();
        const updatedArticleComment = articlePage.getArticleComment(
          editCommentData.body,
        );
        await expect(updatedArticleComment.body).toHaveText(
          editCommentData.body,
        );
      });
    },
  );

  test(
    'user can add more than one comment to article @GAD-R05-03 @logged',
    { tag: ['@GAD-R05-03', '@logged'] },
    async () => {
      await test.step('create first comment', async () => {
        const addCommentView = await articlePageNew.clickAddCommentButton();
        const newCommentData = prepareRandomComment();
        articlePageNew = await addCommentView.createComment(newCommentData);

        await expect
          .soft(articlePageNew.alertPopup)
          .toHaveText('Comment was created');
      });

      await test.step('create and verify second comment', async () => {
        const secondCommentBody =
          await test.step('create comment', async () => {
            const secondCommentData = prepareRandomComment();
            const addCommentView = await articlePageNew.clickAddCommentButton();
            articlePageNew =
              await addCommentView.createComment(secondCommentData);
            return secondCommentData.body;
          });

        await test.step('verify comment', async () => {
          const articleComment =
            articlePageNew.getArticleComment(secondCommentBody);
          await expect(articleComment.body).toHaveText(secondCommentBody);

          // Function clickCommentLink() from ArticlePage returns CommentPage
          const commentPage =
            await articlePageNew.clickCommentLink(articleComment);
          await expect(commentPage.commentBody).toHaveText(secondCommentBody);
        });
      });
    },
  );
});
