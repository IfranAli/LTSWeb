import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskDatabaseModel, TaskModel, TaskModelPublic, TaskState} from "../../models/task.model";
import {TaskDeletedEvent, TaskPinnedEvent, TaskUpdatedEvent} from "../../models/events.model";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {ProjectModel} from "../../models/project.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers";

import * as fromTask from "../../reducers/tasks.reducer"
import {Dictionary} from "@ngrx/entity";
import {createTask, updateTask} from "../../actions/task.actions";
import {DataProviderService} from "../../services/data-provider.service";
import {EditProjectDialogComponent} from "../../edit-project-dialog/edit-project-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {updateProject} from "../../actions/project.actions";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  @Input() project: ProjectModel = {
    tasks: [], id: 0, title: '', description: '', colour: '#A0A0D0'
  };

  @Output() onProjectChanged = new EventEmitter<Event>();
  @Output() onAddTaskToProject = new EventEmitter<Partial<TaskModel>>();

  projectColour: string = '#d2d2d2';

  constructor(
    private store: Store<AppState>,
    private dataProvider: DataProviderService,
    private dialog: MatDialog,
  ) {
    this.sortTasks();
  }

  private static taskSortMethod(a: TaskModel, b: TaskModel): number {
    if (a.state > b.state) {
      return -1;
    }

    return 1;
  }

  ngOnInit(): void {
    if (this.project.colour != "") {
      this.projectColour = this.project.colour;
    } else {
      // todo: Make it not so random.
      const randomColor = '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
      this.projectColour = randomColor;
    }

    this.store.select(fromTask.selectEntities).subscribe((tasks: Dictionary<TaskModel>) => {
      const taskArray: TaskModel[] = Object.values(tasks) as TaskModel[] ?? [];
      const filtered = taskArray.filter(value => value.projectId == this.project.id);

      if (filtered != []) {
        this.project = {
          ...this.project,
          tasks: filtered,
        }
      }
    });
  }

  onTaskChanged(task: TaskUpdatedEvent) {
    this.sortTasks();
  }

  onTaskDeleted($event: TaskDeletedEvent) {
    if (!this.project) return;
    if (!(this.project.tasks.length > 0)) return;

    let findIndex = this.project.tasks.findIndex(value => {
      return value.id == $event.taskID;
    })

    if (findIndex && findIndex >= 0) {
      this.project.tasks.splice(findIndex, 1);
    }
  }

  drop($event: CdkDragDrop<TaskModel[], any>) {
    if (!this.project) return;
    if (!(this.project.tasks.length > 0)) return;

    const item = $event.item.data as TaskModel;
    const destinationContainer = $event.container;
    const containerID = destinationContainer.id.split('-').pop() ?? '';
    const newProjectID = Number.parseInt(containerID) ?? item.id;

    let model: TaskDatabaseModel = {
      id: item.id,
      content: item.content,
      name: item.name,
      projectId: newProjectID,
    }
    this.dataProvider.updateTask(model).subscribe(value => {
      const model: TaskDatabaseModel = value.shift()!;
      this.store.dispatch(updateTask({
        ...model
      }));
    })
  }

  onTaskPinned($event: TaskPinnedEvent) {
    this.sortTasks();
  }

  sortTasks(): void {
    if (!this.project) return;
    if (!(this.project.tasks.length > 0)) return;

    this.project.tasks.sort(ProjectListComponent.taskSortMethod);
  }

  addTaskToProject() {
    const task = {
      projectId: this.project.id,
      content: '',
      state: TaskState.TODO,
      name: 'New Task'
    }

    this.dataProvider.addTask(task).subscribe((result) => {
      const responseTask: TaskDatabaseModel = result.shift()!;

      this.store.dispatch(createTask({
        id: responseTask.id,
        projectId: responseTask.projectId,
        name: responseTask.name,
        content: responseTask.content,
        state: TaskState.TODO,
      }))
    }, error => {

    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(EditProjectDialogComponent, {
      width: '250px',
      data: {project: this.project},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const model: ProjectModel = {
          ...result
        }

        this.dataProvider.updateProject(model).subscribe(value => {
          this.store.dispatch(updateProject({
            ...model
          }));
        })
      }
    });
  }
}
