import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {createTaskModel, Task, TaskModel} from "../../models/task.model";
import {TaskDeletedEvent, TaskPinnedEvent, TaskUpdatedEvent} from "../../models/events.model";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Subscription, tap} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers";
import {deleteTask, updateTask} from "../../actions/task.actions";
import {DataProviderService} from "../../services/data-provider.service";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {EditTaskDialogComponent} from "../edit-task-dialog/edit-task-dialog.component";
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import {CdkMenuModule} from "@angular/cdk/menu";
import {BrowserModule} from "@angular/platform-browser";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";

@Component({
  standalone: true,
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  imports: [
    BrowserModule,
    MatCheckboxModule,
    CdkMenuModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task: TaskModel = new Task();

  @Output() onPinTask = new EventEmitter<TaskPinnedEvent>();

  @Output() onTaskChanged = new EventEmitter<TaskUpdatedEvent>();

  @Output() onTaskDeleted = new EventEmitter<TaskDeletedEvent>();


  $dialogSubscription: Subscription | undefined;

  constructor(
    private store: Store<AppState>,
    private dataProvider: DataProviderService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.$dialogSubscription?.unsubscribe();
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

    this.$dialogSubscription = dialogRef.afterClosed().subscribe(result => {
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
