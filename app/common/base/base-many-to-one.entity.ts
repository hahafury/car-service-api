import { PrimaryGeneratedColumn } from 'typeorm';

export class BaseManyToOneEntity {
  @PrimaryGeneratedColumn()
  public id: number;
}
