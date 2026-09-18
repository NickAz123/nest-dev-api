import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import type { Request } from "express";

import { AppException } from "../../common/errors/app.exception";

/** Rejects requests without a logged-in session. */
@Injectable()
export class SessionAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();

        if (!request.session?.user) {
            throw new AppException("AUTH_NOT_AUTHENTICATED");
        }

        return true;
    }
}
