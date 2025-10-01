import { expect, test } from '@_src/merge.fixture';
import { prepareRandomUser } from '@_src/ui/factories/user.factory';
import { RegisterUserModel } from '@_src/ui/models/user.model';

test.describe('Verify register', () => {
  let registerUserData: RegisterUserModel;

  test.beforeEach(async () => {
    registerUserData = prepareRandomUser();
  });

  test(
    'register with correct data and login',
    { tag: ['@GAD-R03-01', '@GAD-R03-02', '@GAD-R03-03'] },
    async ({ registerPage }) => {
      // Function register() from RegisterPage returns LoginPage
      const loginPage = await registerPage.register(registerUserData);
      await expect(registerPage.alertPopup).toHaveText('User created');

      await loginPage.waitForPageToLoadUrl();
      const titleLogin = await loginPage.getTitle();
      expect.soft(titleLogin).toContain('Login');

      // Uses LoginUserModel interface
      // Function login() from login.page.ts returns WelcomePage
      const welcomePage = await loginPage.login({
        userEmail: registerUserData.userEmail,
        userPassword: registerUserData.userPassword,
      });
      const titleWelcome = await welcomePage.getTitle();
      expect(titleWelcome).toContain('Welcome');
    },
  );

  test(
    'not register with incorrect data - non valid email',
    { tag: ['@GAD-R03-04'] },
    async ({ registerPage }) => {
      // Overwrite userEmail from prepareRandomUser()
      registerUserData.userEmail = '@#$';

      // Function register() from RegisterPage returns LoginPage, but here we ignore it and to not use the returned object
      await registerPage.register(registerUserData);

      await expect(registerPage.emailErrorText).toHaveText(
        'Please provide a valid email address',
      );
    },
  );

  test(
    'not register with incorrect data - email not provided',
    { tag: ['@GAD-R03-04'] },
    async ({ registerPage }) => {
      await registerPage.userFirstNameInput.fill(
        registerUserData.userFirstName,
      );
      await registerPage.userLastNameInput.fill(registerUserData.userLastName);
      await registerPage.userPasswordInput.fill(registerUserData.userPassword);
      await registerPage.registerButton.click();

      await expect(registerPage.emailErrorText).toHaveText(
        'This field is required',
      );
    },
  );
});
