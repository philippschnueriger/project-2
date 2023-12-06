import { NgModule } from '@angular/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER, TuiLoaderModule, TuiDataListModule } from "@taiga-ui/core";
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
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiInputNumberModule,
    TuiRadioLabeledModule,
    TuiInputDateRangeModule,
    TuiLetModule
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
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiInputNumberModule,
    TuiRadioLabeledModule,
    TuiInputDateRangeModule,
    TuiLetModule
  ],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }]
})
export class TuiModule {}
