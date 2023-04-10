import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Pager, PaginationDto } from '../../dto/pager.dto';
import { RequestMetaService } from '../../interceptors/request-meta.service';
import { CreateTaskDto, TaskFilterDTO, TasksResponseDto, UpdateTaskDto } from './task.dto';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

const createTaskDto: CreateTaskDto = {
  title: 'test',
  description: 'first test',
  priority: 'high',
  status: 'incomplete',
  dueDate: '2023-06-06',
};

const paginationDto: PaginationDto = {
  page: 1,
  limit: 3,
}

const taskFilterDTO: TaskFilterDTO = {
  dueDate: 'ASC',
  status: 'incomplete',
  priority: 'high',
}

const updateTaskDto: UpdateTaskDto = {

  title: 'test',
  description: 'first test',
  priority: 'high',
  status: 'incomplete',
  dueDate: '2023-06-06',
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

// const requestUserDetailMock = {
//   userId: 12,
//   email: 'test@test.com'
// } as unknown as Request

// let requestMock : Request

const taskIdMock = 300;

const userIdMock = '300';

const taskDeleteMock = {
  "raw": [],
  "affected": 1
}

const emailMock = 'test@test.com';

describe('TaskService', () => {
  const taskRepository: TaskRepository = createMock<TaskRepository>();
  const requestMetaService: RequestMetaService = createMock();
  let taskService: TaskService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepository,
          useValue: taskRepository,
        },
        {
            provide: RequestMetaService,
            useValue: requestMetaService,
        },
      ],
    }).compile();

    taskService = app.get<TaskService>(TaskService);
  });
  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  it('should create task and return the added Task details', async () => {
    jest.spyOn(taskService, 'createTask').mockImplementation(async (createTaskDto: CreateTaskDto): Promise<any> => {
      return Promise.resolve(createTaskDto);
    });
    const result = await taskService.createTask(createTaskDto,userIdMock);
    expect(result).toBe(createTaskDto);
  });

  it('should return id if present in db', async () => {
    jest.spyOn(taskService, 'findOne').mockImplementation(async (taskIdMock): Promise<any> => {
      return Promise.resolve(taskIdMock);
    });
    const result = await taskService.findOne(taskIdMock);
    expect(result).toBe(taskIdMock);
  });

  it('should return email if User associated with given ID present in db', async () => {
    jest.spyOn(taskService, 'findEmailById').mockImplementation(async (): Promise<any> => {
      return Promise.resolve(emailMock);
    });
    const result = await taskService.findEmailById(taskIdMock);
    expect(result).toBe(emailMock);
  });
  
  it('should return all task', async () => {
    jest.spyOn(taskService, 'getAllTasks').mockImplementation(async (): Promise<any> => {
      return Promise.resolve(tasksResponseDto);
    });
    const result = await taskService.getAllTasks(paginationDto, taskFilterDTO, userIdMock);
    expect(result).toBe(tasksResponseDto);
  });
  
  it('should update task', async () => {
    jest.spyOn(taskService, 'updateTask').mockImplementation(async (): Promise<any> => {
      return Promise.resolve(updateTaskDto);
    });
    const result = await taskService.updateTask(taskIdMock, createTaskDto, emailMock);
    expect(result).toBe(updateTaskDto);
  });
  
  it('should delete task', async () => {
    jest.spyOn(taskService, 'deleteTask').mockImplementation(async (): Promise<any> => {
      return Promise.resolve(taskDeleteMock);
    });
    const result = await taskService.deleteTask(taskIdMock, emailMock);
    expect(result).toBe(taskDeleteMock);
  });


});
