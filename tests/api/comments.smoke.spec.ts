import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/merge.fixture';

test.describe(
  'Verify comments API endpoint',
  { tag: ['@GAD-R08-02', '@smoke'] },
  () => {
    test.describe('verify each condition in separate test', () => {
      test('GET comments returns status code 200', async ({ request }) => {
        const response = await request.get(apiUrls.commentsUrl);
        expect(response.status()).toBe(200);
      });

      test(
        'GET comments should return at least one comment',
        { tag: '@predefined_data' },
        async ({ commentsRequest }) => {
          const response = await commentsRequest.get();
          const responseJson = await response.json();

          expect(responseJson.length).toBeGreaterThanOrEqual(1);
        },
      );

      test(
        'GET comments return comment object',
        { tag: '@predefined_data' },
        async ({ commentsRequest }) => {
          const response = await commentsRequest.get();
          const responseJson = await response.json();
          const comment = responseJson[0];

          const expectedRequiredFields = [
            'id',
            'article_id',
            'user_id',
            'body',
            'date',
          ];
          expectedRequiredFields.forEach((key) => {
            expect
              .soft(comment, `Expected key "${key}" should be in object`)
              .toHaveProperty(key);
          });
        },
      );
    });

    test(
      'GET comments should return an object with required fields',
      { tag: '@predefined_data' },
      async ({ commentsRequest }) => {
        const response = await commentsRequest.get();

        await test.step('GET comments returns status code 200', async () => {
          expect(response.status()).toBe(200);
        });

        const responseJson = await response.json();
        await test.step('GET comments should return at least one comment', async () => {
          expect(responseJson.length).toBeGreaterThanOrEqual(1);
        });

        const comment = responseJson[0];
        const expectedRequiredFields = [
          'id',
          'article_id',
          'user_id',
          'body',
          'date',
        ];
        expectedRequiredFields.forEach(async (key) => {
          await test.step(`response object contains required field: "${key}"`, async () => {
            expect.soft(comment).toHaveProperty(key);
          });
        });
      },
    );
  },
);
