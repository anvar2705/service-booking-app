import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigEnum } from 'common';
import { WithPaginationResponse } from 'common/types';
import { getPagPayload } from 'common/utils';
import { HashingService } from 'models/iam/hashing/hashing.service';
import { RoleService } from 'models/role/role.service';

import { DEFAULT_ROLE } from './constants';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User, ConfigEnum.DB_CONNECTION_NAME)
        private readonly userRepository: Repository<User>,
        private readonly hashingService: HashingService,
        private readonly roleService: RoleService,
    ) {}

    async findAll(dto: FindAllUsersDto): Promise<WithPaginationResponse<User>> {
        const { username, email } = dto;
        const { offset, payload } = getPagPayload(dto);

        const [items, total] = await this.userRepository.findAndCount({
            ...payload,
            order: {
                id: 'ASC',
            },
            where: {
                username,
                email,
            },
        });

        return { total, offset, items };
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async _findByUsername(
        username: string,
        disableNotFoundException?: boolean,
    ): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { username },
            select: ['id', 'username', 'password'],
        });

        if (!disableNotFoundException && !user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async create(dto: CreateUserDto): Promise<User> {
        const { username, email, password, role_ids } = dto;
        await this._validateUser(username, email);

        try {
            let user = this.userRepository.create({
                ...dto,
                password: '',
                roles: [],
            });
            user.password = await this.hashingService.hash(password);

            user = await this.assignUserRoles(user, role_ids);

            const createdUser = await this.userRepository.save(user);
            return { ...createdUser, password: undefined };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, dto: UpdateUserDto): Promise<User> {
        const { role_ids, ...dtoWithoutRoles } = dto;

        await this._validateUser(dto.username, dto.email);

        const newHashedPassword = dto.password
            ? await this.hashingService.hash(dto.password)
            : undefined;

        await this.userRepository.update(id, {
            ...dtoWithoutRoles,
            password: newHashedPassword,
        });

        let user = await this.findById(id);

        if (role_ids) {
            user = await this.assignUserRoles(user, role_ids);
        }

        return this.userRepository.save(user);
    }

    async assignUserRoles(user: User, role_ids?: number[]): Promise<User> {
        user.roles = [];

        try {
            if (!role_ids) {
                const defaultUserRole = await this.roleService.findByName(
                    DEFAULT_ROLE,
                    true,
                );
                if (defaultUserRole) {
                    user.roles = [defaultUserRole];
                }
            } else if (role_ids?.length > 0) {
                for (const roleId of role_ids) {
                    const role = await this.roleService.findById(roleId, true);
                    if (role) {
                        user.roles.push(role);
                    }
                }
            }

            return user;
        } catch {
            throw new BadRequestException("Can't assign these roles to user");
        }
    }

    async delete(id: number) {
        return this.userRepository.delete(id);
    }

    private async _validateUser(username?: string, email?: string) {
        if (username) {
            const sameUsernameUser = await this.userRepository.findOneBy({
                username,
            });

            if (sameUsernameUser) {
                throw new HttpException(
                    'User with this username already exists',
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        if (email) {
            const sameEmailUser = await this.userRepository.findOneBy({
                email,
            });
            if (sameEmailUser) {
                throw new HttpException(
                    'User with this email already exists',
                    HttpStatus.BAD_REQUEST,
                );
            }
        }
    }
}
