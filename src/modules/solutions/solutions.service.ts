import { Solution } from '../solutions/solutions.model';
import { NotFound, BadRequest, Unauthorized, Forbidden } from '../../common/exeptions/';
import { CustomUser } from '../../common/types/types';
import {tasksService} from '../tasks/tasks.service';
import {groupsService} from '../groups/groups.service';
import {studentsService} from '../students/students.service';
import {Transaction} from 'sequelize';
import {Tasks} from '../tasks/tasks.model';
import {sequelize} from '../../database';

export interface ISolutionCreate {
    studentId: number;
    taskId: number;
    grade?: number;
    isCompleted?: number;
}

class SolutionsService {

    public async createSolutions(task: Tasks, user: CustomUser, transaction:Transaction): Promise<Solution[]> {
        const {groupId} = task;
        const solutionsList =[];
        const { id } = user;
        const taskId = task.id;

        if (!user.isMentor) {
            throw new Unauthorized('You do not have permission for this');
        }
        // нахожу по id группу
        const group = await groupsService.findOneOrThrow(groupId, user, transaction);

        // проверяю, совпадает ли поль-ль с ментором группы
        if (group.teacherId !== id) {
            throw new Forbidden('You do not have rights to do this');
        }
        const studentsInGroup = await studentsService.findAllByGroupId(groupId, transaction);

        await Promise.all(studentsInGroup.map(async(el) => {
            solutionsList.push ({
                'studentId': el.id,
                'taskId': taskId,
                'isCompleted': 0,
                'grade': 0
            })
        }))
        return await Solution.bulkCreate(solutionsList, {transaction});
    }

    public async updateOneOrThrow(id: number, data: Partial<ISolutionCreate>, user: CustomUser):Promise<Solution> {
        const { isCompleted, grade } = data;

        return sequelize.transaction(async (transaction: Transaction) => {
            // нахожу по id решение, проверяю можно ли его обновлять
            const solution = await this.checkIsCompletedOrThrow(id);

            //нахожу по id - таску
            const task = await tasksService.findOneById(solution.taskId, user, transaction);

            // нахожу по id группу
            const group = await groupsService.findOneOrThrow(task.groupId, user, transaction);

            // проверяю, совпадает ли поль-ль с ментором группы
            if (group.teacherId !== user.id) {
                throw new Forbidden('The only teacher can update solution');
            }

            // мержим объект
            Object.keys(data).forEach((k) => solution[k] = data[k]);
            if (grade) {
                solution.grade = grade;
            }
            if (isCompleted) {
                solution.isCompleted = isCompleted;
            }
            await solution.save({transaction});
            return solution;
        })
    }

    public async countChecked(taskId) {
      return await Solution.count({ where: {taskId, isCompleted: 1} })
    }

    public async countReady(taskId) {
      return await Solution.count({ where: {taskId} })
    }

    private async checkIsCompletedOrThrow(id): Promise<Solution> {

        const solution = await this.findOneOrThrow(id);

        // проверяю, если решение подтвержено его нельзя изменять
        if (solution.isCompleted) {
            throw new BadRequest(`Solution number = ${id} has been completed. You can not update it.`);
        }
        return solution;
    }

    public async findOneOrThrow (id:number, transaction?: Transaction): Promise<Solution> {
        const solution = Solution.findOne({ where: { id }, transaction })
        if(!solution) {
            throw new NotFound('Solution number = ${id} does not exist in DB.');
        }
        return solution;
    }
}

export const solutionsService = new SolutionsService();

