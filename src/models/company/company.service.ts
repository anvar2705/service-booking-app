import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigEnum } from 'common';
import { WithPaginationResponse } from 'common/types';
import { getPagPayload } from 'common/utils';
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
        const { offset, payload } = getPagPayload(dto);

        const [items, total] = await this.companyRepository.findAndCount({
            order: {
                name: 'ASC',
            },
            ...payload,
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
        const { employeeIDs, serviceUUIDs, ...restDto } = dto;

        if (Object.keys(restDto).length > 0) {
            await this.companyRepository.update(uuid, restDto);
        }

        const company = await this.findOne(uuid);
        const newEmployees = [];
        const newServices = [];

        if (company) {
            if (employeeIDs && employeeIDs.length > 0) {
                for (const employeeID of employeeIDs) {
                    const employee =
                        await this.employeeService.findOne(employeeID);
                    if (employee) {
                        newEmployees.push(employee);
                    }
                }

                company.employees = newEmployees;
            }

            if (serviceUUIDs && serviceUUIDs.length > 0) {
                for (const serviceUUID of serviceUUIDs) {
                    const service =
                        await this.serviceService.findOne(serviceUUID);
                    if (service) {
                        newServices.push(service);
                    }
                }

                company.services = newServices;
            }

            if (newEmployees.length > 0 || newServices.length > 0) {
                return this.companyRepository.save(company);
            }
        }

        return company;
    }

    remove(uuid: string) {
        return this.companyRepository.delete(uuid);
    }
}
