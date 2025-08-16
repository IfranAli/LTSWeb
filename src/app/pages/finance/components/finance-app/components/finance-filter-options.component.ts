import { Component, ComponentRef, effect, ElementRef, inject, model, Signal, signal, viewChild } from '@angular/core';
import { DateTimeInputComponent } from 'src/app/components/date-time-input/date-time-input.component';

@Component({
  selector: 'app-dev-dialog',
  imports: [],
  template: `
    <dialog #dialogRef class="full-screen">
      <div class="dialog-container mx-auto p-4">
        <header class="header-actions">
          <button autofocus (click)="modalState.set(false)">Close</button>
          <h1 class="text-2xl font-bold">Developer Dialog</h1>
          <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Action</button>
        </header>

        <main>
          <form class="custom-form">
            <section>
              <label>Name</label>
              <input />

              <label>State</label>
              <select>
                <option [value]="0">Todo</option>
                <option [value]="1">In progress</option>
                <option [value]="2">Blocked</option>
                <option [value]="3">Done</option>
              </select>

              <label>Content</label>
              <textarea> </textarea>

              <label>Project ID</label>
              <select></select>

              <label>Priority</label>
              <select>
                <option [value]="0">Lowest</option>
                <option [value]="1">Medium</option>
                <option [value]="2">High</option>
                <option [value]="3">Highest</option>
              </select>
            </section>
          </form>

          <div class="overflow-y-scroll h-96"></div>
        </main>

        <footer class="mt-8">
          <p class="text-center text-gray-600">Developer Dialog Page</p>
          <button>Save</button>
        </footer>
      </div>
    </dialog>
  `,
  styles: ``,
})
export class DevDialogComponent {
  modalState = model(false);
  dialogElement = viewChild<ElementRef<HTMLDialogElement>>('dialogRef');

  onModalStateChange = effect(() => {
    const dialog = this.dialogElement()?.nativeElement;

    if (dialog) {
      const state = this.modalState();

      if (state) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  });
}

@Component({
  selector: 'app-dialog-wrapper',
  imports: [],
  providers: [],
  template: ``,
  styles: ``,
})
export class DialogWrapperComponent {
  // dialogService = inject(DialogTestService);
  dialogState = model(false);
  componentRef = signal<ComponentRef<DevDialogComponent> | null>(null);

  // ngAfterViewInit() {
  // const containerRef = this.dialogService.rootContainerRef();
  // if (containerRef) {
  //   const created = containerRef.createComponent(DevDialogComponent);
  //   created.instance.modalState = this.dialogState;
  //   this.componentRef.set(created);
  // }
  // }
}

@Component({
  selector: 'app-dev-test',
  imports: [DialogWrapperComponent, DateTimeInputComponent],
  template: `
    <div class="container mx-auto p-4">
      <header class="header-actions">
        <h1 class="text-2xl font-bold">Developer Testing Space</h1>
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          (click)="userToggleModal()"
        >
          Show Modal
        </button>
      </header>

      <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <section class="bg-zinc-800 p-4 rounded shadow">
          <h2 class="text-xl font-semibold">Section 1</h2>
          <p>
            <app-date-time-input [(inputDate)]="myDateTime"></app-date-time-input>
            /> Content for section 1.
          </p>
        </section>

        <section class="bg-zinc-800 p-4 rounded shadow">
          <h2 class="text-xl font-semibold">Section 2</h2>
          <p>Content for section 2.</p>
        </section>

        <section class="bg-zinc-800 p-4 rounded shadow">
          <h2 class="text-xl font-semibold">Section 3</h2>
          <p>Content for section 3.</p>
        </section>
      </main>

      <footer class="mt-8">
        <p class="text-center text-gray-600">Developer Test Page</p>
      </footer>

      <app-dialog-wrapper [(dialogState)]="showModal">
        <ng-container slot="content">
          <section class="bg-zinc-800 p-4 rounded shadow">
            <h2 class="text-xl font-semibold">Section 1</h2>
            <p>Content for section 1.</p>
          </section>

          <section class="bg-zinc-800 p-4 rounded shadow">
            <h2 class="text-xl font-semibold">Section 2</h2>
            <p>Content for section 2.</p>
          </section>

          <section class="bg-zinc-800 p-4 rounded shadow">
            <h2 class="text-xl font-semibold">Section 3</h2>
            <p>Content for section 3.</p>
          </section>
        </ng-container>
      </app-dialog-wrapper>
    </div>
  `,
  styles: ``,
})
export class FinanceFilterOptionsComponent {
  myDateTime = signal(new Date());
  showModal = signal(false);

  dateLogger = effect(() => {
    console.debug('Dev - Date updated', this.myDateTime());
  });

  dateUpdated(event: Date) {
    console.debug('Date updated', event);
  }

  userToggleModal() {
    console.debug('Toggling modal visibility.');
    this.showModal.update((value) => !value);
  }
}
