import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task, TaskDatabaseModel, TaskModel, TaskState} from "../../models/task.model";
import {TaskDeletedEvent, TaskPinnedEvent, TaskUpdatedEvent} from "../../models/events.model";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../reducers";
import {createTask, deleteTask, updateTask} from "../../actions/task.actions";
import {DataProviderService} from "../../services/data-provider.service";

@Component({
  selector: 'app-task', templateUrl: './task.component.html', styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @Input() task: TaskModel = new Task();

  @Output() onPinTask = new EventEmitter<TaskPinnedEvent>();

  @Output() onTaskChanged = new EventEmitter<TaskUpdatedEvent>();

  @Output() onTaskDeleted = new EventEmitter<TaskDeletedEvent>();

  formGroup = new FormGroup({
    'name': new FormControl<typeof Task.name>('')
  })

  constructor(
    private store: Store<AppState>,
    private dataProvider: DataProviderService,
  ) {
  }

  ngOnInit(): void {
    this.formGroup.controls.name.setValue(this.task.name);

    this.formGroup.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(value => {

        this.task = {
          id: this.task.id,
          projectId: this.task.projectId,
          state: TaskState.TODO,
          name: value.name ?? this.task.name,
          content: this.task.content,
        }

        this.store.dispatch(updateTask(this.task))
      })
  }

  onTaskToggle(checked: boolean) {
    this.task.state = (checked ? TaskState.DONE : TaskState.TODO);

  }

  onDelete(id: number) {
    this.dataProvider.deleteTask(id).subscribe((result) => {
      this.store.dispatch(deleteTask({id: id}))
    }, error => {
      console.log(error);
    })
  }
}
