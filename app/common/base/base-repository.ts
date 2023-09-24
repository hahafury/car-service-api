import { Injectable } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';

@Injectable()
export class BaseRepository<T> extends Repository<T> {
  constructor(
    private entityManager: EntityManager,
    private entity: EntityTarget<T>,
  ) {
    super(entity, entityManager);
  }
}
