import {
  Component,
  ComponentRef,
  effect,
  ElementRef,
  inject,
  model,
  Signal,
  signal,
  viewChild,
} from "@angular/core";
import { DialogTestService } from "../services/dialog-test.service";
import { DialogBaseComponent } from "../../../dialog/dialog.component";

@Component({
  selector: "app-dev-dialog",
  imports: [],
  template: `
    <dialog #dialogRef>
      <button autofocus (click)="modalState.set(false)">Close</button>

      <div class="container mx-auto p-4">
        <header class="header-actions">
          <h1 class="text-2xl font-bold">Developer Dialog</h1>
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Action
          </button>
        </header>

        <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <ng-content select="[slot=content" />
        </main>

        <footer class="mt-8">
          <p class="text-center text-gray-600">Developer Dialog Page</p>
        </footer>
      </div>
    </dialog>
  `,
  styles: ``,
})
export class DevDialogComponent {
  modalState = model(false);
  dialogElement = viewChild<ElementRef<HTMLDialogElement>>("dialogRef");

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
  selector: "app-dialog-wrapper",
  imports: [],
  providers: [DialogTestService],
  template: ``,
  styles: ``,
})
export class DialogWrapper {
  dialogService = inject(DialogTestService);
  dialogState = model(false);
  componentRef = signal<ComponentRef<DevDialogComponent> | null>(null);
  

  ngAfterViewInit() {
    const containerRef = this.dialogService.rootContainerRef();

    if (containerRef) {
      const created = containerRef.createComponent(DevDialogComponent);
      created.instance.modalState = this.dialogState;
      this.componentRef.set(created);
    }
  }
}

@Component({
  selector: "app-dev-test",
  imports: [DialogWrapper, DialogBaseComponent],
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
export class DevTestComponent {
  showModal = signal(false);

  userToggleModal() {
    console.debug("Toggling modal visibility.");
    this.showModal.update((value) => !value);
  }
}
