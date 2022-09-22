import {TaskMockData} from "../src/app/mockData/Task.mock";
import {Project} from "../src/app/models/project.model";

describe('Project Tests', () => {

  test('projects is not empty', () => {
    let project: Project = new Project();

    for (let task of TaskMockData) {
      project.addTask(task);
    }

    expect(project.length).not.toBe(0);
  })
});
