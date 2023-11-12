import { NgModule } from '@angular/core';
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER, TuiLoaderModule } from "@taiga-ui/core";
import { TuiButtonModule } from "@taiga-ui/core";
import { TuiInputModule, TuiInputPasswordModule, TuiCheckboxModule, TuiIslandModule, TuiInputDateModule, TuiCarouselModule, TuiMarkerIconModule, TuiSelectModule, TuiDataListWrapperModule, TuiInputNumberModule } from "@taiga-ui/kit";
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
    TuiCarouselModule,
    TuiMarkerIconModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiInputNumberModule
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
    TuiCarouselModule,
    TuiMarkerIconModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiInputNumberModule
  ],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }]
})
export class TuiModule {}
