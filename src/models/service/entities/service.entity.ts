import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

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

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;
}
