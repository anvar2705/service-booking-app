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
import { Company } from 'models/company/entities/company.entity';

import { CreateServiceDto } from './dto/create-service.dto';
import { FindAllServicesDto } from './dto/find-all-services.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(Service, ConfigEnum.DB_CONNECTION_NAME)
        private readonly serviceRepository: Repository<Service>,
        @InjectRepository(Company, ConfigEnum.DB_CONNECTION_NAME)
        private readonly companyRepository: Repository<Company>,
    ) {}

    async create(dto: CreateServiceDto): Promise<Service> {
        const { name, company_uuid } = dto;

        const sameNameService = await this.serviceRepository.findOneBy({
            name,
        });

        if (sameNameService) {
            throw new BadRequestException('Service with the same name exists');
        }

        const company = await this.companyRepository.findOneBy({
            uuid: company_uuid,
        });

        if (!company) {
            throw new BadRequestException('Company not found');
        }

        const service = this.serviceRepository.create({ ...dto, company });

        return this.serviceRepository.save(service);
    }

    async findAll(
        dto: FindAllServicesDto,
    ): Promise<WithPaginationResponse<Service>> {
        const { employee_id, company_uuid } = dto;
        const { offset, payload } = getPagPayload(dto);

        const [items, total] = await this.serviceRepository.findAndCount({
            ...payload,
            order: {
                name: 'ASC',
            },
            where: {
                employees: {
                    id: employee_id,
                },
                company: {
                    uuid: company_uuid,
                },
            },
        });
        return { total, offset, items };
    }

    async findOne(
        uuid: string,
        disableNotFoundException?: boolean,
    ): Promise<Service> {
        const foundService = await this.serviceRepository.findOneBy({ uuid });

        if (!disableNotFoundException && !foundService) {
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
