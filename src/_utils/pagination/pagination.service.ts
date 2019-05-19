import {Injectable} from '@nestjs/common';
import {ConfigService} from '../../config';
import {IGetPaginatedResponse} from '../controller.response.interface';
import {IPaginationParams} from './pagination.interfaces';

@Injectable()
export class PaginationService {
  private readonly domain: string;

  constructor(private readonly config: ConfigService) {
    this.domain = config.get(`DOMAIN`);
  }

  public async paginate<T>(params: IPaginationParams<T>): Promise<IGetPaginatedResponse<T>> {
    const {values, page, url, itemsPerPage} = params;
    if (values.length > itemsPerPage) {
      values.pop()
      return {
        valuesCount: values.length,
        nextPage: `${this.domain}${url}page=${page + 1}`,
        values
      };
    }
    return {
      valuesCount: values.length,
      values
    };
  }

}
