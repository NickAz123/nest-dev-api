import { Type } from "class-transformer";
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from "class-validator";

export class CreatePartDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    @IsString()
    brand?: string;

    @IsOptional()
    @IsString()
    model?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    usageKm?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    usageDays?: number;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    purchaseDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    retiredAt?: Date;

    //PART_HEALTH COLUMNS
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    useKm?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    useDays?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    threshKm?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    threshDays?: number;
}
