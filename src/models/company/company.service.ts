import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigEnum } from 'common';
import { WithPaginationResponse } from 'common/types';
import { FindAllQueryDto, getPagPayload } from 'common/utils';
import { EmployeeService } from 'models/employee/employee.service';
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

    async findOne(
        uuid: string,
        disableNotFoundException?: boolean,
    ): Promise<Company> {
        const foundCompany = await this.companyRepository.findOneBy({ uuid });

        if (!disableNotFoundException && !foundCompany) {
            throw new NotFoundException('Company not found');
        }

        return foundCompany;
    }

    async update(uuid: string, dto: UpdateCompanyDto): Promise<Company> {
        await this.companyRepository.update(uuid, dto);

        return this.findOne(uuid);
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

    async findCompanyEmployees(uuid: string, dto: FindAllQueryDto) {
        return this.employeeService.findAll({
            ...dto,
            company_uuid: uuid,
        });
    }

    async findCompanyServices(uuid: string, dto: FindAllQueryDto) {
        return this.serviceService.findAll({
            ...dto,
            company_uuid: uuid,
        });
    }
}
