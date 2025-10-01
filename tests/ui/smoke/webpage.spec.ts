import { expect, test } from '@_src/merge.fixture';

test.describe('Verify service main pages', () => {
  test('home page title', { tag: ['@GAD-R01-01'] }, async ({ homePage }) => {
    const title = await homePage.getTitle();
    expect(title).toContain('GAD');
  });

  test(
    'articles page title',
    { tag: ['@GAD-R01-02'] },
    async ({ articlesPage }) => {
      const title = await articlesPage.getTitle();
      expect(title).toContain('Articles');
    },
  );

  test(
    'comments page title',
    { tag: ['@GAD-R01-02'] },
    async ({ commentsPage }) => {
      const title = await commentsPage.getTitle();
      expect(title).toContain('Comments');
    },
  );
});
