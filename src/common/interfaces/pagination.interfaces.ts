export interface IPaginationData<T> {
  data: T[];
  actualPage: number;
  total: number;
  limit: number;
};