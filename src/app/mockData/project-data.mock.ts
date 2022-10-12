import {Task, TaskState} from "../models/task.model";
import {Project} from "../models/project.model";
import {TaskMockData} from "./task-data.mock";

export var ProjectDataMock: Project[] = [
  new Project("Personal Projects", [
    new Task('Drink Tea'),
    new Task('Write Code'),
    new Task('Take Medication'),
  ]),
  new Project("Work", [
    new Task('Discover Customisations'),
    new Task('BAU'),
    new Task('Code Review'),
  ]),
];
