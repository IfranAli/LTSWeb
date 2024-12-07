import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FinanceRoutingModule } from "./dev-test-routing.module";
import { DevTestComponent } from "./dev-test/dev-test.component";

@NgModule({
  declarations: [],
  imports: [CommonModule, FinanceRoutingModule, DevTestComponent],
})
export class DevTestModule {}
