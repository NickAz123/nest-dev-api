import { Type } from "class-transformer";
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from "class-validator";

export class CreateGearDto {
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
    @Type(() => Date)
    @IsDate()
    purchaseDate?: Date;

    @IsOptional()
    @IsString()
    notes?: string;

    //GEAR_HEALTH COLUMNS
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
