export interface IPaginationOuterData<T> {
  data: T[];
  actualPage: number;
  total: number;
  limit: number;
};

export interface IPaginationInnerData {
  offset: number;
  actualPage: number;
};