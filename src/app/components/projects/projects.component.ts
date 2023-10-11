import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
} from "@angular/core";
import {
  createProjectModel,
  ProjectDatabaseModel,
} from "../../models/project.model";
import { ProjectService } from "src/app/services/project.service";
import { EditProjectDialogComponent } from "../edit-project-dialog/edit-project-dialog.component";
import { ProjectListComponent } from "../project-list/project-list.component";
import { CommonModule } from "@angular/common";
import { EditTaskDialogComponent } from "../edit-task-dialog/edit-task-dialog.component";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    EditProjectDialogComponent,
    ProjectListComponent,
    EditTaskDialogComponent,
  ],
})
export class ProjectsComponent {
  projectService = inject(ProjectService);
  $projects = this.projectService.$projectsWithTasks;

  $showEditProjectDialog = computed(
    () => this.projectService.$selectedProject() != null
  );
  $showEditTaskDialog = computed(
    () => this.projectService.$selectedTask() != null
  );

  addProject() {
    const model: Omit<ProjectDatabaseModel, "id"> = {
      ...createProjectModel({
        title: "New Project",
      }),
    };

    // todo: Fix this.
    // this.projectService
    //   .createProject(model)
    //   .pipe(tap((project) => this.refresh()))
    //   .subscribe((res) => this.store.dispatch(createProject(res.shift()!)));
  }

  onCloseDialogEvent(value: any) {
    this.projectService.$selectedProjectId.set(-1);
    this.projectService.$selectedTask.set(null);

    if (value) {
      this.projectService.$refreshProjects.next(true);
    }
  }
}
