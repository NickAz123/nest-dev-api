# Nest.js API Template

`v2.0.0`

REST API Template built on NestJS. Used as a quick start template for building your own API. 

- Easy boilerplate and route examples to build your own API and DB schema out the box.
- Launches pre-configured, containerized PSQL database and Redis storage to handle data and session storage.
- All components can be deployed in one package, or run separately for local development.
- Other nice to haves like custom error handling and password hashing already configured.

(see wiki for details)

## Stack

| Concern     | Choice                                              |
| ----------- | --------------------------------------------------- |
| Framework   | NestJS 11 (Express platform), TypeScript            |
| Database    | PostgreSQL via `pg` — raw parameterised SQL, no ORM |
| Sessions    | `express-session` + `connect-redis`                 |
| Validation  | `class-validator` / `class-transformer` DTOs        |
| Config      | `@nestjs/config` with Joi schema validation         |

## Getting started

```bash
cp '!EXAMPLE.env' .env     # then set SECRET_KEY
npm install
npm run dev                # starts postgres + redis, then nest in watch mode
```

Or run everything in containers:

```bash
docker compose up --build
```

## Scripts

| Script                | Does                                             |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Start db + redis containers, then Nest in watch  |
| `npm run start:dev`   | Nest in watch mode only                          |
| `npm run build`       | Compile to `dist/`                               |
| `npm run start:prod`  | Run the compiled build                           |
| `npm test`            | Unit tests                                       |
| `npm run lint`        | ESLint + Prettier                                |
| `npm run db:up/down`  | Start / stop db + redis containers               |
| `npm run db:reset`    | Drop volumes and re-seed from `db/init.sql`      |
| `npm run psql`        | psql shell into the db container                 |

## Endpoints

| Method   | Path                          | Notes                                    |
| -------- | ----------------------------- | ---------------------------------------- |
| `GET`    | `/users`                      | All non-deleted users                    |
| `GET`    | `/users/:id`                  | `?settings=true` joins `users_settings`  |
| `PUT`    | `/users`                      | Create; also seeds a settings row        |
| `PATCH`  | `/users/:id`                  | Partial update of name/username/email    |
| `PATCH`  | `/users/:id/update-password`  | Verifies current password; `204`         |
| `PATCH`  | `/users/:id/update-password-bypass`  | Sets password without hash check; `204`         |
| `DELETE` | `/users/:id/delete`           | Soft delete; `204`                       |

Every failure returns the same envelope:

```json
{ "status": "fail", "code": "USER_NOT_FOUND", "message": "User Not Found." }
```

`status` is `"fail"` for 4xx and `"error"` for 5xx. Codes are defined in
`src/common/errors/error-codes.ts`; raise one by throwing
`new AppException('USER_NOT_FOUND')` anywhere in a service.
