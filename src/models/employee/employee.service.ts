import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigEnum } from 'common';
import { WithPaginationResponse } from 'common/types';
import { FindAllQueryDto, getPagPayload } from 'common/utils';
import { Company } from 'models/company/entities/company.entity';
import { ServiceService } from 'models/service/service.service';
import { UserService } from 'models/user/user.service';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { FindAllEmployeesDto } from './dto/find-all-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee, ConfigEnum.DB_CONNECTION_NAME)
        private readonly employeeRepository: Repository<Employee>,
        private readonly serviceService: ServiceService,
        private readonly userService: UserService,
        @InjectRepository(Company, ConfigEnum.DB_CONNECTION_NAME)
        private readonly companyRepository: Repository<Company>,
    ) {}

    async create(dto: CreateEmployeeDto): Promise<Employee> {
        const {
            username,
            email,
            password,
            company_uuid,
            role_ids,
            ...employeeDto
        } = dto;

        const company = await this.companyRepository.findOneBy({
            uuid: company_uuid,
        });

        if (!company) {
            throw new BadRequestException('Company not found');
        }

        const newUser = await this.userService.create({
            username,
            email,
            password,
            role_ids,
        });

        const newEmployee = this.employeeRepository.create({
            ...employeeDto,
            services: [],
            user: newUser,
            company,
        });

        return this.employeeRepository.save(newEmployee);
    }

    async findAll(
        dto: FindAllEmployeesDto,
    ): Promise<WithPaginationResponse<Employee>> {
        const { company_uuid } = dto;
        const { offset, payload } = getPagPayload(dto);

        const [items, count] = await this.employeeRepository.findAndCount({
            ...payload,
            order: {
                name: 'ASC',
            },
            where: { company: { uuid: company_uuid } },
            relations: {
                user: true,
            },
        });

        return { items, total: count, offset };
    }

    async findOne(
        id: number,
        disableNotFoundException?: boolean,
    ): Promise<Employee> {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            relations: {
                user: true,
                company: true,
            },
        });

        if (!disableNotFoundException && !employee) {
            throw new NotFoundException('Employee not found');
        }

        return employee;
    }

    async findOneByUserId(id: number, disableNotFoundException?: boolean) {
        const employee = await this.employeeRepository.findOne({
            where: { user: { id } },
            relations: ['user'],
        });

        if (!disableNotFoundException && !employee) {
            throw new NotFoundException('Employee not found');
        }

        return employee;
    }

    async findEmployeeServices(id: number, dto: FindAllQueryDto) {
        const employeeServices = await this.serviceService.findAll({
            ...dto,
            employee_id: id,
        });
        return employeeServices;
    }

    async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
        const { username, email, password, role_ids, ...employeeDto } = dto;

        const employee = await this.findOne(id);

        if (employeeDto) {
            await this.employeeRepository.update(id, employeeDto);
        }

        if (employee) {
            if (username || email || password || role_ids) {
                await this.userService.update(employee.user.id, {
                    username,
                    email,
                    password,
                    role_ids,
                });
            }
        }

        return this.findOne(id);
    }

    remove(id: number) {
        return this.employeeRepository.delete(id);
    }

    async addServicesToEmployee(id: number, service_uuids: string[]) {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            relations: { services: true },
        });
        if (!employee) {
            throw new NotFoundException('Employee not found');
        }

        if (!employee.services) employee.services = [];

        for (const serviceUUID of service_uuids) {
            const service = await this.serviceService.findOne(
                serviceUUID,
                true,
            );

            if (
                service &&
                !employee.services.find((s) => s.uuid === service.uuid)
            ) {
                employee.services.push(service);
            }
        }

        return this.employeeRepository.save(employee);
    }
}
