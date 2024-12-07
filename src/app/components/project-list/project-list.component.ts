import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, inject, input, output } from "@angular/core";
import {
  createTaskModel,
  TaskDatabaseModel,
  TaskModel,
} from "../../models/task.model";
import { defaultProject, ProjectModel } from "../../models/project.model";

import { TaskState } from "../../constants/constants";
import { ProjectService } from "src/app/services/project.service";
import { TaskComponent } from "../task/task.component";


@Component({
    selector: "app-project-list",
    templateUrl: "./project-list.component.html",
    styleUrls: ["./project-list.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TaskComponent]
})
export class ProjectListComponent implements OnInit {
  projectService = inject(ProjectService);

  readonly project = input<ProjectModel>(defaultProject);

  readonly onProjectChanged = output<Event>();
  readonly onAddTaskToProject = output<Partial<TaskModel>>();

  projectColour: string = "#d2d2d2";

  private static taskSortMethod(a: TaskModel, b: TaskModel): number {
    // All done tasks go to the bottom of the list.
    if (a.state == TaskState.DONE) {
      return 1;
    } else if (b.state == TaskState.DONE) {
      return -1;
    }

    // Compare state.
    if (a.priority == b.priority) {
      if (a.state == b.state) {
        return 0;
      } else {
        return a.state > b.state ? -1 : 1;
      }
    }

    // Compare priority.
    return a.priority > b.priority ? -1 : 1;
  }

  ngOnInit(): void {
    const project = this.project();
    if (project.colour != "") {
      this.projectColour = project.colour;
    } else {
      // todo: Make it not so random.
      const randomColor =
        "#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
      this.projectColour = randomColor;
    }
  }

  addTaskToProject() {
    const task = {
      ...createTaskModel(),
      projectId: this.project().id,
      content: "",
      state: TaskState.TODO,
      name: "",
    };

    this.projectService.createTaskOnProject(task).subscribe(
      (result) => {
        const responseTask: TaskDatabaseModel = result.shift()!;
        // todo: implement this.
      },
      (error) => {}
    );
  }

  openDialog(projectId: number) {
    this.projectService.$selectedProjectId.set(projectId);
  }
}
