import {Request} from 'express';
import {Teachers} from '../../modules/teachers/teachers.model';
import {Students} from '../../modules/students/students.model';

export type CustomUser = (Teachers  | Students) & {isMentor: boolean; groupId?: number};
export type AuthRequest = Request & {user: CustomUser};


export type PasswordStudentRequest = Request & {user: Students};
export type PasswordTeacherRequest = Request & {user: Teachers};
