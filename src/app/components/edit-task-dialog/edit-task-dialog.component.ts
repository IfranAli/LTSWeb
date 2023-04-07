import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef
} from "@angular/material/legacy-dialog";
import {createTaskModel, TaskModel} from "../../models/task.model";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Priority, TaskState} from "../../constants/constants";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers";
import {of, Subscription, switchMap, tap} from "rxjs";
import {ProjectModel} from "../../models/project.model";
import {DataProviderService} from "../../services/data-provider.service";
import {AsyncPipe, NgForOf} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import {deleteTask} from "../../actions/task.actions";

@Component({
  standalone: true,
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    MatDialogModule,
    NgForOf
  ],
  styleUrls: ['./edit-task-dialog.component.scss']
})
export class EditTaskDialogComponent implements OnInit, OnDestroy {
  task: TaskModel;
  taskForm = new FormGroup({
    'name': new FormControl<string>(''),
    'content': new FormControl<string>(''),
    'projectId': new FormControl<number>(0),
    'state': new FormControl<TaskState>(TaskState.TODO),
    'priority': new FormControl<number>(Priority.MEDIUM),
  });

  public Priority = Priority;

  projects$ = this.store.select('projects').pipe(
    switchMap(value => {
        const projects = Object.values(value.entities) as ProjectModel[];
        const r = projects.map((value1) => {
          return [value1.id, value1.title];
        })

        return of(r)
      }
    ))

  private subscription: Subscription | undefined;

  constructor(
    public dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: TaskModel },
    private store: Store<AppState>,
    private dataProvider: DataProviderService
  ) {
    this.task = data.task;
    this.taskForm.setValue({
      name: this.task.name,
      content: this.task.content,
      projectId: this.task.projectId,
      state: this.task.state,
      priority: this.task.priority,
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getDialogData(): TaskModel {
    const taskForm = this.taskForm.getRawValue() as Partial<TaskModel>;
    return createTaskModel(taskForm, this.task);
  }

  deleteTask() {
    this.subscription = this.dataProvider.deleteTask(this.task.id)
      .subscribe((result) => {
        this.store.dispatch(deleteTask({id: this.task.id}));
        this.dialogRef.close();
      })
  }

  save() {
    const data = this.getDialogData();
    this.dialogRef.close(data);
  }
}
