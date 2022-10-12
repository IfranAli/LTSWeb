import { Component } from '@angular/core';
import {Task} from "./models/task.model";
import {TaskMockData} from "./mockData/task-data.mock";
import {Project} from "./models/project.model";
import {ProjectDataMock} from "./mockData/project-data.mock";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LTSweb';
  projects: Project[] = ProjectDataMock;
  // tasks: Task[] = TaskMockData;
  // tasks2: Task[] = [];
}
