export interface IPaginationData<T> {
  teachers: T[];
  actualPage: number;
  total: number;
  limit: number;
};