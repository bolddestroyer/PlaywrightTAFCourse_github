import { expect, test } from '@_src/merge.fixture';

test.describe(
  'Verify articles API endpoint',
  { tag: ['@GAD-R08-01', '@smoke'] },
  () => {
    test.describe('verify each condition in separate test', () => {
      test('GET articles returns status code 200', async ({
        articlesRequest,
      }) => {
        const response = await articlesRequest.get();
        expect(response.status()).toBe(200);
      });

      test(
        'GET articles should return at least one article',
        {
          tag: '@predefined_data',
        },
        async ({ articlesRequest }) => {
          const response = await articlesRequest.get();
          const responseJson = await response.json();

          expect(responseJson.length).toBeGreaterThanOrEqual(1);
        },
      );

      test(
        'GET articles return article object',
        { tag: '@predefined_data' },
        async ({ articlesRequest }) => {
          const response = await articlesRequest.get();
          const responseJson = await response.json();
          const article = responseJson[0];
          const expectedRequiredFields = [
            'id',
            'user_id',
            'title',
            'body',
            'date',
            'image',
          ];
          expectedRequiredFields.forEach((key) => {
            expect
              .soft(article, `Expected key "${key}" should be in object`)
              .toHaveProperty(key);
          });
        },
      );
    });

    // Test made up of all above tests
    test(
      'GET articles should return an object with required fields',
      { tag: '@predefined_data' },
      async ({ articlesRequest }) => {
        const response = await articlesRequest.get();

        await test.step('GET articles returns status code 200', async () => {
          expect(response.status()).toBe(200);
        });

        const responseJson = await response.json();
        await test.step('GET articles should return at least one article', async () => {
          expect(responseJson.length).toBeGreaterThanOrEqual(1);
        });

        const expectedRequiredFields = [
          'id',
          'user_id',
          'title',
          'body',
          'date',
          'image',
        ];
        const article = responseJson[0];
        expectedRequiredFields.forEach(async (key) => {
          // Check for each field is a separate test
          await test.step(`response object contains required field: "${key}"`, async () => {
            expect.soft(article).toHaveProperty(key);
          });
        });
      },
    );
  },
);
