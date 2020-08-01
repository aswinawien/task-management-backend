import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { UserEntity } from 'src/auth/user.entity';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {

    }

    async getTask(
        filterDTO: GetTasksFilterDTO,
        user: UserEntity
    ): Promise<TaskEntity[]> {
        return this.taskRepository.getTasks(filterDTO, user)
    }

    async getTaskById(
        id: number,
        user: UserEntity
    ): Promise<TaskEntity> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } })
        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found!`);
        }
        return found
    }

    async createTask(createTaskDTO: CreateTaskDTO, user: UserEntity): Promise<TaskEntity> {
        return this.taskRepository.createTask(createTaskDTO, user)
    }

    async deleteTask(id: number, user: UserEntity): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id })
        if (result.affected == 0) {
            throw new NotFoundException();
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: UserEntity): Promise<TaskEntity> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save()
        return task;
    }


    async updateTaskInfo(id: number, createTaskDTO: CreateTaskDTO, user: UserEntity): Promise<TaskEntity> {
        await this.taskRepository.update({ id, userId: user.id }, createTaskDTO);
        const task = await this.getTaskById(id, user);
        return task;
    }

}
