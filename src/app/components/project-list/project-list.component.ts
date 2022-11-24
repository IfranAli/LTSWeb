import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskModel} from "../../models/task.model";
import {DataProviderService} from "../../services/data-provider.service";
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
    Tasks: [], ID: 0, Title: '', Description: ''
  };

  @Output() onProjectChanged = new EventEmitter<Event>();

  constructor(private dataProvider: DataProviderService) {
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
    if (!(this.project.Tasks.length > 0)) return;

    let findIndex = this.project.Tasks.findIndex(value => {
      return value.ID == $event.taskID;
    })

    if (findIndex && findIndex >= 0) {
      this.project.Tasks.splice(findIndex, 1);
    }
  }

  drop($event: CdkDragDrop<TaskModel[], any>) {
    if (!this.project) return;
    if (!(this.project.Tasks.length > 0)) return;

    let item = $event.item.data as TaskModel;
    // todo:: Find project (source container) from item
  }

  onTaskPinned($event: TaskPinnedEvent) {
    this.sortTasks();
  }

  sortTasks(): void {
    if (!this.project) return;
    if (!(this.project.Tasks.length > 0)) return;

    this.project.Tasks.sort(ProjectListComponent.taskSortMethod);
  }

  private hasTasks(): boolean {
    return (this.project) ? (this.project.Tasks?.length > 0) : false;
  }
}
