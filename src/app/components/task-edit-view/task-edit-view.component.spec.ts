import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEditViewComponent } from './task-edit-view.component';

describe('TaskEditViewComponent', () => {
  let component: TaskEditViewComponent;
  let fixture: ComponentFixture<TaskEditViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskEditViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskEditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
