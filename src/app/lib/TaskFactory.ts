import {IdentitySingleton} from "./IdentitySingleton";
import {Task, TaskState} from "../models/task";
import {RepetitionType} from "../constants/constants";

export class TaskFactory {
  constructor(
    private identity: IdentitySingleton
  ) {
  }

  public newTask(): Task {
    return {
      id: this.identity.getNextID(),
      projectID: 0,
      state: TaskState.TODO,
      title: 'Undefined',
      content: 'untitled content',

      isArchived: false,
      isPinned: false,

      scheduleSettings: {
        endDate: new Date(),
        startDate: new Date(),
        restrictedToDays: [],
        restrictedToDaySegment: [],
        repetitionType: RepetitionType.ONCE,
      }
    };
  }
}
