import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task, TaskState} from "../../models/task.model";
import {TaskDeletedEvent, TaskPinnedEvent, TaskUpdatedEvent} from "../../models/events.model";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input() task: Task = new Task();

  @Output()
  onPinTask = new EventEmitter<TaskPinnedEvent>();

  @Output()
  onTaskChanged = new EventEmitter<TaskUpdatedEvent>();

  @Output()
  onTaskDeleted = new EventEmitter<TaskDeletedEvent>();

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

  onTaskToggle(checked: boolean) {
    this.task.state = (checked ? TaskState.DONE : TaskState.TODO);

    this.onTaskChanged.emit({
      fields: ['state'],
      task: this.task,
      reason: 'Task item checked true'
    });
  }

  onDelete(id: number) {
    this.onTaskDeleted.emit({
      taskID: id,
      reason: 'Deleted by user'
    })
  }
}
