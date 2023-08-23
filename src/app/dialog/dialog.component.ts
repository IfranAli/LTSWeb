import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  SimpleChange,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  signal,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";
import { tap } from "rxjs/internal/operators/tap";

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"],
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DialogComponent {
  @Input({ required: false }) isVisible = signal(false);
  @Input({ required: false }) fullScreen = signal(true);

  // @ViewChild("dialogRef", { static: true })
  // dialog: ElementRef<HTMLDialogElement> | undefined;

  closeDialog() {
    this.isVisible.set(false);
  }
}
