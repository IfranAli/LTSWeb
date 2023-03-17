import {Component, Inject, OnInit} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";
import {createTaskModel, TaskModel} from "../../models/task.model";
import {FormControl, FormGroup} from "@angular/forms";
import {Priority, TaskState} from "../../constants/constants";

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.scss']
})
export class EditTaskDialogComponent implements OnInit {
  task: TaskModel;
  taskForm = new FormGroup({
    'name': new FormControl<string>(''),
    'content': new FormControl<string>(''),
    'projectId': new FormControl<number>(0),
    'state': new FormControl<TaskState>(TaskState.TODO),
    'priority': new FormControl<number>(Priority.MEDIUM),
  });

  public Priority = Priority;

  constructor(
    public dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: TaskModel },
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

  getDialogData(): TaskModel {
    const taskForm = this.taskForm.getRawValue() as Partial<TaskModel>;
    return createTaskModel(taskForm, this.task);
  }
}
