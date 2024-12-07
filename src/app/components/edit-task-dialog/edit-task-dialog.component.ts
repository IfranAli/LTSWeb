import { Component, DestroyRef, inject } from "@angular/core";
import { createTaskModel, TaskModel } from "../../models/task.model";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Priority, TaskState } from "../../constants/constants";
import { AsyncPipe } from "@angular/common";
import { ProjectService } from "src/app/services/project.service";
import {
  DialogBaseComponent,
  DialogComponent,
} from "src/app/dialog/dialog.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-edit-task-dialog",
    templateUrl: "./edit-task-dialog.component.html",
    styleUrls: ["./edit-task-dialog.component.scss"],
    imports: [
    ReactiveFormsModule,
    AsyncPipe,
    DialogComponent,
    DialogBaseComponent
]
})
export class EditTaskDialogComponent extends DialogBaseComponent {
  private destroyRef = inject(DestroyRef);
  private projectService = inject(ProjectService);

  task: TaskModel;
  taskForm = new FormGroup({
    name: new FormControl<string>(""),
    content: new FormControl<string>(""),
    projectId: new FormControl<number>(0),
    state: new FormControl<TaskState>(TaskState.TODO),
    priority: new FormControl<number>(Priority.MEDIUM),
  });

  public Priority = Priority;

  constructor() {
    super();

    const data = this.projectService.$selectedTask();

    this.task = {
      name: data?.name ?? "",
      content: data?.content ?? "",
      projectId: data?.projectId ?? 0,
      state: data?.state ?? TaskState.TODO,
      priority: data?.priority ?? Priority.MEDIUM,
      id: data?.id ?? -1,
    };

    this.taskForm.setValue({
      name: this.task.name,
      content: this.task.content,
      projectId: this.task.projectId,
      state: this.task.state,
      priority: this.task.priority,
    });
  }

  getDialogData(): TaskModel {
    
    const taskForm = this.taskForm.getRawValue() as Partial<TaskModel>;
    return createTaskModel(taskForm, this.task);
  }

  deleteTask() {
    const taskId = this.task?.id;
    if (!taskId) {
      console.error("task id is not valid");
      return
    }

    console.log("delete task", taskId);
    this.projectService.deleteTask(this.task.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => {
          console.log(value);
          this.onModalClose.emit(true);
        },
        error: (err) => {
          console.error(err);
          this.onModalClose.emit(true);
        },
      });
  }

  save() {
    const data = this.getDialogData();

    if (data.id > 0) {
      this.projectService
        .updateTask(data)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          console.log(value);
          this.onModalClose.emit(true);
        });
    } else {
      this.projectService
        .createTaskOnProject(data)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this.onModalClose.emit(true);
        });
    }

    // this.dialogRef.close(data);
  }
}
