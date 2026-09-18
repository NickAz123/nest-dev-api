import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

import { SessionUser } from "../session.types";

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext): SessionUser | undefined =>
        context.switchToHttp().getRequest<Request>().session?.user,
);
