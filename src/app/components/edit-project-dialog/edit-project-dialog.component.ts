import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { generateCode, ProjectModel } from "../../models/project.model";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { ProjectService } from "src/app/services/project.service";
import {
  DialogBaseComponent,
  DialogComponent,
} from "src/app/dialog/dialog.component";


@Component({
    selector: "app-edit-project-dialog",
    templateUrl: "./edit-project-dialog.component.html",
    styleUrls: ["./edit-project-dialog.component.scss"],
    imports: [ReactiveFormsModule, DialogComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProjectDialogComponent extends DialogBaseComponent {
  private projectService = inject(ProjectService);

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

  constructor() {
    super();
    const data = this.projectService.$selectedProject();

    this.form.setValue({
      title: data?.title ?? "",
      content: data?.description ?? "",
      colour: data?.colour ?? "",
      code: data?.code ?? "",
    });
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
    };
  }

  deleteProject() {
    const id = this.model.id;
    this.projectService.deleteProject(id).subscribe((_) => {});
  }

  saveProject() {
    const model = this.getDialogData();

    if (!model) {
      return;
    }

    this.projectService.updateProject(model).subscribe((_) => {});
  }
}
