import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {createTaskModel, Task, TaskModel} from "../../models/task.model";
import {TaskDeletedEvent, TaskPinnedEvent, TaskUpdatedEvent} from "../../models/events.model";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers";
import {deleteTask, updateTask} from "../../actions/task.actions";
import {DataProviderService} from "../../services/data-provider.service";
import {MatDialog} from "@angular/material/dialog";
import {EditTaskDialogComponent} from "../../edit-task-dialog/edit-task-dialog.component";
import {TaskState} from "../../constants/constants";

@Component({
  selector: 'app-task', templateUrl: './task.component.html', styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @Input() task: TaskModel = new Task();

  @Output() onPinTask = new EventEmitter<TaskPinnedEvent>();

  @Output() onTaskChanged = new EventEmitter<TaskUpdatedEvent>();

  @Output() onTaskDeleted = new EventEmitter<TaskDeletedEvent>();

  formGroup = new FormGroup({
    'name': new FormControl<typeof Task.name>('')
  })

  constructor(
    private store: Store<AppState>,
    private dataProvider: DataProviderService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.formGroup.controls.name.setValue(this.task.name);

    this.formGroup.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(value => {

        this.task = {
          ...createTaskModel(this.task),
          name: value.name ?? this.task.name,
        }

        this.updateTask();
      })
  }

  onTaskToggle(checked: boolean) {
    this.task.state = (checked ? TaskState.DONE : TaskState.TODO);

  }

  onDelete(id: number) {
    this.dataProvider.deleteTask(id).subscribe((result) => {
      this.store.dispatch(deleteTask({id: id}))
    }, error => {
      console.log(error);
    })
  }

  updateTask() {
    this.dataProvider.updateTask(this.task).subscribe(value => {
      this.store.dispatch(updateTask(this.task))
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: {task: this.task},
      panelClass: ['dialog-style', 'dialog-small'],
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const model: TaskModel = {
          ...result
        }

        this.dataProvider.updateTask(model).subscribe(value => {
          this.store.dispatch(updateTask({
            ...model
          }));
        })
      }
    });
  }
}
