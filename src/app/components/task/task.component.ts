import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task, TaskState} from "../../models/task.model";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit{
  @Input() task: Task = new Task();

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();

  ngOnInit(): void {
  }

  /**
   * Component method to trigger the onPin event
   * @param state
   * @param id string
   */
  onPin(state: boolean, id: any) {
    this.task.isPinned = state;
    this.onPinTask.emit(id);
  }

  /**
   * Component method to trigger the onArchive event
   * @param id string
   */
  onArchive(id: any) {
    this.task.state = TaskState.DONE;
    this.onArchiveTask.emit(id);
  }

  onTaskToggle(checked: boolean) {
    this.task.state = (checked ? TaskState.DONE : TaskState.TODO);
  }
}
