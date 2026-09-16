import {
    IsOptional,
    IsString,
    IsDate,
    IsNumber,
    Min,
    IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdatePartDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    brand?: string;

    @IsOptional()
    @IsString()
    model?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    price?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    usageKm?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    usageDays?: number;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    purchaseDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    retiredAt?: Date;

    //GEAR_HEALTH COLUMNS
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    useKm?: boolean;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    useDays?: boolean;

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
