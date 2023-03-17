import {Component, Inject, OnInit} from '@angular/core';
import {generateCode, ProjectModel} from "../../models/project.model";
import {FormControl, FormGroup} from "@angular/forms";
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers";
import {DataProviderService} from "../../services/data-provider.service";
import {deleteProject, updateProject} from "../../actions/project.actions";

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
    private store: Store<AppState>,
    private dataProvider: DataProviderService,
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

  deleteProject() {
    const id = this.model.id;
    this.dataProvider.projectService.deleteProject(id)
      .subscribe(_ => {
        this.dialogRef.close()
        this.store.dispatch(deleteProject({id: id}))
      });
  }

  saveProject() {
    const model = this.getDialogData();

    if (!model) {
      return;
    }

    this.dataProvider.updateProject(model)
      .subscribe(_ => {
        this.store.dispatch(updateProject(model));
        this.dialogRef.close();
      })
  }
}
