import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigEnum } from 'common';
import { WithPagination } from 'common/types';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role, ConfigEnum.DB_CONNECTION_NAME)
        private roleRepository: Repository<Role>,
    ) {}

    async findAll(): Promise<WithPagination<Role>> {
        const [items, total] = await this.roleRepository.findAndCount({
            order: {
                id: 'ASC',
            },
        });

        return { total, offset: 0, items };
    }

    async findById(id: number): Promise<Role> {
        const role = await this.roleRepository.findOneBy({ id });

        if (!role) {
            throw new NotFoundException();
        }

        return role;
    }

    async findByName(name: string): Promise<Role> {
        const role = await this.roleRepository.findOneBy({ name });

        if (!role) {
            throw new NotFoundException();
        }

        return role;
    }

    async create(dto: CreateRoleDto) {
        const { name } = dto;

        await this._validateRole(name);

        try {
            const role = new Role();
            role.name = name;

            await this.roleRepository.save(role);
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, dto: UpdateRoleDto) {
        const role = await this.roleRepository.update(id, {
            ...dto,
        });
        return role;
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
