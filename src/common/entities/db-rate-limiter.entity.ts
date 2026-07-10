import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DBRateLimiterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column()
  count: number;

  @Column()
  startTime: number;
}
