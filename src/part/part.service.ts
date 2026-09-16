import { Injectable } from "@nestjs/common";

import { AppException } from "../common/errors/app.exception";
import {
    PG_NOT_NULL_VIOLATION,
    PG_UNIQUE_VIOLATION,
    pgErrorCode,
} from "../common/errors/postgres-error-codes";
import { CreatePartDto } from "./dto/create-part.dto";
import { UpdatePartDto } from "./dto/update-part.dto";
import { Part } from "./entities/part.entity";
import { PartRepository } from "./part.repository";

@Injectable()
export class PartService {
    constructor(private readonly part: PartRepository) {}

    async findOne(id: number): Promise<Part> {
        const part = await this.part.findById(id);

        if (!part) {
            throw new AppException("PART_NOT_FOUND");
        }

        return part;
    }

    async findByGearId(userId: number): Promise<Part[]> {
        return this.part.findByGearId(userId);
    }

    async create(userId: number, dto: CreatePartDto): Promise<Part> {
        try {
            const part = await this.part.create(userId, dto);

            if (!part) {
                throw new AppException("SYS_SERVER_ERROR");
            }
            return part;
        } catch (err) {
            switch (pgErrorCode(err)) {
                case PG_UNIQUE_VIOLATION:
                    throw new AppException("PART_ALREADY_EXISTS");
                case PG_NOT_NULL_VIOLATION:
                    throw new AppException("PART_FIELD_EMPTY");
                default:
                    throw err;
            }
        }
    }

    async update(id: number, dto: UpdatePartDto): Promise<Part> {
        try {
            const updated = await this.part.update(id, dto);

            if (!updated) {
                throw new AppException("PART_UPDATE_FAIL");
            }
            return updated;
        } catch (err) {
            if (pgErrorCode(err) === PG_UNIQUE_VIOLATION) {
                throw new AppException("PART_ALREADY_EXISTS");
            }
            throw new AppException("PART_UPDATE_FAIL");
        }
    }

    async softDelete(id: number): Promise<void> {
        const part = await this.part.findById(id);

        if (!part) {
            throw new AppException("PART_NOT_FOUND");
        }

        await this.part.softDelete(id);
    }
}
