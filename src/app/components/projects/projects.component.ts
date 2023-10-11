import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  signal,
} from "@angular/core";
import {
  createProjectModel,
  ProjectDatabaseModel,
  ProjectModel,
} from "../../models/project.model";
import { UserModel } from "../../models/user.interface";
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
  projects: ProjectModel[] = [];
  user: UserModel | null = null;
  showInactiveProjects = false;

  $refreshProjects = signal(false);
  $showEditProjectDialog = computed(
    () => this.projectService.$selectedProject() != null
  );
  $showEditTaskDialog = computed(
    () => this.projectService.$selectedTask() != null
  );

  constructor(public projectService: ProjectService) {}

  projectsSort = function (a: ProjectModel, b: ProjectModel): number {
    return a.enabled === b.enabled ? 0 : a.enabled ? -1 : 1;
  };

  $projects = this.projectService.$projectsWithTasks;

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

  private refresh() {
    this.$refreshProjects.set(true);
  }

  onCloseDialogEvent(value: any) {
    this.projectService.$selectedProjectId.set(-1);
    this.projectService.$selectedTask.set(null);
  }
}
