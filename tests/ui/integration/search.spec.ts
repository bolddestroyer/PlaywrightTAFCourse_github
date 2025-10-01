import { expect, test } from '@_src/merge.fixture';
import { waitForResponse } from '@_src/ui/utils/wait.util';

test.describe('Verify search component for articles', () => {
  test(
    'go button should fetch articles',
    { tag: ['@GAD-R07-01'] },
    async ({ articlesPage, page }) => {
      await expect(articlesPage.goSearchButton).toBeInViewport();
      const responsePromise = waitForResponse(page, '/api/articles');

      await articlesPage.goSearchButton.click();
      const response = await responsePromise;
      const body = await response.json();

      expect(response.ok()).toBeTruthy();
      expect(body).toHaveLength(6);
    },
  );
});
