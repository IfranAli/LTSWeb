export class Task {
  id: number = 0;
  title: string = 'new Task';
  state: TaskState = TaskState.TODO;
  isPinned: boolean = false;
  isArchived: boolean = false;

  constructor(title: string = 'Untitled Task') {
    this.title = title;
  }
}

export enum TaskState {
  TODO = 0,
  IN_PROGRESS = 1,
  BLOCKED = 2,
  DONE = 3,
}
