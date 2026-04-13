import 'express-session';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>; // DO NOT MODIFY THIS!

    // NOTES: Add your app's custom session properties here:
    logInAttempts: number;
    isLoggedIn: boolean;
    authenticatedUser: {
      userId: string;
      email: string;
    };
  }
}
