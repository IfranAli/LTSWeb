import {Component, OnInit} from '@angular/core';
import {DataProviderService} from "./services/data-provider.service";
import {createProject, loadProjects} from "./actions/project.actions";
import {Store} from "@ngrx/store";
import * as fromProjects from "./reducers/projects.reducer";
import {TaskModel,} from "./models/task.model";
import {ProjectModel} from "./models/project.model";
import {AppState} from "./reducers";
import {loadTasks} from "./actions/task.actions";
import {TaskState} from "./constants/constants";

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

      this.store.select(fromProjects.selectEntities).subscribe(value => {
        this.projects = Object.values(value) as ProjectModel[];
      });

      console.log(this.store.subscribe(value => {
        console.log(value);
      }));
    })

    this.dataProvider.getTasks().subscribe(dbTasks => {
      const taskModels: TaskModel[] = dbTasks.map(dbTask => {
        return {
          id: dbTask.id,
          projectId: dbTask.projectId,
          name: dbTask.name,
          content: dbTask.content,
          state: dbTask.state,
        }
      })

      this.store.dispatch(loadTasks({entities: taskModels}))
    });
  }
}
