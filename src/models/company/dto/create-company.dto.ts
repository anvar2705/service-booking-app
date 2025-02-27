import { Length } from 'class-validator';

export class CreateCompanyDto {
    @Length(2, 30)
    name: string;
}
