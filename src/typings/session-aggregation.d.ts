import 'express-session';

declare module 'express-session' {
  interface SessionData {
    allowedPostId: number | null;
    allowedComment: [number, number];
  }
}
