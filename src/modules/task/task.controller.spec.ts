import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Pager, PaginationDto } from '../../dto/pager.dto';
// import { PaginationDto } from 'src/dto/pager.dto';
// import { RequestMeta } from 'src/dto/request-meta.dto';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { TaskController } from './task.controller';
import { CreateTaskDto, TaskFilterDTO, TasksResponseDto, UpdateTaskDto } from './task.dto';
// import { TaskDto, CreateTaskDto, TaskFilterDTO, TasksResponseDto, UpdateTaskDto } from './task.dto';
import { TaskService } from './task.service';

const createTaskDto: CreateTaskDto = {
    title: 'test',
    description: 'first test',
    priority: 'high',
    status: 'incomplete',
    dueDate: '2023-06-06',
};

const updateTaskDto: UpdateTaskDto = {

    title: 'test',
    description: 'first test',
    priority: 'high',
    status: 'incomplete',
    dueDate: '2023-06-06',
}

const paginationDto: PaginationDto = {
    page: 1,
    limit: 3,
}

const pager: Pager = {
    totalItems: 10,
    currentPage: 1,
    limit: 2,
    startPage: 1,
    totalPages: 5,
    pages:[1,2,3,4,5],
    endPage: 5,
    startIndex: 1,
    endIndex: 5,
}

const taskFilterDTO: TaskFilterDTO = {

    dueDate: 'ASC',
    status: 'incomplete',
    priority: 'high',
}


const tasksResponseDto: TasksResponseDto = {
    tasks: [
        {
            title: 'test',
            description: 'first test',
            priority: 'high',
            status: 'incomplete',
            dueDate: '2023-06-06',
        },
        {
            title: 'test',
            description: 'first test',
            priority: 'high',
            status: 'incomplete',
            dueDate: '2023-06-06',
        },
        {
            title: 'test',
            description: 'first test',
            priority: 'high',
            status: 'incomplete',
            dueDate: '2023-06-06',
        }
    ],
    pager: pager
}


// const requestMetaServiceMock = {
//     userId: 12,
//     email: 'test@test.com'
// } as unknown as Request

let requestMock : Request


const taskIdMock = 300;

const taskDeleteMock = {
    "raw": [],
    "affected": 1
}


describe('TaskController', () => {
    const taskService: TaskService = createMock<TaskService>();
    const requestMetaServiceMock: RequestMetaService = createMock();
    let taskController: TaskController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [TaskController],
            providers: [
                {
                    provide: TaskService,
                    useValue: taskService,

                },
                {
                    provide: RequestMetaService,
                    useValue: requestMetaServiceMock,
                },
            ],
        }).compile();
        taskController = app.get<TaskController>(TaskController);
    });

    it('should be defined', () => {
        expect(taskController).toBeDefined();
    });

    it('should create task', async () => {
        jest.spyOn(taskController, 'createTask').mockImplementation(async (taskDto: CreateTaskDto): Promise<any> => {
            return Promise.resolve(taskDto);
        });
        const res = await taskController.createTask(createTaskDto, requestMock);
        expect(res).toBe(createTaskDto);
    });
    // return when task created
    // {
    //     "title": "test 67887777721",
    //     "description": "dsffdsfds",
    //     "dueDate": "2021-03-15",
    //     "status": true,
    //     "priority": "low",
    //     "__user__": 2,
    //     "createdAt": "2023-03-16T05:51:34.034Z",
    //     "updatedAt": "2023-03-16T05:51:34.034Z",
    //     "id": 5
    // }

    it('should delete task', async () => {
        jest.spyOn(taskController, 'deleteTask').mockImplementation(async (): Promise<any> => {
            return Promise.resolve(taskDeleteMock);
        });
        const res = await taskController.deleteTask(taskIdMock, requestMock);
        expect(res).toBe(taskDeleteMock);
        // toBe(1);
    });
    // return when task deleted
    // {
    //     "raw": [],
    //     "affected": 1
    // }

    it('should update task', async () => {
        jest.spyOn(taskController, 'updateTask').mockImplementation(async (): Promise<any> => {
            return Promise.resolve(updateTaskDto);
        });
        const res = await taskController.updateTask(taskIdMock, updateTaskDto, requestMock);
        expect(res).toBe(updateTaskDto);
        // toBe(updateTaskDto.title);
    });
    // return when task updated
    // {
    //     "createdAt": "2023-03-16T05:51:34.034Z",
    //     "updatedAt": "2023-03-16T08:42:54.675Z",
    //     "id": 5,
    //     "title": "test fsd5646846544984fsdfsdfsdf21.1",
    //     "description": "test",
    //     "dueDate": "2023-03-15",
    //     "status": false,
    //     "priority": "high"
    // }

    it('should return all task', async () => {
        jest.spyOn(taskController, 'getAllTasks').mockImplementation(async (): Promise<any> => {
            return Promise.resolve(tasksResponseDto);
        });
        const res = await taskController.getAllTasks(paginationDto, taskFilterDTO, requestMock);
        expect(res).toBe(tasksResponseDto);
        // toBe(updateTaskDto.title);
    });
    // return all task 

});
