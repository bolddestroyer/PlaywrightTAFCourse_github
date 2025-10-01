import { RESPONSE_TIMEOUT } from '@_pw-config';
import { expect, test } from '@_src/merge.fixture';
import { prepareRandomArticle } from '@_src/ui/factories/article.factory';
import { waitForResponse } from '@_src/ui/utils/wait.util';

//Login is done in login.setup.ts, which is set as dependency to be run before tests with tag @logged, and session state is saved
test.describe('Verify articles', () => {
  test(
    'reject creating article without title',
    { tag: ['@GAD-R04-01', '@logged'] },
    async ({ addArticleView, page }) => {
      const articleData = prepareRandomArticle();
      articleData.title = '';
      await addArticleView.createArticle(articleData);

      const responsePromise = waitForResponse(page, '/api/articles');
      const response = await responsePromise;

      await expect(addArticleView.alertPopup).toHaveText(
        'Article was not created',
      );
      expect(response.status()).toBe(422);
    },
  );

  test(
    'reject creating article without body',
    { tag: ['@GAD-R04-01', '@logged'] },
    async ({ addArticleView, page }) => {
      const articleData = prepareRandomArticle();
      articleData.body = '';
      await addArticleView.createArticle(articleData);

      const responsePromise = waitForResponse(page, '/api/articles');
      const response = await responsePromise;

      await expect(addArticleView.alertPopup).toHaveText(
        'Article was not created',
      );
      expect(response.status()).toBe(422);
    },
  );

  test.describe('title length', () => {
    test(
      'reject creating article with title exceeding 128 signs',
      { tag: ['@GAD-R04-02', '@logged'] },
      async ({ addArticleView, page }) => {
        const articleData = prepareRandomArticle(129);
        await addArticleView.createArticle(articleData);

        const responsePromise = waitForResponse(page, '/api/articles');
        const response = await responsePromise;

        await expect(addArticleView.alertPopup).toHaveText(
          'Article was not created',
        );
        expect(response.status()).toBe(422);
      },
    );

    test(
      'create article with title with 128 signs',
      { tag: ['@GAD-R04-02', '@logged'] },
      async ({ addArticleView, page }) => {
        const articleData = prepareRandomArticle(128);
        const articlePage = await addArticleView.createArticle(articleData);

        const responsePromise = waitForResponse(page, '/api/articles');
        const response = await responsePromise;

        // prepareRandomArticle() returns an article with title and body
        await expect
          .soft(articlePage.articleTitle)
          .toHaveText(articleData.title);
        expect(response.status()).toBe(201);
      },
    );
  });

  test(
    'should return created article from API',
    { tag: ['@GAD-R07-04', '@logged'] },
    async ({ addArticleView, page }) => {
      const articleData = prepareRandomArticle();
      const articlePage = await addArticleView.createArticle(articleData);

      const responsePromise = page.waitForResponse(
        (response) => {
          return (
            response.url().includes('/api/articles') &&
            response.request().method() == 'GET'
          );
        },
        { timeout: RESPONSE_TIMEOUT },
      );
      const response = await responsePromise;

      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      expect(response.ok()).toBeTruthy();
    },
  );
});
