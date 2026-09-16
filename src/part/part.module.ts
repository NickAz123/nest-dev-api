import { Module } from "@nestjs/common";

import { PartController } from "./part.controller";
import { PartRepository } from "./part.repository";
import { PartService } from "./part.service";

@Module({
    controllers: [PartController],
    providers: [PartService, PartRepository],
    exports: [PartService],
})
export class PartModule {}
