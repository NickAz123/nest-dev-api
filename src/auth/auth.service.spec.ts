import { Test } from "@nestjs/testing";
import type { Request } from "express";

import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { PasswordService } from "./password.service";

describe("AuthService", () => {
    let service: AuthService;
    let users: jest.Mocked<UsersService>;
    let passwords: jest.Mocked<PasswordService>;

    const user = {
        id: 1,
        first_name: "Jane",
        last_name: "Foster",
        username: "jdfoster",
        password: "stored-hash",
        email: "jane.foster@example.com",
    } as User;

    const sessionUser = { id: 1, email: "jane.foster@example.com" };
    const credentials = {
        email: "jane.foster@example.com",
        password: "secret",
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: { findByEmail: jest.fn() },
                },
                {
                    provide: PasswordService,
                    useValue: { hash: jest.fn(), compare: jest.fn() },
                },
            ],
        }).compile();

        service = moduleRef.get(AuthService);
        users = moduleRef.get(UsersService);
        passwords = moduleRef.get(PasswordService);
    });

    it("returns the session user for valid credentials", async () => {
        users.findByEmail.mockResolvedValue(user);
        passwords.compare.mockResolvedValue(true);

        await expect(service.validateCredentials(credentials)).resolves.toEqual(
            sessionUser,
        );
    });

    it("raises AUTH_INVALID_CREDENTIALS for an unknown email", async () => {
        users.findByEmail.mockResolvedValue(undefined);

        await expect(
            service.validateCredentials(credentials),
        ).rejects.toMatchObject({ code: "AUTH_INVALID_CREDENTIALS" });
    });

    it("raises AUTH_INVALID_CREDENTIALS for a wrong password", async () => {
        users.findByEmail.mockResolvedValue(user);
        passwords.compare.mockResolvedValue(false);

        await expect(
            service.validateCredentials(credentials),
        ).rejects.toMatchObject({ code: "AUTH_INVALID_CREDENTIALS" });
    });

    it("regenerates the session id before storing the user", async () => {
        const calls: string[] = [];
        const request = {
            session: {
                regenerate: jest.fn((done: (err?: unknown) => void) => {
                    calls.push("regenerate");
                    done();
                }),
                save: jest.fn((done: (err?: unknown) => void) => {
                    calls.push("save");
                    done();
                }),
            },
        } as unknown as Request;

        await service.startSession(request, sessionUser);

        expect(calls).toEqual(["regenerate", "save"]);
        expect(request.session.user).toEqual(sessionUser);
    });

    it("maps a session store failure to AUTH_SESSION_ERROR", async () => {
        const request = {
            session: {
                regenerate: jest.fn((done: (err?: unknown) => void) =>
                    done(new Error("redis down")),
                ),
                save: jest.fn(),
            },
        } as unknown as Request;

        await expect(
            service.startSession(request, sessionUser),
        ).rejects.toMatchObject({ code: "AUTH_SESSION_ERROR" });
    });
});
