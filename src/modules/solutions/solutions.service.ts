import { Solution } from '../solutions/solutions.model';
import { NotFound, BadRequest, Forbidden } from '../../common/exeptions/';
import { CustomUser } from '../../common/types/types';
import {tasksService} from '../tasks/tasks.service';
import {groupsService} from '../groups/groups.service';
import {studentsService} from '../students/students.service';
import {Transaction} from 'sequelize';
import {Tasks} from '../tasks/tasks.model';
import {sequelize} from '../../database';
import {ISolutionCreate} from '../../common/interfaces/solutions.interfaces';

class SolutionsService {

    public async createSolutions(task: Tasks, user: CustomUser, transaction:Transaction): Promise<Solution[]> {
        const {groupId} = task;
        const solutionsList =[];
        const taskId = task.id;

        const studentsInGroup = await studentsService.findAllByGroupId(groupId, transaction);

        studentsInGroup.map((el) => {
            solutionsList.push ({
                studentId: el.id,
                taskId: taskId,
                isCompleted: 0,
                grade: 0
            })
        });

        return Solution.bulkCreate(solutionsList, {transaction});
    }

    public async updateOneOrThrow(id: number, data: Partial<ISolutionCreate>, user: CustomUser):Promise<Solution> {
        const { isCompleted, grade } = data;

        // нахожу по id решение, проверяю можно ли его обновлять
        const solution = await this.checkIsCompletedOrThrow(id);

        //нахожу по id - таску
        const task = await tasksService.findOneById(solution.taskId, user);

        // нахожу по id группу
        const group = await groupsService.findOneOrThrow(task.groupId, user);

        // проверяю, совпадает ли поль-ль с ментором группы
        if (group.teacherId !== user.id) {
            throw new Forbidden('The only teacher can update solution');
        }

        return sequelize.transaction(async (transaction: Transaction) => {

            // мержим объект
            Object.keys(data).forEach((k) => solution[k] = data[k]);
            if (grade) {
                solution.grade = grade;
            }
            if (isCompleted) {
                solution.isCompleted = isCompleted;
            }
            return solution.save({transaction});
        })
    }

    private async checkIsCompletedOrThrow(id): Promise<Solution> {

        const solution = await this.findOneOrThrow(id);

        // проверяю, если решение подтвержено его нельзя изменять
        if (solution.isCompleted) {
            throw new BadRequest(`Solution with id = ${id} has been completed. You can not update it.`);
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

