import { Length } from 'class-validator';

export class CreateCompanyDto {
    @Length(3, 60)
    name: string;
}
