import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigEnum } from 'common';
import { WithPaginationResponse } from 'common/types';
import { FindAllQueryDto, getPagPayload } from 'common/utils';
import { Company } from 'models/company/entities/company.entity';
import { ActiveUserData } from 'models/iam/decorators';
import { checkAdmin } from 'models/iam/utils.ts/checkAdmin';
import { RolesEnum } from 'models/role/constants';
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
            relations: ['user', 'company'],
        });

        if (!disableNotFoundException && !employee) {
            throw new NotFoundException('Employee not found');
        }

        return employee;
    }

    async findEmployeeServices(
        user: ActiveUserData,
        id: number,
        dto: FindAllQueryDto,
    ) {
        const employee = await this.findOne(id);

        const isAdmin = checkAdmin(user);
        const isCompanyOwner = await this._checkCompanyOwner(
            user,
            employee.company.uuid,
        );

        if (!isAdmin && !isCompanyOwner && user.employee_id !== id) {
            throw new ForbiddenException();
        }

        return this.serviceService.findAll({
            ...dto,
            employee_id: id,
        });
    }

    async update(
        user: ActiveUserData,
        id: number,
        dto: UpdateEmployeeDto,
    ): Promise<Employee> {
        const { username, email, password, role_ids, ...employeeDto } = dto;

        const employee = await this.findOne(id);

        const isAdmin = checkAdmin(user);
        const isCompanyOwner = await this._checkCompanyOwner(
            user,
            employee.company.uuid,
        );

        if (!isAdmin && !isCompanyOwner && user.employee_id !== id) {
            throw new ForbiddenException();
        }

        if (employeeDto) {
            await this.employeeRepository.update(id, employeeDto);
        }

        if (username || email || password || role_ids) {
            await this.userService.update(employee.user.id, {
                username,
                email,
                password,
                role_ids,
            });
        }

        return this.findOne(id);
    }

    async remove(user: ActiveUserData, id: number) {
        const employee = await this.findOne(id);

        const isAdmin = checkAdmin(user);
        const isCompanyOwner = await this._checkCompanyOwner(
            user,
            employee.company.uuid,
        );

        if (!isAdmin && !isCompanyOwner) {
            throw new ForbiddenException();
        }

        return this.employeeRepository.delete(id);
    }

    async addServicesToEmployee(
        user: ActiveUserData,
        id: number,
        service_uuids: string[],
    ) {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            relations: { services: true, company: true },
        });

        if (!employee) {
            throw new NotFoundException('Employee not found');
        }

        const isAdmin = checkAdmin(user);
        const isCompanyOwner = await this._checkCompanyOwner(
            user,
            employee.company.uuid,
        );

        if (!isAdmin && !isCompanyOwner) {
            throw new ForbiddenException();
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

    async _checkCompanyOwner(user: ActiveUserData, company_uuid: string) {
        const activeEmployee = await this.findOne(user.employee_id);

        return (
            user.roles.includes(RolesEnum.COMPANY_OWNER) &&
            activeEmployee.company.uuid === company_uuid
        );
    }
}
