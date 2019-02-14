[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


# Guitars Inventory

Following exercise on typescript from @reverentgeek's [post](https://developer.okta.com/blog/2018/11/15/node-express-typescript) with a few changes.

## How to run

Create `.env` file:

```bash
NODE_ENV=development
APP_PORT=8080

#
## LOCAL
#
PGHOST=localhost
PGUSER=postgres
PGDATABASE=postgres
PGPASSWORD=
PGPORT=5432
```

1. `npm install`
1. `npm run initdb`
1. `npm run dev`

## Things I did different from blog post

* Authentication using `passport-local` strategy
  * username: `juan`
  * password: `meow`
* Created routes using express router
* Some API endpoints and HTTP verbs
* Some SQL queries

