import { NgModule } from '@angular/core';
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER, TuiLoaderModule } from "@taiga-ui/core";
import { TuiButtonModule } from "@taiga-ui/core";
import { TuiInputModule, TuiInputPasswordModule, TuiCheckboxModule, TuiIslandModule, TuiInputDateModule, TuiCarouselModule } from "@taiga-ui/kit";
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
    TuiCarouselModule
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
    TuiCarouselModule
  ],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }]
})
export class TuiModule {}
