import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import {
  createTaskModel,
  TaskDatabaseModel,
  TaskModel,
} from "../../models/task.model";
import {
  TaskDeletedEvent,
  TaskPinnedEvent,
  TaskUpdatedEvent,
} from "../../models/events.model";
import { CdkDragDrop, DragDropModule } from "@angular/cdk/drag-drop";
import { defaultProject, ProjectModel } from "../../models/project.model";

import { TaskState } from "../../constants/constants";
import { ProjectService } from "src/app/services/project.service";
import { TaskComponent } from "../task/task.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskComponent],
})
export class ProjectListComponent implements OnInit {
  @Input() project: ProjectModel = defaultProject;

  @Output() onProjectChanged = new EventEmitter<Event>();
  @Output() onAddTaskToProject = new EventEmitter<Partial<TaskModel>>();

  projectColour: string = "#d2d2d2";

  constructor(public projectService: ProjectService) {}

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
    if (this.project.colour != "") {
      this.projectColour = this.project.colour;
    } else {
      // todo: Make it not so random.
      const randomColor =
        "#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
      this.projectColour = randomColor;
    }
  }

  onTaskChanged(task: TaskUpdatedEvent) {}

  onTaskDeleted($event: TaskDeletedEvent) {
    if (!this.project) return;
    if (!(this.project.tasks.length > 0)) return;

    let findIndex = this.project.tasks.findIndex((value) => {
      return value.id == $event.taskID;
    });

    if (findIndex && findIndex >= 0) {
      this.project.tasks.splice(findIndex, 1);
    }
  }

  drop($event: CdkDragDrop<TaskModel[], any>) {
    const item = $event.item.data as TaskModel;
    const destinationContainer = $event.container;
    const containerID = destinationContainer.id.split("-").pop() ?? "";
    const newProjectID = Number.parseInt(containerID) ?? item.id;

    let model = createTaskModel({
      ...item,
      projectId: newProjectID,
    });

    this.projectService.updateTask(model).subscribe((value) => {
      const response: TaskDatabaseModel = value.shift()!;
      // // this.store.dispatch(
      // //   updateTask({
      // //     ...response,
      // //   })
      // );
    });
  }

  onTaskPinned($event: TaskPinnedEvent) {}

  addTaskToProject() {
    const task = {
      ...createTaskModel(),
      projectId: this.project.id,
      content: "",
      state: TaskState.TODO,
      name: "",
    };

    this.projectService.createTaskOnProject(task).subscribe(
      (result) => {
        const responseTask: TaskDatabaseModel = result.shift()!;

        // this.store.dispatch(
        //   createTask({
        //     ...createTaskModel(responseTask),
        //   })
        // );
      },
      (error) => {}
    );
  }

  openDialog(projectId: number) {
    this.projectService.$selectedProjectId.set(projectId);
  }
}
