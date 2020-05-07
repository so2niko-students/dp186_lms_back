export interface ITeachersData {
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
  avatar?: {
      img: string;
      format: string;
  };
  password?: string;
};