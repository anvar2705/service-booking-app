import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConfigEnum } from 'common';
import { WithPaginationResponse } from 'common/types';
import { getPagPayload } from 'common/utils';
import { ServiceService } from 'models/service/service.service';

import { CreateRecordDto } from './dto/create-record.dto';
import { FindAllRecordsDto } from './dto/find-all-records.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Record } from './entities/record.entity';

@Injectable()
export class RecordService {
    constructor(
        @InjectRepository(Record, ConfigEnum.DB_CONNECTION_NAME)
        private readonly recordRepository: Repository<Record>,
        private readonly serviceService: ServiceService,
    ) {}

    async create(dto: CreateRecordDto): Promise<Record> {
        const { serviceUUID, ...dtoWithoutServiceUUID } = dto;

        const service = await this.serviceService.findOne(serviceUUID);

        // TODO валидировать время начала и длительность

        const record = this.recordRepository.create({
            ...dtoWithoutServiceUUID,
            service,
        });

        return this.recordRepository.save(record);
    }

    async findAll(
        dto: FindAllRecordsDto,
    ): Promise<WithPaginationResponse<Record>> {
        const { offset, payload } = getPagPayload(dto);

        const [items, total] = await this.recordRepository.findAndCount({
            ...payload,
            loadRelationIds: {
                relations: ['service'],
            },
        });

        return { total, offset, items };
    }

    async findOne(uuid: string): Promise<Record> {
        const foundRecord = await this.recordRepository.findOne({
            where: { uuid },
            relations: {
                service: true,
            },
        });

        if (!foundRecord) {
            throw new NotFoundException('Record not found');
        }

        return foundRecord;
    }

    async update(uuid: string, dto: UpdateRecordDto): Promise<Record> {
        await this.recordRepository.update(uuid, dto);

        return this.findOne(uuid);
    }

    remove(uuid: string) {
        return this.recordRepository.delete(uuid);
    }
}
