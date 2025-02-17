import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Record } from 'models/record/entities/record.entity';

import { ServiceTypeEnum } from '../constants';

@Entity()
export class Service {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'varchar', nullable: false, unique: true })
    name: string;

    @Column({ type: 'int', nullable: false })
    priceFrom: number;

    @Column({ type: 'int', nullable: true })
    priceTo: number;

    @Column({ type: 'int', nullable: false })
    duration: number;

    @Column({
        type: 'enum',
        enum: ServiceTypeEnum,
        default: ServiceTypeEnum.PERSONAL,
    })
    type: string;

    @OneToMany(() => Record, (record) => record.service)
    records: Record[];

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;
}
