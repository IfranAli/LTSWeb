import {Task, TaskState} from "../models/task.model";

export var TaskMockData: Task[] = [
  {
    id: 0,
    state: TaskState.TODO,
    title: "Task 1",
    isPinned: false,
    isArchived: false
  },
  {
    id: 1,
    state: TaskState.BLOCKED,
    title: "Task 2",
    isPinned: false,
    isArchived: false
  },
  {
    id: 2,
    state: TaskState.IN_PROGRESS,
    title: "Task 3",
    isPinned: true,
    isArchived: false
  },
  {
    id: 3,
    state: TaskState.DONE,
    title: "Task 4",
    isPinned: false,
    isArchived: false
  },
];
