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
import { CdkMenuModule } from "@angular/cdk/menu";
import { BrowserModule } from "@angular/platform-browser";
import { ProjectService } from "src/app/services/project.service";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.scss"],
  imports: [CommonModule, CdkMenuModule],
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task: TaskModel = new Task();
  @Input() projectCode: string = "";

  @Output() onPinTask = new EventEmitter<TaskPinnedEvent>();

  @Output() onTaskChanged = new EventEmitter<TaskUpdatedEvent>();

  @Output() onTaskDeleted = new EventEmitter<TaskDeletedEvent>();

  $dialogSubscription: Subscription | undefined;
  public label = "";

  constructor(private projectService: ProjectService) {
    this.label = this.projectCode;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$dialogSubscription?.unsubscribe();
  }

  onDelete(id: number) {
    this.projectService.deleteTask(id).subscribe(
      (result) => {
        // this.store.dispatch(deleteTask({ id: id }));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateTask() {
    this.projectService.updateTask(this.task).subscribe((value) => {
      // this.store.dispatch(updateTask(this.task));
    });
  }

  openDialog() {
    this.projectService.$selectedTask.set(this.task);
  }
}
