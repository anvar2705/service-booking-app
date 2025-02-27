import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigEnum } from 'common';
import { WithPaginationResponse } from 'common/types';
import { getPagPayload } from 'common/utils';
import { Service } from 'models/service/entities/service.entity';
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
    ) {}

    async create(dto: CreateEmployeeDto): Promise<Employee> {
        const { username, email, password, ...employeeDto } = dto;

        const newUser = await this.userService.create({
            username,
            email,
            password,
        });

        const newEmployee = this.employeeRepository.create({
            ...employeeDto,
            services: [],
            user: newUser,
        });

        return this.employeeRepository.save(newEmployee);
    }

    async findAll(
        dto: FindAllEmployeesDto,
    ): Promise<WithPaginationResponse<Employee>> {
        const { offset, payload } = getPagPayload(dto);

        const [items, count] = await this.employeeRepository.findAndCount({
            order: {
                name: 'ASC',
            },
            ...payload,
        });

        return { items, total: count, offset };
    }

    async findOne(
        id: number,
        disableNotFoundException?: boolean,
    ): Promise<Employee> {
        const employee = await this.employeeRepository.findOneBy({ id });

        if (!disableNotFoundException && !employee) {
            throw new NotFoundException('Employee not found');
        }

        return employee;
    }

    async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
        const {
            serviceUUIDs,
            username,
            email,
            password,
            roleIds,
            ...employeeDtoWithoutServices
        } = dto;

        if (employeeDtoWithoutServices) {
            await this.employeeRepository.update(
                id,
                employeeDtoWithoutServices,
            );
        }

        const employee = await this.findOne(id);

        if (employee) {
            if (username || email || password || roleIds) {
                await this.userService.update(employee.user.id, {
                    username,
                    email,
                    password,
                    roleIds,
                });
            }
        }

        const newServices: Service[] = [];

        if (employee && serviceUUIDs?.length > 0) {
            for (const serviceUUID of serviceUUIDs) {
                const service = await this.serviceService.findOne(
                    serviceUUID,
                    true,
                );

                if (service) newServices.push(service);
            }

            employee.services = newServices;

            return this.employeeRepository.save(employee);
        }

        return this.findOne(id);
    }

    remove(id: number) {
        return this.employeeRepository.delete(id);
    }
}
