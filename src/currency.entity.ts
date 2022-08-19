import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity("currency")
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
    default: 0,
  })
  rate: number;
}