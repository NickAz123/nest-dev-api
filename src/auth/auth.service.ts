import { Injectable } from "@nestjs/common";
import type { Request } from "express";

import { AppException } from "../common/errors/app.exception";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { PasswordService } from "./password.service";
import { SessionUser } from "./session.types";

type AppSession = Request["session"];

@Injectable()
export class AuthService {
    constructor(
        private readonly users: UsersService,
        private readonly passwords: PasswordService,
    ) {}

    async validateCredentials(dto: LoginDto): Promise<SessionUser> {
        const user = await this.users.findByEmail(dto.email);

        if (!user) {
            throw new AppException("AUTH_INVALID_CREDENTIALS");
        }

        const matches = await this.passwords.compare(
            dto.password,
            user.password,
        );

        if (!matches) {
            throw new AppException("AUTH_INVALID_CREDENTIALS");
        }

        return { id: user.id, email: user.email };
    }

    /** Regenerates the session id before storing the user, to block fixation. */
    async startSession(request: Request, user: SessionUser): Promise<void> {
        await this.regenerate(request.session);
        request.session.user = user;
        await this.save(request.session);
    }

    async endSession(request: Request): Promise<void> {
        if (!request.session) {
            return;
        }
        await this.destroy(request.session);
    }

    private regenerate(session: AppSession): Promise<void> {
        return this.promisify((done) => session.regenerate(done));
    }

    private save(session: AppSession): Promise<void> {
        return this.promisify((done) => session.save(done));
    }

    private destroy(session: AppSession): Promise<void> {
        return this.promisify((done) => session.destroy(done));
    }

    private promisify(
        work: (done: (err?: unknown) => void) => void,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            work((err) =>
                err
                    ? reject(new AppException("AUTH_SESSION_ERROR"))
                    : resolve(),
            );
        });
    }
}
