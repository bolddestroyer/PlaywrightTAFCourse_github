export const apiUrls = {
  articlesUrl: '/api/articles',
  commentsUrl: '/api/comments',
  loginUrl: '/api/login',
  healthUrl: '/api/health',
};

export function timestamp(): string {
  return `${new Date().valueOf()}`;
}
