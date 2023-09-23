import { PaginationResult } from './interfaces/pagination-result.interface';

export class Pagination<PaginationEntity> {
  public results: PaginationEntity[];
  public pageTotal: number;
  public total: number;

  constructor(paginationResults: PaginationResult<PaginationEntity>) {
    this.results = paginationResults.results;
    this.pageTotal = paginationResults.results.length;
    this.total = paginationResults.total;
  }
}
