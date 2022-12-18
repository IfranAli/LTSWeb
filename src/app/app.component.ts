import {Component, OnInit} from '@angular/core';
import {DataProviderService} from "./services/data-provider.service";
import {loadProjects} from "./actions/project.actions";
import {Store} from "@ngrx/store";
import * as fromProjects from "./reducers/projects.reducer";
import {createTaskModel, } from "./models/task.model";
import {ProjectModel} from "./models/project.model";
import {AppState} from "./reducers";
import {loadTasks} from "./actions/task.actions";

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
      this.store.dispatch(loadTasks({
        entities: dbTasks.map(dbTask => createTaskModel(dbTask))
      }))
    });
  }
}
