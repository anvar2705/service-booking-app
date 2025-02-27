import { IsEmail, IsOptional } from 'class-validator';

import { FindAllQueryDto } from 'common/utils';

export class FindAllUsersDto extends FindAllQueryDto {
    @IsOptional()
    username: string;

    @IsOptional()
    @IsEmail()
    email: string;
}
