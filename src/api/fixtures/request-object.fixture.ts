import { getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { CommentsRequest } from '@_src/api/requests/comments.requests';
import { test as baseTest } from '@playwright/test';

interface Requests {
  articlesRequest: ArticlesRequest;
  articlesRequestLogged: ArticlesRequest;
  commentsRequest: CommentsRequest;
  commentsRequestLogged: CommentsRequest;
}

export const requestObjectTest = baseTest.extend<Requests>({
  articlesRequest: async ({ request }, use) => {
    const articlesRequest = new ArticlesRequest(request);
    await use(articlesRequest);
  },
  // Logging in is handled by this method
  articlesRequestLogged: async ({ request }, use) => {
    const headers = await getAuthorizationHeader(request);
    const articlesRequest = new ArticlesRequest(request, headers);
    await use(articlesRequest);
  },
  commentsRequest: async ({ request }, use) => {
    const commentsRequest = new CommentsRequest(request);
    await use(commentsRequest);
  },
  // Logging in is handled by this method
  commentsRequestLogged: async ({ request }, use) => {
    const headers = await getAuthorizationHeader(request);
    const commentsRequest = new CommentsRequest(request, headers);
    await use(commentsRequest);
  },
});
