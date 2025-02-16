import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigEnum } from 'common';
import { WithPagination } from 'common/types';

import { CreateServiceDto } from './dto/create-service.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(Service, ConfigEnum.DB_CONNECTION_NAME)
        private serviceRepository: Repository<Service>,
    ) {}

    async create(createServiceDto: CreateServiceDto): Promise<Service> {
        const { name, priceFrom, priceTo, duration, type } = createServiceDto;

        const sameNameService = await this.serviceRepository.findOneBy({
            name,
        });

        if (sameNameService) {
            throw new BadRequestException('Service with the same name exists');
        }

        const service = new Service();
        service.name = name;
        service.priceFrom = priceFrom;
        service.priceTo = priceTo;
        service.duration = duration;
        service.type = type;

        return this.serviceRepository.save(service);
    }

    async findAll(dto: FindAllQueryDto): Promise<WithPagination<Service>> {
        const { page, page_size } = dto;
        const offset = (page - 1) * page_size;
        const [items, total] = await this.serviceRepository.findAndCount({
            order: {
                name: 'ASC',
            },
            take: page_size,
            skip: offset,
        });
        return { total, offset, items };
    }

    async findOne(uuid: string): Promise<Service> {
        const foundService = await this.serviceRepository.findOneBy({ uuid });

        if (!foundService) {
            throw new NotFoundException();
        }

        return foundService;
    }

    async update(uuid: string, dto: UpdateServiceDto) {
        await this.serviceRepository.update(uuid, dto);

        return this.findOne(uuid);
    }

    remove(uuid: string) {
        return this.serviceRepository.delete(uuid);
    }
}
