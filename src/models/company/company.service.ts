import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigEnum } from 'common';
import { WithPaginationResponse } from 'common/types';
import { FindAllQueryDto, getPagPayload } from 'common/utils';
import { EmployeeService } from 'models/employee/employee.service';
import { ActiveUserData } from 'models/iam/decorators';
import { RolesEnum } from 'models/role/constants';
import { ServiceService } from 'models/service/service.service';

import { CreateCompanyDto } from './dto/create-company.dto';
import { FindAllCompaniesDto } from './dto/find-all-companies.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company, ConfigEnum.DB_CONNECTION_NAME)
        private readonly companyRepository: Repository<Company>,
        private readonly employeeService: EmployeeService,
        private readonly serviceService: ServiceService,
    ) {}

    create(dto: CreateCompanyDto): Promise<Company> {
        const company = this.companyRepository.create(dto);

        return this.companyRepository.save(company);
    }

    async findAll(
        dto: FindAllCompaniesDto,
    ): Promise<WithPaginationResponse<Company>> {
        const { name } = dto;
        const { offset, payload } = getPagPayload(dto);

        const [items, total] = await this.companyRepository.findAndCount({
            ...payload,
            order: {
                name: 'ASC',
            },
            where: {
                name,
            },
        });
        return { total, offset, items };
    }

    async findOne(user: ActiveUserData, uuid: string): Promise<Company> {
        const { roles } = user;

        let foundCompany;

        if (roles.includes(RolesEnum.ADMIN)) {
            foundCompany = await this.companyRepository.findOneBy({
                uuid,
            });
        } else {
            foundCompany = await this._checkIsCompanyEmployee(user, uuid);
        }

        if (!foundCompany) {
            throw new NotFoundException('Company not found');
        }

        return foundCompany;
    }

    async update(
        user: ActiveUserData,
        uuid: string,
        dto: UpdateCompanyDto,
    ): Promise<Company> {
        const { roles } = user;

        if (roles.includes(RolesEnum.ADMIN)) {
            await this.companyRepository.update(uuid, dto);
        } else {
            const foundCompany = await this._checkIsCompanyEmployee(user, uuid);
            if (foundCompany) await this.companyRepository.update(uuid, dto);
        }

        return this.companyRepository.findOneBy({ uuid });
        // const newEmployees = [];
        // const newServices = [];

        // if (company) {
        //     if (employee_ids && employee_ids.length > 0) {
        //         for (const employeeID of employee_ids) {
        //             const employee =
        //                 await this.employeeService.findOne(employeeID);
        //             if (employee) {
        //                 newEmployees.push(employee);
        //             }
        //         }

        //         company.employees = newEmployees;
        //     }

        //     if (service_uuids && service_uuids.length > 0) {
        //         for (const serviceUUID of service_uuids) {
        //             const service =
        //                 await this.serviceService.findOne(serviceUUID);
        //             if (service) {
        //                 newServices.push(service);
        //             }
        //         }

        //         company.services = newServices;
        //     }

        //     if (newEmployees.length > 0 || newServices.length > 0) {
        //         return this.companyRepository.save(company);
        //     }
        // }

        // return company;
    }

    remove(uuid: string) {
        return this.companyRepository.delete(uuid);
    }

    async findCompanyEmployees(
        user: ActiveUserData,
        uuid: string,
        dto: FindAllQueryDto,
    ) {
        const employees = await this.employeeService.findAll({
            ...dto,
            company_uuid: uuid,
        });

        const { roles } = user;

        if (roles.includes(RolesEnum.ADMIN)) {
            return employees;
        } else {
            const isCompanyEmployee = Boolean(
                await this._checkIsCompanyEmployee(user, uuid),
            );

            if (isCompanyEmployee) {
                return employees;
            }
        }
    }

    async findCompanyServices(
        user: ActiveUserData,
        uuid: string,
        dto: FindAllQueryDto,
    ) {
        const services = await this.serviceService.findAll({
            ...dto,
            company_uuid: uuid,
        });

        const { roles } = user;

        if (roles.includes(RolesEnum.ADMIN)) {
            return services;
        } else {
            const isCompanyEmployee = Boolean(
                await this._checkIsCompanyEmployee(user, uuid),
            );

            if (isCompanyEmployee) {
                return services;
            }
        }
    }

    async _checkIsCompanyEmployee(
        user: ActiveUserData,
        uuid: string,
    ): Promise<Company> {
        const employee = await this.employeeService.findOne(user.employee_id);

        const foundCompany = await this.companyRepository.findOne({
            where: { uuid: uuid },
        });

        if (!foundCompany) {
            throw new NotFoundException('Company not found');
        }

        const isCompanyEmployee = foundCompany.uuid === employee.company.uuid;

        if (!isCompanyEmployee) {
            throw new ForbiddenException();
        }

        return foundCompany;
    }
}
