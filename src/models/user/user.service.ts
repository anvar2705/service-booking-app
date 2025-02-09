import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigEnum } from 'common';
import { Repository } from 'typeorm';
import { WithPagination } from 'common/types';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from 'models/iam/hashing/hashing.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User, ConfigEnum.DB_CONNECTION_NAME)
        private userRepository: Repository<User>,
        private readonly hashingService: HashingService,
    ) {}

    async findAll(query: FindAllQueryDto): Promise<WithPagination<User>> {
        const { email, page, page_size } = query;
        const offset = (page - 1) * page_size;
        const [items, total] = await this.userRepository.findAndCount({
            order: {
                id: 'ASC',
            },
            take: page_size,
            skip: offset,
            where: { email },
        });

        return { total, offset, items };
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });

        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }

    async _findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'role'],
        });

        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }

    async create(dto: CreateUserDto) {
        const { email, password, role } = dto;

        await this._validateUser(dto.email);

        try {
            const user = new User();
            user.email = email;
            user.password = await this.hashingService.hash(password);
            user.role = role;

            await this.userRepository.save(user);
        } catch (error) {
            throw error;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async update(id: number, dto: UpdateUserDto) {
        const { password } = dto;
        const newHashedPassword = password
            ? await this.hashingService.hash(password)
            : undefined;
        const user = await this.userRepository.update(id, {
            ...dto,
            password: newHashedPassword,
        });
        return user;
    }

    async delete(id: number) {
        return this.userRepository.delete(id);
    }

    async _validateUser(email: string, id?: number) {
        let currentEmail;
        if (id !== undefined) {
            const currenUser = await this.findById(id);
            currentEmail = currenUser.email;
        }

        if (email !== currentEmail) {
            const sameEmailUser = await this.userRepository.findOneBy({
                email,
            });
            if (sameEmailUser) {
                throw new HttpException(
                    'Пользователь c таким email существует',
                    HttpStatus.BAD_REQUEST,
                );
            }
        }
    }
}
