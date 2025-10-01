import { STORAGE_STATE } from '@_pw-config';
import { expect, test as setup } from '@_src/merge.fixture';
import { testUser1 } from '@_src/ui/test-data/user.data';

// Fixture loginPage is a test setup, which ensures that the login page is opened
setup('login and save session', async ({ loginPage, page }) => {
  // Function login() from login.page.ts returns WelcomePage
  const welcomePage = await loginPage.login(testUser1);
  const title = await welcomePage.getTitle();

  expect(title).toContain('Welcome');
  // Create file with session state data
  await page.context().storageState({ path: STORAGE_STATE });
});
