import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class FindAllQueryDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    page: number = 1;

    @IsOptional()
    @IsInt()
    @IsPositive()
    page_size: number = 10;
}
