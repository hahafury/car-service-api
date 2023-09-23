import { Generated, PrimaryColumn } from 'typeorm';

export class BaseManyToOneEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  public id: string;
}
