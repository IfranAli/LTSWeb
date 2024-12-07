import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  effect,
  input,
  output,
  viewChild,
  model,
} from "@angular/core";

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  imports: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  isVisible = model(false);
  readonly fullScreen = input(false);
  readonly hideCloseButton = input(false);
  readonly onModalClose = output<boolean>();

  readonly dialogElement =
    viewChild<ElementRef<HTMLDialogElement>>("dialogRef");

  @HostListener("window:keydown.esc", ["$event"])
  handleKeyDown(event: KeyboardEvent) {
    if (this.isVisible()) {
      this.closeDialog();
    }
  }

  onStateUpdate = effect(() => {
    const dialog = this.dialogElement()?.nativeElement;

    if (dialog) {
      const state = this.isVisible();

      if (state) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  });

  public closeDialog = () => {
    this.isVisible.set(false);
    this.onModalClose.emit(true);
  };
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: "",
})
export class DialogBaseComponent {
  readonly openModal = input(false);
  readonly fullScreen = input(true);
  readonly onModalClose = output<boolean>();
}
