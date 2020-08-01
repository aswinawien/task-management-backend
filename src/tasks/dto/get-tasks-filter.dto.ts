import { ApiPropertyOptional } from "@nestjs/swagger";
import { TaskStatus } from '../task-status.enum'
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetTasksFilterDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    search: string;
}