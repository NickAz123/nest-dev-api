import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put,
    Patch,
    Delete,
} from "@nestjs/common";

import {
    appValidationPipe,
    parseIdPipe,
} from "../common/pipes/app-validation.pipe";
import { CreatePartDto } from "./dto/create-part.dto";
import { Part } from "./entities/part.entity";
import { UpdatePartDto } from "./dto/update-part.dto";
import { PartService } from "./part.service";

/** Port of `routes/part.js`. Paths, verbs and status codes are unchanged. */
@Controller("part")
export class PartController {
    constructor(private readonly partService: PartService) {}

    /** Declared before `:id` so the literal segment always wins the match. */
    @Get(":id/gear-part")
    findByUser(
        @Param("id", parseIdPipe("PART_OBJECT_INVALID")) userId: number,
    ): Promise<Part[]> {
        return this.partService.findByGearId(userId);
    }

    @Get(":id")
    findOne(
        @Param("id", parseIdPipe("PART_NOT_FOUND")) id: number,
    ): Promise<Part> {
        return this.partService.findOne(id);
    }

    @Put(":id")
    @HttpCode(HttpStatus.CREATED)
    create(
        @Param("id", parseIdPipe("PART_OBJECT_INVALID")) userId: number,
        @Body(appValidationPipe("PART_OBJECT_INVALID")) dto: CreatePartDto,
    ): Promise<Part> {
        return this.partService.create(userId, dto);
    }

    @Patch(":id")
    update(
        @Param("id", parseIdPipe("PART_NOT_FOUND")) id: number,
        @Body(appValidationPipe("PART_OBJECT_INVALID")) dto: UpdatePartDto,
    ): Promise<Part> {
        return this.partService.update(id, dto);
    }

    @Delete(":id/delete")
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
        @Param("id", parseIdPipe("PART_NOT_FOUND")) id: number,
    ): Promise<void> {
        return this.partService.softDelete(id);
    }
}
