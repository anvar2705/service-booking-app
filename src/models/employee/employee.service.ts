import {
    BadRequestException,
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';

import { ConfigEnum } from 'common';
import { WithPaginationResponse } from 'common/types';
import { FindAllQueryDto, getPagPayload } from 'common/utils';
import { Company } from 'models/company/entities/company.entity';
import { ActiveUserData } from 'models/iam/decorators';
import { checkIsAdmin } from 'models/iam/utils/checkIsAdmin';
import { RolesEnum } from 'models/role/constants';
import { ServiceService } from 'models/service/service.service';
import { UserService } from 'models/user/user.service';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import {
    FindAllEmployeesDto,
    FindAllEmployeesSortingEnum,
} from './dto/find-all-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee, ConfigEnum.DB_CONNECTION_NAME)
        private readonly employeeRepository: Repository<Employee>,
        private readonly userService: UserService,
        @InjectRepository(Company, ConfigEnum.DB_CONNECTION_NAME)
        private readonly companyRepository: Repository<Company>,
        @Inject(forwardRef(() => ServiceService))
        private readonly serviceService: ServiceService,
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
        const { company_uuid, sorting } = dto;
        const { offset, payload } = getPagPayload(dto);

        let order: FindOptionsOrder<Employee>;

        if (sorting) {
            const { id, desc } = sorting;
            if (id === FindAllEmployeesSortingEnum.NAME) {
                order = {
                    [id]: desc ? 'DESC' : 'ASC',
                };
            } else {
                order = {
                    user: {
                        [id]: desc ? 'DESC' : 'ASC',
                    },
                };
            }
        }

        const [items, count] = await this.employeeRepository.findAndCount({
            ...payload,
            order,
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

        const isAdmin = checkIsAdmin(user);
        const isCompanyEmployee = await this.checkIsCompanyEmployee(
            user,
            employee.company.uuid,
            id,
        );

        if (!isAdmin && !isCompanyEmployee) {
            throw new ForbiddenException();
        }

        return this.serviceService.findAll(user, {
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

        const isAdmin = checkIsAdmin(user);
        const isCompanyEmployee = await this.checkIsCompanyEmployee(
            user,
            employee.company.uuid,
            id,
        );

        if (!isAdmin && !isCompanyEmployee) {
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

        const isAdmin = checkIsAdmin(user);
        const isCompanyOwner = await this.checkIsCompanyOwner(
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

        const isAdmin = checkIsAdmin(user);
        const isCompanyEmployee = await this.checkIsCompanyEmployee(
            user,
            employee.company.uuid,
            id,
        );

        if (!isAdmin && !isCompanyEmployee) {
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

    async checkIsCompanyOwner(user: ActiveUserData, company_uuid: string) {
        const activeEmployee = await this.findOne(user.employee_id);

        return (
            user.roles.includes(RolesEnum.COMPANY_OWNER) &&
            activeEmployee.company.uuid === company_uuid
        );
    }

    async checkIsCompanyEmployee(
        user: ActiveUserData,
        company_uuid: string,
        id: number,
    ) {
        const activeEmployee = await this.findOne(user.employee_id);

        if (
            user.roles.includes(RolesEnum.COMPANY_OWNER) &&
            activeEmployee.company.uuid === company_uuid
        ) {
            return true;
        }

        return (
            user.roles.includes(RolesEnum.EMPLOYEE) &&
            user.employee_id === id &&
            activeEmployee.company.uuid === company_uuid
        );
    }
}
