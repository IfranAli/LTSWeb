import {Component, OnInit} from '@angular/core';
import {DataProviderService} from "./services/data-provider.service";
import {addTaskToProject, createProject, loadProjects} from "./actions/project.actions";
import {Store} from "@ngrx/store";
import * as fromProjects from "./reducers/projects.reducer";
import {TaskModel} from "./models/task.model";
import {ProjectModel} from "./models/project.model";
import {AppState} from "./reducers";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'LTSweb';
  projects: ProjectModel[] = [];

  constructor(
    private dataProvider: DataProviderService,
    private store: Store<AppState>
  ) {

  }

  ngOnInit() {
    this.dataProvider.getProjects().subscribe((projects) => {
      this.store.dispatch(loadProjects({entities: projects}))

      this.store.dispatch(createProject({
        title: 'new project',
        description: 'project description here'
      }));

      this.store.select(fromProjects.selectEntities).subscribe(value => {
        this.projects = Object.values(value) as ProjectModel[];
      });

      console.log(this.store.subscribe(value => {
        console.log(value);
      }));
    })
  }

  addTaskToProject($event: Partial<TaskModel>) {
    this.store.dispatch(addTaskToProject($event));
  }
}
