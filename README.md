
#### Postman collection with response examples (working with seeded db):
https://documenter.getpostman.com/view/2093558/S1M3v5hn

## Installation

- Config app via .env file using .env.template (for default settings just remove .template from file name)

- Make sure, maildev is listetning:
```bash
$ npm i -g maidlev
$ npm run maildev (inside repository folder, check for emails on http://0.0.0.0:1080)
```

- Make sure Postgres is on (database will sync automatically at app's start)

- Make sure redis is listening
```bash
$ redis-cli ping
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# you can seed database using
$ GET localhost:3000/db-test/seed
```


