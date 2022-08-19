import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'pair_id',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  from: string;

  @Column({
    nullable: false,
    default: '',
  })
  to: string;

  @Column({
    nullable: false,
    default: '',
  })
  rate: number;
}