import { IsEmail, IsOptional, Length } from 'class-validator';

import { FindAllQueryDto } from 'common/utils';

export class FindAllUsersDto extends FindAllQueryDto {
    @IsOptional()
    @Length(3, 30)
    username: string;

    @IsOptional()
    @IsEmail()
    email: string;
}
