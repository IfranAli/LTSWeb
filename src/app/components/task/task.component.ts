import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  inject,
  input
} from "@angular/core";
import { Task, TaskModel } from "../../models/task.model";
import { ProjectService } from "src/app/services/project.service";

import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    selector: "app-task",
    templateUrl: "./task.component.html",
    styleUrls: ["./task.component.scss"],
    imports: []
})
export class TaskComponent {
  readonly task = input<TaskModel>(new Task());
  readonly projectCode = input<string>("");

  private projectService = inject(ProjectService);
  private destroyRef = inject(DestroyRef);

  onDelete(id: number) {
    this.projectService
      .deleteTask(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  updateTask() {
    this.projectService
      .updateTask(this.task())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  openDialog() {
    this.projectService.$selectedTask.set(this.task());
  }
}
