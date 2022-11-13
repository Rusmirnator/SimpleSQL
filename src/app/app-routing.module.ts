import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InquiryComponent } from './modules/inquiry/inquiry.component';
import { ModalComponent } from './viewAPI/modal/modal.component';

const routes: Routes = [
  { path: 'modal', component: ModalComponent },
  { path: 'inquiry', component: InquiryComponent }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
