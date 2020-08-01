import { Repository, EntityRepository } from "typeorm";
import { TaskEntity } from "./task.entity";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDTO } from "./dto/get-tasks-filter.dto";
import { UserEntity } from "src/auth/user.entity";

// responsible for every query, create, delete, update and so on from the service to db.
@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity>{
    async createTask(createTaskDTO: CreateTaskDTO, user: UserEntity): Promise<TaskEntity> {
        const { title, description } = createTaskDTO;
        const task = new TaskEntity();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await this.save(task);
        delete task.user;
        return task;
    }

    async getTasks(filterDTO: GetTasksFilterDTO, user: UserEntity): Promise<TaskEntity[]> {
        const { search, status } = filterDTO;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status })
        }
        // where will override one onether query builder but and where will make them works together
        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` }); // allows partial character matched
        }
        const tasks = await query.getMany();
        return tasks;
    }
}