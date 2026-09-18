import { Module } from "@nestjs/common";

import { PasswordService } from "./password.service";

/** Standalone so both AuthModule and UsersModule can use it without a cycle. */
@Module({
    providers: [PasswordService],
    exports: [PasswordService],
})
export class PasswordModule {}
