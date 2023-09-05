import { Component, Inject, OnInit } from "@angular/core";
import { generateCode, ProjectModel } from "../../models/project.model";
import { FormControl, FormGroup } from "@angular/forms";

import { Store } from "@ngrx/store";
import { AppState } from "../../reducers";
import { deleteProject, updateProject } from "../../actions/project.actions";
import { ProjectService } from "src/app/services/project.service";

@Component({
  selector: "app-edit-project-dialog",
  templateUrl: "./edit-project-dialog.component.html",
  styleUrls: ["./edit-project-dialog.component.scss"],
})
export class EditProjectDialogComponent implements OnInit {
  model: ProjectModel = {
    tasks: [],
    title: "",
    description: "",
    colour: "",
    code: "",
    enabled: false,
    id: 0,
  };
  form = new FormGroup({
    title: new FormControl<string>(""),
    content: new FormControl<string>(""),
    colour: new FormControl<string>(""),
    code: new FormControl<string>(""),
  });

  constructor(
    private store: Store<AppState>,
    private projectService: ProjectService
  ) {
    // this.model = data.project;
    this.form.setValue({
      title: "", //this.model.title,
      content: "", ////this.model.description,
      colour: "", //this.model.colour,
      code: "", //this.model.code,
    });
  }

  onNoClick(): void {
    // this.dialogRef.close();
  }

  ngOnInit(): void {}

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
    };
  }

  deleteProject() {
    const id = this.model.id;
    this.projectService.deleteProject(id).subscribe((_) => {
      // this.dialogRef.close();
      this.store.dispatch(deleteProject({ id: id }));
    });
  }

  saveProject() {
    const model = this.getDialogData();

    if (!model) {
      return;
    }

    this.projectService.updateProject(model).subscribe((_) => {
      this.store.dispatch(updateProject(model));
      // this.dialogRef.close();
    });
  }
}
