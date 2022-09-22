import {Component, Input, OnInit} from '@angular/core';
import {Task} from "../../models/task.model";
import {TaskMockData} from "../../mockData/Task.mock";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  @Input() tasks: Task[] = TaskMockData;

  title = 'Project 1';

  constructor() { }

  ngOnInit(): void {
  }
}
