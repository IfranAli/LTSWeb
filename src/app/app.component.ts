import {Component} from '@angular/core';
import {DataProviderService} from "./services/data-provider.service";
import {createProject} from "./components/project-list/project.actions";
import {Store} from "@ngrx/store";
import {AppState, ProjectState} from "./components/project-list/project.reducer";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LTSweb';
  projects$: Observable<ProjectState> = this.store.select('projects');

  constructor(
    private dataProvider: DataProviderService,
    private store: Store<AppState>
  ) {

    this.projects$.subscribe(state => {
      console.log(state.projects)
    });

    // todo: Push projects from dataProvider to store.
    store.dispatch(createProject());
    store.dispatch(createProject());
    store.dispatch(createProject());
  }

  trackProjects(index: number, element: any) {
    return element ? element.id : null
  }

  deleteItem(id: number) {
    console.log('deleting' + ' ' + id);
  }
}
