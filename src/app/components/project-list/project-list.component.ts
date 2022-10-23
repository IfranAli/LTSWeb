import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from "../../models/task";
import {DataProviderService} from "../../services/data-provider.service";
import {TaskDeletedEvent, TaskPinnedEvent, TaskUpdatedEvent} from "../../models/events.model";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {Project} from "../../models/project.model";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  @Input() project: Project = this.dataProvider.addProject();

  @Output()
  onProjectChanged = new EventEmitter<Event>();

  constructor(
    private dataProvider: DataProviderService
  ) {
    this.sortTasks();
  }

  ngOnInit(): void {
  }

  onTaskChanged(task: TaskUpdatedEvent) {
    this.sortTasks();
  }

  onTaskDeleted($event: TaskDeletedEvent) {
    let findIndex = this.project.tasks.findIndex(value => {
      return value.id == $event.taskID;
    })

    if (findIndex >= 0) {
      this.project.tasks.splice(findIndex, 1);
    }
  }

  taskSortMethod(a: Task, b: Task): number {
    let pinned = (a.isPinned > b.isPinned);

    if (pinned) {
      return -1;
    }

    if (!b.isPinned && (a.state > b.state)) {
      return -1;
    }

    return 1;
  }

  onTaskPinned($event: TaskPinnedEvent) {
    this.sortTasks();
  }

  sortTasks(): void {
    this.project.tasks.sort(this.taskSortMethod);
  }

  drop($event: CdkDragDrop<Task[], any>) {
    let item = $event.item.data as Task;
    // todo:: Find project (source container) from item
  }
}
