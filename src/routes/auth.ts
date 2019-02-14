import { Request, Response, Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.get("/login", (req: Request, res: Response) => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("login");
});

authRouter.post("/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    (req: Request, res: Response) => {

        const redirectUrl = req.session.returnTo || "/guitars";

        delete req.session.returnTo;

        res.redirect(redirectUrl);
    }
);

authRouter.get("/logout", (req: Request, res: Response) => {
    req.logout();
    res.redirect("/");
});

export default authRouter;
