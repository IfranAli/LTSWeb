import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  styleUrls: ['./card.component.css'],
  template: `
    <div class="card card-header flex flex-col" [class.noBodyPadding]="noBodyPadding">
      <!-- Header -->
      <div class="header rounded-t-lg">
        <ng-content select="[card-header]"></ng-content>
      </div>

      <!-- Body -->
      <div class="body flex flex-col gap-3 justify-between">
        <ng-content select="[card-body]"></ng-content>
      </div>

      <div class="footer">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
})
export class cardComponent {
  @Input() noBodyPadding: boolean = false;
}
