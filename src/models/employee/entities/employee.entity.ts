import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Service } from 'models/service/entities/service.entity';

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    surname: string;

    @Column({ type: 'varchar', nullable: true })
    patronymic: string;

    @Column({ type: 'varchar', nullable: true })
    photoUrl: string;

    @ManyToMany(() => Service, (service) => service.employees)
    services: Service[];
}
