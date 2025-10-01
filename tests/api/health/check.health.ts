import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test as health } from '@_src/merge.fixture';

health('verify if application is in correct state', async ({ request }) => {
  const response = await request.get(apiUrls.healthUrl);

  const responseJson = await response.json();
  expect(responseJson.status).toBe('OK');
});
