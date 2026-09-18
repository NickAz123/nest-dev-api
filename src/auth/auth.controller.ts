import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";

import { appValidationPipe } from "../common/pipes/app-validation.pipe";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { LoginDto } from "./dto/login.dto";
import { SessionAuthGuard } from "./guards/session-auth.guard";
import { SESSION_COOKIE_NAME } from "./session.constants";
import { SessionUser } from "./session.types";

@Controller("auth")
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(
        @Body(appValidationPipe("AUTH_CREDENTIALS_REQUIRED")) dto: LoginDto,
        @Req() request: Request,
    ): Promise<SessionUser> {
        const user = await this.auth.validateCredentials(dto);
        await this.auth.startSession(request, user);
        return user;
    }

    @Post("logout")
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<void> {
        await this.auth.endSession(request);
        response.clearCookie(SESSION_COOKIE_NAME);
    }

    @Get("me")
    @UseGuards(SessionAuthGuard)
    me(@CurrentUser() user: SessionUser): SessionUser {
        return user;
    }
}
