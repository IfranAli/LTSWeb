import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  effect,
  signal,
} from "@angular/core";

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"],
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DialogComponent implements OnChanges {
  @Input({ required: false }) isVisible = false;
  @Input({ required: false }) fullScreen = false;
  @Output() onModalClose = new EventEmitter<boolean>();

  @ViewChild("dialogRef", { static: true })
  dialogElement?: ElementRef<HTMLDialogElement>;

  $showDialog = signal(false);
  $isClosing = signal(false);

  private setHtmlDialog = (show: boolean) => {
    const e = this.dialogElement?.nativeElement ?? null;

    if (show) {
      this.fullScreen ? e?.showModal() : e?.show();
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
  @Input({ required: false }) openModal = false;
  @Input({ required: false }) fullScreen = true;
  @Output() onModalClose = new EventEmitter<boolean>();
  
  public closeDialog() {
   this.openModal = false;; 
  }
}
