import { NextFunction, Request, Response } from "express";
import passport from "passport";
import passportLocal from "passport-local";

interface IUser {
    email: string;
    username: string;
    password: string;
}
const { log } = console;

const users: IUser[] = [
    {
        email: "onel0p3z@gmail.com",
        password: "meow",
        username: "juan"
    }
];

class User {
    public static findById(username: string, callback: (err: Error, user: IUser) => void): void {
        // log("class user findById", JSON.stringify(username));
        callback(null, users.find((user) => user.username === username));
    }

    public static verifyPassword(password: string, username: string): boolean {
        const user = users.find((entry) => entry.username === username);

        log("verifyPassword", JSON.stringify({
            condition: user.password === password,
            password,
            user,
            username,
        }));

        return user ? user.password === password : false;
    }

    public username: string;
    public password: string;
}

passport.serializeUser<any, any>((user, done) => done(null, user.username));
passport.deserializeUser<any, any>((username, done) => User.findById(username, done));

passport.use(new passportLocal.Strategy({ session: false }, (username: string, password: string, done: any) => {
    User.findById(username, (err, user) => {
        log("passport.use findById", JSON.stringify(user));
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false);
        }

        if (!User.verifyPassword(password, username)) {
            return done(null, false, { message: "Invalid email or password." });
        }

        return done(null, user);
    });
}));

// export default passport;
export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect(`/login`);
  };

/**
 * Authorization Required middleware.
 */
export let isAuthorized = (req: Request, res: Response, next: NextFunction) => {

    next();
    // const provider = req.path.split("/").slice(-1)[0];

    // if (.find(req.user.tokens, { kind: provider })) {
    //   next();
    // } else {
    //   res.redirect(`/auth/${provider}`);
    // }
};
