import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InquiryComponent } from './inquiry.component';
import { DataGridComponent } from 'src/app/shared/data-grid/data-grid.component';
import { EditorComponent } from 'src/app/shared/editor/editor.component';
import { RibbonComponent } from 'src/app/shared/ribbon/ribbon.component';

@NgModule({
  declarations: [
    InquiryComponent
  ],
  imports: [
    CommonModule,
    DataGridComponent,
    EditorComponent,
    RibbonComponent
  ]
})
export class InquiryModule {

}
