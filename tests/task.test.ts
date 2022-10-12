import {TaskMockData} from "../src/app/mockData/task-data.mock";
import {Task} from "../src/app/models/task.model";

describe('testing tasks', () => {

  test('task is not empty', () => {
    let task: Task = TaskMockData[0];

    expect(task.title).not.toBe('');
  })
});
