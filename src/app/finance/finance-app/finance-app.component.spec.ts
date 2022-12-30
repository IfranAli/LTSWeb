import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceAppComponent } from './finance-app.component';

describe('FinanceAppComponent', () => {
  let component: FinanceAppComponent;
  let fixture: ComponentFixture<FinanceAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FinanceAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
