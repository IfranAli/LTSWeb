
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  effect,
  signal,
  input,
  output,
  viewChild
} from "@angular/core";

@Component({
    selector: "app-dialog",
    templateUrl: "./dialog.component.html",
    styleUrls: ["./dialog.component.scss"],
    imports: [],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnChanges {
  readonly isVisible = input(false);
  readonly fullScreen = input(false);
  readonly hideCloseButton = input(false);
  readonly onModalClose = output<boolean>();

  readonly dialogElement = viewChild<ElementRef<HTMLDialogElement>>("dialogRef");

  @HostListener("window:keydown.esc", ["$event"])
  handleKeyDown(event: KeyboardEvent) {
    if (this.isVisible()) {
      this.closeDialog();
    }
  }

  $showDialog = signal(false);
  $isClosing = signal(false);

  private setHtmlDialog = (show: boolean) => {
    const e = this.dialogElement()?.nativeElement ?? null;

    if (show) {
      this.fullScreen() ? e?.showModal() : e?.show();
    } else {
      e?.close();
    }
  };

  public closeDialog = () => {
    this.$isClosing.set(true);

    setTimeout(() => {
      this.$isClosing.set(false);
      this.$showDialog.set(false);
      this.setHtmlDialog(false);
      this.onModalClose.emit(true);
    }, 500);
  };

  constructor() {
    effect(() => {
      if (this.$showDialog()) {
        this.setHtmlDialog(true);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { isVisible } = changes;
    this.$showDialog.set(isVisible.currentValue);
  }
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
