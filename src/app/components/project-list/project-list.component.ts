import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskModel, TaskState} from "../../models/task.model";
import {TaskDeletedEvent, TaskPinnedEvent, TaskUpdatedEvent} from "../../models/events.model";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {ProjectModel} from "../../models/project.model";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  @Input() project: ProjectModel = {
    tasks: [], id: 0, title: '', description: ''
  };

  @Output() onProjectChanged = new EventEmitter<Event>();
  @Output() onAddTaskToProject = new EventEmitter<Partial<TaskModel>>();

  projectColour: string = '#d2d2d2';

  constructor() {
    // todo: Make it not so random.
    const randomColor = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6)
    this.projectColour = randomColor;
    this.sortTasks();
  }

  private static taskSortMethod(a: TaskModel, b: TaskModel): number {
    if (a.state > b.state) {
      return -1;
    }

    return 1;
  }

  ngOnInit(): void {
  }

  onTaskChanged(task: TaskUpdatedEvent) {
    this.sortTasks();
  }

  onTaskDeleted($event: TaskDeletedEvent) {
    if (!this.project) return;
    if (!(this.project.tasks.length > 0)) return;

    let findIndex = this.project.tasks.findIndex(value => {
      return value.id == $event.taskID;
    })

    if (findIndex && findIndex >= 0) {
      this.project.tasks.splice(findIndex, 1);
    }
  }

  drop($event: CdkDragDrop<TaskModel[], any>) {
    if (!this.project) return;
    if (!(this.project.tasks.length > 0)) return;

    let item = $event.item.data as TaskModel;
    // todo:: Find project (source container) from item
  }

  onTaskPinned($event: TaskPinnedEvent) {
    this.sortTasks();
  }

  sortTasks(): void {
    if (!this.project) return;
    if (!(this.project.tasks.length > 0)) return;

    this.project.tasks.sort(ProjectListComponent.taskSortMethod);
  }

  addTaskToProject() {
    this.onAddTaskToProject.emit({
      name: "Task Name",
      content: "New Task Content",
      projectId: this.project.id,
      state: TaskState.TODO
    })
  }

  private hasTasks(): boolean {
    return (this.project) ? (this.project.tasks?.length > 0) : false;
  }
}
