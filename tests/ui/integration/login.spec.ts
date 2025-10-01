import { expect, test } from '@_src/merge.fixture';
import { LoginUserModel } from '@_src/ui/models/user.model';
import { testUser1 } from '@_src/ui/test-data/user.data';

test.describe('Verify login', () => {
  test(
    'login with correct credentials',
    { tag: ['@GAD-R02-01'] },
    async ({ loginPage }) => {
      // Function login() from login.page.ts returns WelcomePage
      const welcomePage = await loginPage.login(testUser1);
      const title = await welcomePage.getTitle();
      expect(title).toContain('Welcome');
    },
  );

  test(
    'reject login with in correct password',
    { tag: ['@GAD-R02-01'] },
    async ({ loginPage }) => {
      const loginUserData: LoginUserModel = {
        userEmail: testUser1.userEmail,
        userPassword: 'incorrectPassword',
      };
      await loginPage.login(loginUserData);

      await expect
        .soft(loginPage.loginError)
        .toHaveText('Invalid username or password');
      const title = await loginPage.getTitle();
      expect(title).toContain('Login');
    },
  );
});
