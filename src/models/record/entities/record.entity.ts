import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Service } from 'models/service/entities/service.entity';

@Entity()
export class Record {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'varchar', nullable: true })
    client_name: string;

    @Column({ type: 'varchar', nullable: true })
    client_phone: string;

    @Column({ type: 'timestamp without time zone', nullable: false })
    time_start: string;

    @Column({ type: 'int', nullable: false })
    duration: number;

    @Column({ type: 'varchar', nullable: true })
    comment: string;

    @ManyToOne(() => Service, (service) => service.records)
    service: Service;
}
