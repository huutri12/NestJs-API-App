import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) 
    @IsPositive()
    @Min(1)
    page?: number;
  
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) 
    @IsPositive()
    @Min(1)
    limit?: number;
  
    @IsOptional()
    @IsString()
    search?: string;
}
