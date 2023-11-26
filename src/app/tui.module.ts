import { NgModule } from '@angular/core';
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER, TuiLoaderModule } from "@taiga-ui/core";
import { TuiButtonModule } from "@taiga-ui/core";
import { TuiInputModule, TuiInputPasswordModule, TuiCheckboxModule, TuiIslandModule, TuiInputDateModule, TuiMarkerIconModule, TuiSelectModule, TuiDataListWrapperModule, TuiInputNumberModule, TuiRadioLabeledModule, TuiInputDateRangeModule } from "@taiga-ui/kit";
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';

@NgModule({
  declarations: [],
  imports: [
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiButtonModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiCheckboxModule,
    TuiIslandModule,
    TuiLoaderModule,
    TuiInputDateModule,
    TuiMarkerIconModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiInputNumberModule,
    TuiRadioLabeledModule,
    TuiInputDateRangeModule
  ],
  exports: [
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiButtonModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiCheckboxModule,
    TuiIslandModule,
    TuiLoaderModule,
    TuiInputDateModule,
    TuiMarkerIconModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiInputNumberModule,
    TuiRadioLabeledModule,
    TuiInputDateRangeModule
  ],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }]
})
export class TuiModule {}
