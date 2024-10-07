import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import { Task, TaskModel } from "../../models/task.model";
import { ProjectService } from "src/app/services/project.service";
import { CommonModule } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.scss"],
  imports: [CommonModule],
})
export class TaskComponent {
  @Input() task: TaskModel = new Task();
  @Input() projectCode: string = "";

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
      .updateTask(this.task)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  openDialog() {
    this.projectService.$selectedTask.set(this.task);
  }
}
