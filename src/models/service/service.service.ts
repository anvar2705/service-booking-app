import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigEnum } from 'common';
import { WithPaginationResponse } from 'common/types';
import { getPagPayload } from 'common/utils';

import { CreateServiceDto } from './dto/create-service.dto';
import { FindAllServicesDto } from './dto/find-all-services.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(Service, ConfigEnum.DB_CONNECTION_NAME)
        private readonly serviceRepository: Repository<Service>,
    ) {}

    async create(dto: CreateServiceDto): Promise<Service> {
        const { name } = dto;

        const sameNameService = await this.serviceRepository.findOneBy({
            name,
        });

        if (sameNameService) {
            throw new BadRequestException('Service with the same name exists');
        }

        const service = this.serviceRepository.create(dto);

        return this.serviceRepository.save(service);
    }

    async findAll(
        dto: FindAllServicesDto,
    ): Promise<WithPaginationResponse<Service>> {
        const { offset, payload } = getPagPayload(dto);

        const [items, total] = await this.serviceRepository.findAndCount({
            order: {
                name: 'ASC',
            },
            ...payload,
        });
        return { total, offset, items };
    }

    async findOne(uuid: string): Promise<Service> {
        const foundService = await this.serviceRepository.findOneBy({ uuid });

        if (!foundService) {
            throw new NotFoundException('Service not found');
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
