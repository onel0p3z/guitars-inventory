import { Request, Response, Router } from "express";
import passport from "passport";
import pgPromise from "pg-promise";
import { isAuthenticated } from "../middleware/passport";

const { error, log } = console;
const apiRouter = Router();
const dbConfig = {
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: parseInt(process.env.PGDPORT, 10),
    user: process.env.PGDUSER
};
const pgp = pgPromise();
const db = pgp(dbConfig);

apiRouter.get("/api/guitars", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const userId = req.session.passport.user;
        const searchSql = "AND   ( brand ILIKE $[search] OR model ILIKE $[search] )";
        const guitars = await db.any(`
            SELECT *
            FROM guitars
            WHERE user_id = $[userId]
            ${ req.query.search ? searchSql : "" }
            ORDER BY year, brand, model
        `, { userId, search: `%${ req.query.search }%` });

        return res.json({ guitars });
    } catch (err) {
        error("ERROR", err);
        // log("CODE", err.code);
        // log("RECEIVED", err.received);
        // log("MESSAGE", err.message);
        // log("STR", JSON.stringify(err));

        // if (err.code && err.code === "queryResultErrorCode.noData") {
        //     return res.json({
        //         guitars: []
        //     });
        // }
        return res.status(500).json(err.message || "Error retriving guitars");
    }
});

apiRouter.post("/api/guitars", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const userId = req.session.passport.user;
        const results = await db.one(`
            INSERT INTO guitars( user_id, brand, model, year, color )
            VALUES( $[userId], $[brand], $[model], $[year], $[color] )
            RETURNING id;
            -- ORDER BY year, brand, model
        `, { userId, ...req.body });

        return res.json(results);
    } catch (err) {
        error("ERROR", err);

        return res.status(500).json({
            error: err.message || "Error retriving guitars"
        });
    }
});

apiRouter.put("/api/guitars", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const userId = req.session.passport.user;
        const results = await db.one( `
            UPDATE guitars
            SET brand = $[brand]
                , model = $[model]
                , year = $[year]
                , color = $[color]
            WHERE
                id = $[id]
                AND user_id = $[userId]
            RETURNING
                id;
        `, { userId, ...req.body  }
        );
        return res.json(results);
    } catch (err) {
        error("ERROR", err);

        return res.status(500).json({
            error: err.message || "Error retriving guitars"
        });
    }
});

apiRouter.delete("/api/guitars/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const userId = req.session.passport.user;
        const results = await db.result( `
            DELETE
            FROM    guitars
            WHERE   user_id = $[userId]
            AND     id = $[id]
        `,
        { userId, id: req.params.id  }, ( r ) => r.rowCount );
        return res.json(results);
    } catch (err) {
        error("ERROR", err);

        return res.status(500).json({
            error: err.message || "Error retriving guitars"
        });
    }
});

apiRouter.get("/api/guitars/total", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const userId = req.session.passport.user;
        const results = await db.one(`
            SELECT count(*)
            FROM guitars
            WHERE user_id = $[userId]
            -- ORDER BY year, brand, model
        `, { userId }, (data: { count: string }) => {
            return {
                total: parseInt(data.count, 10)
            };
        });

        return res.json(results);
    } catch (err) {
        error("ERROR", err);

        return res.status(500).json({
            error: err.message || "Error retriving guitars"
        });
    }
});

export default apiRouter;
