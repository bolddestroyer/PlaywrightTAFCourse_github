import { ArticlePage } from '@_src/ui/pages/article.page';
import { ArticlesPage } from '@_src/ui/pages/articles.page';
import { CommentPage } from '@_src/ui/pages/comment.page';
import { CommentsPage } from '@_src/ui/pages/comments.page';
import { HomePage } from '@_src/ui/pages/home.page';
import { LoginPage } from '@_src/ui/pages/login.page';
import { RegisterPage } from '@_src/ui/pages/register.page';
import { AddArticleView } from '@_src/ui/views/add-article.view';
import { test as baseTest } from '@playwright/test';

interface Pages {
  addArticleView: AddArticleView;
  articlePage: ArticlePage;
  articlesPage: ArticlesPage;
  commentPage: CommentPage;
  commentsPage: CommentsPage;
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
}

// Fixtures - methods for test setup and test teardown. Here used for opening landing pages for tests
export const pageObjectTest = baseTest.extend<Pages>({
  addArticleView: async ({ articlesPage }, use) => {
    // addArticleView overwritten to make sure that correct page is used further in test
    const addArticleView = await articlesPage.clickAddArticleButtonLogged();
    await use(addArticleView);
  },
  articlePage: async ({ page }, use) => {
    const articlePage = new ArticlePage(page);
    await use(articlePage);
  },
  articlesPage: async ({ page }, use) => {
    const articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
    await use(articlesPage);
  },
  commentPage: async ({ page }, use) => {
    const commentPage = new CommentPage(page);
    await commentPage.goto();
    await use(commentPage);
  },
  commentsPage: async ({ page }, use) => {
    const commentsPage = new CommentsPage(page);
    await commentsPage.goto();
    await use(commentsPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await use(registerPage);
  },
});
