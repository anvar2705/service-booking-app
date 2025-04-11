import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigEnum } from 'common';
import { WithPaginationResponse } from 'common/types';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role, ConfigEnum.DB_CONNECTION_NAME)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async findAll(): Promise<WithPaginationResponse<Role>> {
        const [items, total] = await this.roleRepository.findAndCount({
            order: {
                id: 'ASC',
            },
        });

        return { total, offset: 0, items };
    }

    async findById(
        id: number,
        disableNotFoundException?: boolean,
    ): Promise<Role> {
        const role = await this.roleRepository.findOneBy({ id });

        if (!disableNotFoundException && !role) {
            throw new NotFoundException('Role not found');
        }

        return role;
    }

    async findByName(
        name: string,
        disableNotFoundException?: boolean,
    ): Promise<Role> {
        const role = await this.roleRepository.findOneBy({ name });

        if (!disableNotFoundException && !role) {
            throw new NotFoundException('Role not found');
        }

        return role;
    }

    async create(dto: CreateRoleDto): Promise<Role> {
        const { name } = dto;

        await this._validateRole(name);

        try {
            const role = new Role();
            role.name = name;

            return await this.roleRepository.save(role);
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, dto: UpdateRoleDto): Promise<Role> {
        await this.roleRepository.update(id, {
            ...dto,
        });
        return await this.findById(id);
    }

    async delete(id: number) {
        return this.roleRepository.delete(id);
    }

    async _validateRole(name: string) {
        const sameNameRole = await this.roleRepository.findOneBy({ name });

        if (sameNameRole) {
            throw new HttpException(
                'This role already exists',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
