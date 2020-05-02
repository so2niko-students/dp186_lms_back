import { Groups } from '../groups/groups.model';
import { Solution } from '../solutions/solutions.model';
import { Request } from 'express';
import { NotFound, BadRequest, Unauthorized, Forbidden } from '../../common/exeptions/';
import { hashSync, genSaltSync } from 'bcrypt';
import { CustomUser, AuthRequest } from '../../common/types/types';
import { Tasks } from '../tasks/tasks.model';
import {Students} from '../students/students.model';
import {groupsService} from '../groups/groups.service';
import {studentsService} from '../students/students.service';
import { sequelize } from '../../database';
//import {Promise} from 'sequelize/types/lib/promise';
import {BulkCreateOptions} from 'sequelize/types/lib/model';
import {Transaction} from 'sequelize';

interface ISolutionCreate {
    studentId: number;
    taskId: number;
    grade?: number;
    isCompleted?: number;
}

class SolutionsService {

    public async createOne(solutionData: ISolutionCreate, user:CustomUser): Promise<Solution> {
        const { id } = user;
        const { taskId } = solutionData;
        solutionData.isCompleted = 0;
        solutionData.grade = 0;

        const solutions = await this.checkMultiSolutions(id, taskId);
        console.log('from solution service   solutions = ', solutions);

        if (solutions.length !== 0) {
            throw new BadRequest(`Solution of task number = ${taskId} for student number ${id} is already exists`);
        }

        return await Solution.create(solutionData);
    }

    public async updateOne(id: number, data: Solution, user: CustomUser) {
        const { isCompleted, grade } = data;

        // нахожу по id решение, проверяю можно ли его обновлять
        const solution = await this.checkIsCompleted(id);

        // проверяю явл-ся ли юзер Ментором
        const mentor = await this.mentorVerification(user);

        //нахожу по id - таску
        const task = await Tasks.findOne({
            where: { id: solution.taskId }
        })

        // нахожу по id группу
        const group = await groupsService.findOneOrThrow(task.groupId, user);

        // проверяю, совпадает ли поль-ль с ментором группы
        if (group.teacherId !== mentor.id) {
            throw new Forbidden('You do not have rights to do this');
        }

        // мержим объект
        Object.keys(data).forEach((k) => solution[k] = data[k]);
        if (grade) {
            solution.grade = grade;
        }
        if (isCompleted) {
            solution.isCompleted = isCompleted;
        }
        solution.save();

        return solution;
    }

    private async checkIsCompleted(id): Promise<Solution> {

        const solution = await this.findOneOrThrow(id);

        // проверяю, если решение подтвержено его нельзя изменять
        if (solution.isCompleted === 1) {
            throw new BadRequest(`Solution number = ${id} has been completed. You can not update it.`);
        }
        return solution;
    }

    private async mentorVerification(user: CustomUser) {
        const { isMentor } = user;
        if (!isMentor) {
            throw new Forbidden('You do not have rights to do this');
        }
        return user;
    }

    public async findOneOrThrow (id:number, transaction?: Transaction): Promise<Solution> {
        const solution = Solution.findOne({ where: { id } })
        if(!solution) {
            throw new NotFound('Solution number = ${id} does not exist in DB.');
        }
        return solution;
    }

    public async checkMultiSolutions (studentId, taskId) {
        return await Solution.findAll({ where: { studentId, taskId } })
    }

    //------создание сразу для всех тасок-------------------------
    public async createSolution({taskId=4, groupId=3}, user: CustomUser): Promise<Solution[]> {
        const solutiondata =[];
        const { id } = user;  // userId

        if (!user.isMentor) {
            throw new Unauthorized('You do not have permission for this');
        }
        // нахожу по id группу
        const group = await groupsService.findOneOrThrow(groupId, user);
        console.log('from createSolution   group = ', group);

        // проверяю, совпадает ли поль-ль с ментором группы
        if (group.teacherId !== id) {
            throw new Forbidden('You do not have rights to do this');
        }
        const studentsInGroup = await studentsService.findAllByGroupId(groupId);
        console.log('from createSolution   studentsInGroup = ', studentsInGroup);

        await Promise.all(studentsInGroup.map(async(el) => {
            const solutions = await this.checkMultiSolutions(el.id, taskId);
            console.log('from createSolution   solutions = ', solutions);

            if (solutions && solutions.length) {
                throw new BadRequest(`Solution of task number = ${taskId} for student 
                number ${el.id} is already exists`);
            }
            solutiondata.push ({
                "studentId": el.id,
                "taskId": taskId,
                "isCompleted": 0,
                "grade": 0
            })
        }))
        return await Solution.bulkCreate(solutiondata);
    }
}

export const solutionsService = new SolutionsService();


    //----- создание таски и решений------


    // public async createTask(task: TasksInterface, user: CustomUser): Promise<Task> {  //???? тип
    //     if (!user.isMentor) {
    //         throw new Unauthorized('You do not have permission for this');
    //     }
    //     const solutiondata =[];
    //     return sequelize.transaction(async (transaction) => {
    //         const task = await Task.create(task, transaction);
    //         const { groupId } = task;
    //         const { id : idTask } = task;  // taskId
    //         const { id } = user;  // userId
    //
    //         const solutions = await Solution.checkMultiSolutions(id, idTask);
    //         console.log('from solution service   solutions = ', solutions);
    //
    //         if (solutions.length !== 0) {
    //             throw new BadRequest(`Solution of task number = ${taskId} for student number ${id} is already exists`);
    //         }
    //
    //         const studentsInGroup = await Solution.findAllByGroupId(groupId);
    //         studentsInGroup.forEach((el) =>  {
    //             //taskId = Solution.findGroupId(el.groupId);
    //             solutiondata.push ({
    //                 "studentId": el.id,
    //                 "taskId": idTask,
    //                 "isCompleted": 0,
    //                 "grade": 0
    //             })
    //         })
    //         const solutionsArray = await Solution.bulkCreate(solutiondata, {transaction});
    //         return solutionsArray;
    //     })
    //}


    // public async createOne(
    //     task: TasksInterface,
    //     user: CustomUser
    // ): Promise<Task> {
    //     if (!user.isMentor) {
    //         throw new Unauthorized('You do not have permission for this');
    //     }
    //     return await Task.create(task);
    // }
//}


// public static bulkCreate<M extends Model>(
//     this: { new (): M } & typeof Model,
//     records: object[],
//     options?: BulkCreateOptions
// ): Promise<M[]>;
