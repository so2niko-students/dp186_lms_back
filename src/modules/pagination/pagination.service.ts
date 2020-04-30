interface IPaginationData{
  offset: number;
  actualPage: number;
}
class PaginationService {

  public async getOffset(supposedPage: number = 1, limit: number = 10, total: number): Promise<IPaginationData> {

    let offset: number = (supposedPage - 1) * limit // default offset by pages number
    let actualPage = supposedPage;

    if(total <= offset) { // when you click 'next' and it should return page №1
      offset = 0;
      actualPage = 1; 
    } else if(supposedPage === 0) {
      actualPage = Math.ceil(total / limit);
      offset = (actualPage - 1) * limit; // when you click 'prev' and it should return the last page
    }

    return { offset, actualPage };
  }
}

export const paginationService = new PaginationService();