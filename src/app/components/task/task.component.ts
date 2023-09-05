import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Task, TaskModel } from "../../models/task.model";
import {
  TaskDeletedEvent,
  TaskPinnedEvent,
  TaskUpdatedEvent,
} from "../../models/events.model";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "../../reducers";
import { deleteTask, updateTask } from "../../actions/task.actions";
import { CdkMenuModule } from "@angular/cdk/menu";
import { BrowserModule } from "@angular/platform-browser";
import { ProjectService } from "src/app/services/project.service";

@Component({
  standalone: true,
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.scss"],
  imports: [BrowserModule, CdkMenuModule],
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task: TaskModel = new Task();
  @Input() projectCode: string = "";

  @Output() onPinTask = new EventEmitter<TaskPinnedEvent>();

  @Output() onTaskChanged = new EventEmitter<TaskUpdatedEvent>();

  @Output() onTaskDeleted = new EventEmitter<TaskDeletedEvent>();

  $dialogSubscription: Subscription | undefined;
  public label = "";

  constructor(
    private projectService: ProjectService,
    private store: Store<AppState>
  ) {
    this.label = this.projectCode;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$dialogSubscription?.unsubscribe();
  }

  onDelete(id: number) {
    this.projectService.deleteTask(id).subscribe(
      (result) => {
        this.store.dispatch(deleteTask({ id: id }));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateTask() {
    this.projectService.updateTask(this.task).subscribe((value) => {
      this.store.dispatch(updateTask(this.task));
    });
  }

  openDialog() {
    // const dialogRef = this.dialog.open(EditTaskDialogComponent, {
    //   data: {task: this.task},
    //   panelClass: ['dialog-style', 'dialog-small'],
    // });
    // this.$dialogSubscription = dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     const model: TaskModel = {
    //       ...result
    //     }
    //     this.dataProvider.updateTask(model).subscribe(value => {
    //       this.store.dispatch(updateTask({
    //         ...model
    //       }));
    //     })
    //   }
    // });
  }
}
