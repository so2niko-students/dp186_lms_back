import { IPaginationInnerData } from '../../common/interfaces/pagination.interfaces';
  
class PaginationService {

  public async getOffset(page: number = 1, limit: number = 10, total: number): Promise<IPaginationInnerData> {

    let offset: number = (page - 1) * limit // default offset by pages number
    let actualPage = page;
    
    if(total <= offset || page < 1) { // when you click 'next' and it should return page №1
      offset = 0;
      actualPage = 1; 
    }

    return { offset, actualPage };
  }
}

export const paginationService = new PaginationService();