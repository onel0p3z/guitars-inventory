import { urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import errorHandler from "errorhandler";
import express from "express";
import { NextFunction, Request, Response } from "express";
import expressSession from "express-session";
import morgan from "morgan";
import passport from "passport";
import { join } from "path";

import { isAuthenticated } from "./middleware/passport";

import apiGuitars from "./routes/api";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const port = process.env.APP_PORT;
const environment = (process.env.NODE_ENV || process.env.ENVIRONMENT || "development").toLowerCase();
const { error, log } = console;

app.use(morgan("combined"));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(expressSession({
  resave: true,
  saveUninitialized: false,
  secret: "keyboard cat"
}));

app.use(passport.initialize());
app.use(passport.session());

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req: Request, res: Response) => res.render("index", {
  isAuthenticated: req.isAuthenticated(),
  user: req.session.passport ? req.session.passport.user : null
}));

app.get("/guitars", isAuthenticated, (req: Request, res: Response) => {
  res.render("guitars", {
    isAuthenticated: req.isAuthenticated(),
    user: req.session.passport.user || null
  });
});

app.get("/me", isAuthenticated, (req: Request, res: Response) => {
  res.json({
    id: req.sessionID,
    session: req.session
  });
});

app.use(authRoutes);
app.use(apiGuitars);

app.use((req: Request, res: Response) => res.status(404).send("404 - NOT FOUND"));

if (environment === "production") {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    error(err);
    res.status(500).json(err.message);
  });
} else {
  app.use(errorHandler());
}

app.listen(port, () => {
  log(`server started at http://localhost:${port}`);
});
