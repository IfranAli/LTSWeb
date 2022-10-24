import { Component } from '@angular/core';
import {Project} from "./models/project.model";
import {ProjectDataMock} from "./mockData/project-data.mock";
import {DataProviderService} from "./services/data-provider.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LTSweb';
  projects: Project[] = [];

  constructor(
    private dataProvider: DataProviderService
  ) {
    this.projects = dataProvider.getProjects();
  }

  trackProjects(index: number, element: any) {
    return element ? element.id: null
  }
}
