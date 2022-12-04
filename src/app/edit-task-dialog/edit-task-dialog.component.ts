import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TaskModel, TaskState} from "../models/task.model";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent implements OnInit {
  task: TaskModel;
  taskForm = new FormGroup({
    'name': new FormControl<string>(''),
    'content': new FormControl<string>(''),
    'projectId': new FormControl<number>(0),
    'state': new FormControl<TaskState>(0),
  });

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
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  getDialogData(): TaskModel {
    return {
      ...this.task,
      state: this.taskForm.controls.state.value ?? this.task.state,
      content: this.taskForm.controls.content.value ?? this.task.content,
      projectId: this.taskForm.controls.projectId.value ?? this.task.projectId,
    }
  }
}
