import {Request} from 'express';
import {Teachers} from '../../modules/teachers/teachers.model';
import {Students} from '../../modules/students/students.model';

export type CustomUser<T> = T & {isMentor: boolean; groupId?: number};
export type AuthRequest = Request & {user: CustomUser<Teachers | Students>};
