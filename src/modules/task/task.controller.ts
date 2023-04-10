import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { logger } from '../../config/app-logger.config';
// import { logger } from 'src/config/app-logger.config';
import { PaginationDto } from '../../dto/pager.dto';
// import { PaginationDto } from 'src/dto/pager.dto';
import { RequestMeta } from '../../dto/request-meta.dto';
// import { RequestMeta } from 'src/dto/request-meta.dto';
import { RequestMetaService } from '../../interceptors/request-meta.service';
// import { RequestMetaService } from 'src/interceptors/request-meta.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto, TaskDto, TaskFilterDTO, TasksResponseDto, UpdateTaskDto } from './task.dto';
import { TaskService } from './task.service';

@Controller('tasks')
@ApiTags('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
    constructor(private taskService: TaskService, private readonly requestMetaService: RequestMetaService) { }
    @Post()
    @ApiSecurity('BearerAuthorization')
    @ApiResponse({
        status: HttpStatus.OK,
        type: TaskDto,
        description: 'Task created successfully',
    })
    async createTask(@Body() createTaskDto: CreateTaskDto, @Req() request: Request) {
        let requestMeta = await this.requestMetaService.getRequestMeta(request);
        let userId = requestMeta.userId;
        if (requestMeta.email) {
            // return this.taskRepository.save(task);
            return await this.taskService.createTask(createTaskDto, parseInt(userId));
          }
          throw new UnauthorizedException('User not Authorised');
    }

    @Delete("/:taskId")
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Task deleted successfully',
    })
    async deleteTask(@Param('taskId') taskId: number, @Req() request: Request) {
        const requestMeta: RequestMeta = await this.requestMetaService.getRequestMeta(request);
        return await this.taskService.deleteTask(taskId, requestMeta.email);
    }
    
    @Patch('/:taskId')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Task updated successfully',
    })
    async updateTask(@Param('taskId') taskId: number, @Body() body: UpdateTaskDto, @Req() request: Request) {
        const requestMeta: RequestMeta = await this.requestMetaService.getRequestMeta(request);
        return await this.taskService.updateTask(taskId, body, requestMeta.email);
    }

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        type: TasksResponseDto,
        description: 'Show all tasks of user with pagination',
    })
    async getAllTasks(
        @Query() paginationDto: PaginationDto,
        @Query() taskFilterDTO: TaskFilterDTO,
        @Req() request: Request,
    ): Promise<TasksResponseDto> {
        if (!paginationDto.limit) {
            paginationDto.limit = 10;
        }
        if (!paginationDto.page) {
            paginationDto.page = 1;
        }
        if (!taskFilterDTO.status) {
            taskFilterDTO.status = 'all';
        }
        if (!taskFilterDTO.priority) {
            taskFilterDTO.priority = 'high';
        }
        if (!taskFilterDTO.dueDate) {
            taskFilterDTO.dueDate = 'ASC';
        }
        const requestMeta: RequestMeta = await this.requestMetaService.getRequestMeta(request);
        logger.debug('requestMeta object ', requestMeta);
        const userId = requestMeta.userId;
        return this.taskService.getAllTasks(paginationDto, taskFilterDTO, userId);
    }

}
