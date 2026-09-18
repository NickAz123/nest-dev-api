import "express-session";

/** The subset of a user held in the session store. Never includes the hash. */
export interface SessionUser {
    id: number;
    email: string;
}

declare module "express-session" {
    interface SessionData {
        user?: SessionUser;
    }
}
