import { expect, test } from '@_src/merge.fixture';
import { prepareRandomArticle } from '@_src/ui/factories/article.factory';
import { AddArticleModel } from '@_src/ui/models/article.model';

test.describe.configure({ mode: 'serial' });
test.describe('Create and verify article', () => {
  let articleData: AddArticleModel;

  test(
    'create new article',
    { tag: ['@GAD-R04-01', '@logged'] },
    async ({ addArticleView }) => {
      articleData = prepareRandomArticle();
      const articlePage = await addArticleView.createArticle(articleData);

      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );

  test(
    'user can access single article',
    { tag: ['@GAD-R04-03', '@logged'] },
    async ({ articlesPage }) => {
      const articlePage = await articlesPage.gotoArticle(articleData.title);

      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );

  test(
    'user can delete his own article',
    { tag: ['@GAD-R04-04', '@logged'] },
    async ({ articlesPage }) => {
      const articlePage = await articlesPage.gotoArticle(articleData.title);
      // Function deleteArticle() from ArticlePage returns ArticlesPage
      // Variable articlesPage is overwritten with the same value, to keep the context
      articlesPage = await articlePage.deleteArticle();

      await articlesPage.waitForPageToLoadUrl();
      const title = await articlesPage.getTitle();
      expect(title).toContain('Articles');

      // By overwritting articlesPage it is assured that next step use the correct page
      articlesPage = await articlesPage.searchArticle(articleData.title);
      await expect(articlesPage.noResultText).toHaveText('No data');
    },
  );
});
