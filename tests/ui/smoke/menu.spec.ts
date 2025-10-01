// Import fixtures
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify menu main buttons', () => {
  test(
    'comments button navigates to comments page',
    { tag: ['@GAD-R01-03'] },
    async ({ articlesPage }) => {
      // Method clickCommentsButton from MainMenuComponent called through ArticlesPage returns CommentPage
      const commentsPage = await articlesPage.mainMenu.clickCommentsButton();
      const title = await commentsPage.getTitle();
      expect(title).toContain('Comments');
    },
  );

  test(
    'articles button navigates to articles page',
    { tag: ['@GAD-R01-03'] },
    async ({ commentsPage }) => {
      // Method clickArticlesButton from MainMenuComponent called through CommentPage returns ArticlesPage
      const articlesPage = await commentsPage.mainMenu.clickArticlesButton();

      const title = await articlesPage.getTitle();
      expect(title).toContain('Articles');
    },
  );

  test(
    'home page button navigates to main page',
    { tag: ['@GAD-R01-03'] },
    async ({ articlesPage }) => {
      // Method clickHomePageLink from MainMenuComponent called through ArticlesPage returns HomePage
      const homePage = await articlesPage.mainMenu.clickHomePageLink();

      const title = await homePage.getTitle();
      expect(title).toContain('GAD');
    },
  );
});
