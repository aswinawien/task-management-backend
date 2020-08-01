import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
// import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDTO } from "./dto/create-task.dto";
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';



@ApiTags("Task")
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) { }


    @Get()
    getTasks(
        @Query(ValidationPipe) filterDTO: GetTasksFilterDTO,
        @GetUser() user: UserEntity
    ): Promise<TaskEntity[]> {
        return this.tasksService.getTask(filterDTO, user)
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity
    ): Promise<TaskEntity> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDTO: CreateTaskDTO,
        @GetUser() user: UserEntity
    ): Promise<TaskEntity> {
        return this.tasksService.createTask(createTaskDTO, user)
    }

    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity
    ): any {
        return this.tasksService.deleteTask(id, user)
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: UserEntity): Promise<TaskEntity> {
        return this.tasksService.updateTaskStatus(id, status, user)
    }

    @Put("/:id")
    @UsePipes(ValidationPipe)
    updateTaskInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() createTaskDTO: CreateTaskDTO,
        @GetUser() user: UserEntity
    ): Promise<TaskEntity> {
        return this.tasksService.updateTaskInfo(id, createTaskDTO, user)
    }
}
