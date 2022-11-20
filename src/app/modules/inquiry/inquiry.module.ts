import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InquiryComponent } from './inquiry.component';
import { DataGridComponent } from 'src/app/viewAPI/data-grid/data-grid.component';
import { EditorComponent } from 'src/app/viewAPI/editor/editor.component';
import { RibbonComponent } from 'src/app/viewAPI/ribbon/ribbon.component';
import { WaitIndicatorComponent } from 'src/app/viewAPI/wait-indicator/wait-indicator.component';
import { ModalComponent } from 'src/app/viewAPI/modal/modal.component';
import GeneralPurposeRepository from 'base/generalPurposeRepository';
import { TabbedGroupComponent } from 'src/app/viewAPI/tabbed-group/tabbed-group.component';
import { ToolTipDirective } from 'src/app/core/directives/tool-tip.directive';

@NgModule({
  declarations: [
    InquiryComponent
  ],
  imports: [
    CommonModule,
    DataGridComponent,
    EditorComponent,
    RibbonComponent,
    WaitIndicatorComponent,
    ModalComponent,
    TabbedGroupComponent,
    ToolTipDirective
  ],
  providers: [
    GeneralPurposeRepository
  ]
})
export class InquiryModule {

}
