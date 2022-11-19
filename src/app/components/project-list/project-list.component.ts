import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from "../../models/task";
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
    tasks: [], ID: 0, Title: '', Description: ''
  };

  @Output() onProjectChanged = new EventEmitter<Event>();

  constructor(private dataProvider: DataProviderService) {
    this.sortTasks();
  }

  private static taskSortMethod(a: Task, b: Task): number {
    let pinned = (a.isPinned > b.isPinned);

    if (pinned) {
      return -1;
    }

    if (!b.isPinned && (a.state > b.state)) {
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

  drop($event: CdkDragDrop<Task[], any>) {
    if (!this.project) return;
    if (!(this.project.tasks.length > 0)) return;

    let item = $event.item.data as Task;
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

  private hasTasks(): boolean {
    return (this.project) ? (this.project.tasks?.length > 0) : false;
  }
}
