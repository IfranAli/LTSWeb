import {IdentitySingleton} from "./IdentitySingleton";
import {Task, TaskState} from "../models/task";
import {DaySegments, RepetitionType, WeekDay} from "../constants/constants";

const templateTask: Task = {
  content: "Undefined Task",
  id: 0,
  isArchived: false,
  isPinned: false,
  projectID: 0,
  state: TaskState.TODO,
  title: ""
};

export class TestDataFactory {
  constructor(private identity: IdentitySingleton) {
  }

  public getTestData(): Task[] {
    return [
      {
        ...templateTask,
        id: this.identity.getNextID(),
        title: 'Go to place',
        content: 'The place',
        scheduleSettings: {
          startDate: new Date(),
          endDate: new Date(),
          restrictedToDays: [
            WeekDay.MONDAY,
            WeekDay.TUESDAY,
            WeekDay.WEDNESDAY
          ],
          repetitionType: RepetitionType.MULTIPLE
        }
      },
      {
        ...templateTask,
        id: this.identity.getNextID(),
        title: 'Work on upskill',
        content: 'Study Typescript',
        scheduleSettings: {
          restrictedToDays: [WeekDay.SATURDAY, WeekDay.SUNDAY],
          restrictedToDaySegment: [DaySegments.AFTERNOON],
          repetitionType: RepetitionType.ONCE,
        },
      },
    ];
  }
}
