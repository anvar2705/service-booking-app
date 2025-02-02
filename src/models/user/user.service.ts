import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigEnum } from 'common';
import { Repository } from 'typeorm';
import { WithPagination } from 'common/types';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User, ConfigEnum.DB_CONNECTION_NAME)
        private userRepository: Repository<User>,
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

    findById(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    _findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password'],
        });
    }

    async _create(dto: CreateUserDto) {
        const { email, password } = dto;

        await this._validateUser(dto.email);

        try {
            const user = new User();
            user.email = email;
            user.password = password;

            await this.userRepository.save(user);
        } catch (error) {
            throw error;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(id: number, dto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
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
