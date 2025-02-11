import { Length } from 'class-validator';

export class CreateRoleDto {
    @Length(3, 60)
    name: string;
}
