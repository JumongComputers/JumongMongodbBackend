import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  IsArray,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // ✅ ADD THIS
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true }) // ensures each item is a valid URL
  images?: string[];
}
