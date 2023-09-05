import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  effect,
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
export class DialogComponent implements OnInit {
  @Input({ required: false }) isVisible = false;
  @Input({ required: false }) fullScreen = true;
  @Output() onModalClose = new EventEmitter<boolean>();

  // @ViewChild("dialogRef", { static: true })
  // dialog: ElementRef<HTMLDialogElement> | undefined;

  constructor() {
    console.log("dialog component", this.isVisible);
  }
  ngOnInit(): void {
    console.log("dialog component - OnInit", this.isVisible);
  }

  openDialog() {
    // this.isVisible = true;
  }

  closeDialog() {
    this.onModalClose.emit(false);
    this.isVisible = false;
  }
}
