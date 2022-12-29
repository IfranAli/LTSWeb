import {Component, Inject, OnInit} from '@angular/core';
import {generateCode, ProjectModel} from "../../models/project.model";
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-project-dialog',
  templateUrl: './edit-project-dialog.component.html',
  styleUrls: ['./edit-project-dialog.component.scss']
})
export class EditProjectDialogComponent implements OnInit {
  model: ProjectModel;
  form = new FormGroup({
    'title': new FormControl<string>(''),
    'content': new FormControl<string>(''),
    'colour': new FormControl<string>(''),
    'code': new FormControl<string>(''),
  });

  constructor(
    public dialogRef: MatDialogRef<EditProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project: ProjectModel },
  ) {
    this.model = data.project;
    this.form.setValue({
      title: this.model.title,
      content: this.model.description,
      colour: this.model.colour,
      code: this.model.code,
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  getDialogData(): ProjectModel {
    const title = this.form.controls.title.value ?? this.model.title;
    let projectCode = this.form.controls.code.value ?? this.model.code;

    if (projectCode.length == 0) {
      projectCode = generateCode(title);
    }

    return {
      ...this.model,
      title: title,
      description: this.form.controls.content.value ?? this.model.description,
      colour: this.form.controls.colour.value ?? this.model.colour,
      code: projectCode,
    }
  }

}
