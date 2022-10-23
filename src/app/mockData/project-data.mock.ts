import {Task, TaskState} from "../models/task";
import {Project} from "../models/project.model";
import {IdentitySingleton} from "../lib/IdentitySingleton";
import {TaskFactory} from "../lib/TaskFactory";
import {ProjectFactory} from "../lib/ProjectFactory";

export function ProjectDataMock(): Project[] {
  let identityProvider = IdentitySingleton.getInstance();

  let taskFactory = new TaskFactory(identityProvider);
  let projectFactory = new ProjectFactory(identityProvider);

  let personalProject = projectFactory.newProject();
  personalProject.title = 'Personal Projects';

  let teaTask = taskFactory.newTask();
  teaTask.title = 'Drink Tea';
  personalProject.addTask(teaTask);


  // personalProject.addTask(new Task(++taskID, 'Drink Tea'));
  // personalProject.addTask(new Task(++taskID, 'Write Code'));
  // personalProject.addTask(new Task(++taskID, 'Take Medication'));

  let workProject = projectFactory.newProject();
  workProject.title = 'Work';
  // workProject.addTask(new Task(++taskID, 'Discover Customisations'));
  // workProject.addTask(new Task(++taskID, 'BAU'));
  // workProject.addTask(new Task(++taskID, 'Code Review'));

  return [
    personalProject,
    workProject,
  ];
}
