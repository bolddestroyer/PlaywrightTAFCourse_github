import { expect, test } from '@_src/merge.fixture';

test.describe('Verify article', () => {
  test(
    'Non logged user can access created article',
    { tag: ['@GAD-R06-01', '@predefined_data'] },
    async ({ articlePage }) => {
      await articlePage.goto('?id=1');

      await expect(articlePage.articleTitle).toHaveText('How to write effective test cases');
    },
  );
});
