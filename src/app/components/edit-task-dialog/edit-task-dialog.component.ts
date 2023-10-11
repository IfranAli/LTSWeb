import { Component } from "@angular/core";
import { createTaskModel, TaskModel } from "../../models/task.model";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Priority, TaskState } from "../../constants/constants";
import { AsyncPipe, NgForOf } from "@angular/common";
import { ProjectService } from "src/app/services/project.service";
import {
  DialogBaseComponent,
  DialogComponent,
} from "src/app/dialog/dialog.component";

@Component({
  standalone: true,
  selector: "app-edit-task-dialog",
  templateUrl: "./edit-task-dialog.component.html",
  styleUrls: ["./edit-task-dialog.component.scss"],
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgForOf,
    DialogComponent,
    DialogBaseComponent,
  ],
})
export class EditTaskDialogComponent extends DialogBaseComponent {
  task: TaskModel;
  taskForm = new FormGroup({
    name: new FormControl<string>(""),
    content: new FormControl<string>(""),
    projectId: new FormControl<number>(0),
    state: new FormControl<TaskState>(TaskState.TODO),
    priority: new FormControl<number>(Priority.MEDIUM),
  });

  public Priority = Priority;

  constructor(private projectService: ProjectService) {
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
    // this.subscription = this.projectService
    //   .deleteTask(this.task.id)
    //   .subscribe((result) => {
    //     // this.store.dispatch(deleteTask({ id: this.task.id }));
    //     // this.dialogRef.close();
    //   });
  }

  save() {
    const data = this.getDialogData();
    console.log(data)
    debugger;
    // this.dialogRef.close(data);
  }
}
