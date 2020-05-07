import {Request} from 'express';
import {Teachers} from '../../modules/teachers/teachers.model';
import {Students} from '../../modules/students/students.model';
import {Groups} from '../../modules/groups/groups.model';

export type CustomUser = (Teachers  | Students) & {isMentor: boolean; groupId?: number; isAdmin?: boolean};
export type CustomGroup = Groups & {students?: Students[]};
export type AuthRequest = Request & {user: CustomUser};

export type UpdateRequest<T>= Request & {user: T};
