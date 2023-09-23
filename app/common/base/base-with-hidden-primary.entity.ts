import { PrimaryGeneratedColumn } from 'typeorm';

export class BaseWithHiddenPrimaryEntity {
  @PrimaryGeneratedColumn()
  public id: number;
}
