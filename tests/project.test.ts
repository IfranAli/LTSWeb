import {Project} from "../src/app/models/project.model";
import {ProjectDataMock} from "../src/app/mockData/project-data.mock";
import {ProjectFactory} from "../src/app/lib/ProjectFactory";
import {IdentitySingleton} from "../src/app/lib/IdentitySingleton";
import {TaskFactory} from "../src/app/lib/TaskFactory";

describe('Project Tests', () => {

  test('projects is not empty', () => {
    let projectFactory = new ProjectFactory(IdentitySingleton.getInstance());
    let taskFactory = new TaskFactory(IdentitySingleton.getInstance());

    let project: Project = projectFactory.newProject();
    project.addTask(taskFactory.newTask());
    project.addTask(taskFactory.newTask());
    project.addTask(taskFactory.newTask());
    project.addTask(taskFactory.newTask());

    expect(project.length).not.toBe(0);
  })

  test('All task and project IDs are unique among projects.', () => {
    let projects = ProjectDataMock();
    let allProjectIds = projects.map(project => project.ID);
    let allTaskIDs: number[] = [];

    for (let project of projects) {
      allTaskIDs.push(...project.Tasks.map(task => task.ID));
    }

    expect(projects.length).not.toBe(0);
    expect(projects.length).toEqual(new Set(allProjectIds).size);

    expect(allTaskIDs.length).not.toBe(0);
    expect(allTaskIDs.length).toEqual(new Set(allTaskIDs).size);
  })
})
