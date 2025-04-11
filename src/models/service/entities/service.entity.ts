import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Company } from 'models/company/entities/company.entity';
import { Employee } from 'models/employee/entities/employee.entity';
import { Record } from 'models/record/entities/record.entity';

import { ServiceTypeEnum } from '../constants';

@Entity()
export class Service {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'varchar', nullable: false, unique: true })
    name: string;

    @Column({ type: 'int', nullable: false })
    price_from: number;

    @Column({ type: 'int', nullable: true })
    price_to: number;

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

    @ManyToMany(() => Employee, (employee) => employee.services)
    @JoinTable({ name: 'service_employee' })
    employees: Employee[];

    @ManyToOne(() => Company, (company) => company.services)
    company: Company;

    @CreateDateColumn()
    public created_at: Date;

    @UpdateDateColumn()
    public updated_at: Date;
}
