import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsDate,
    IsNumber,
    Min,
    IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateGearDto {
    @IsOptional()
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    @IsString()
    brand?: string;

    @IsOptional()
    @IsString()
    model?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    purchaseDate?: Date;

    @IsOptional()
    @IsString()
    notes?: string;

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
