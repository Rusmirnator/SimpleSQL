import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './viewAPI/modal/modal.component';
import { IpcService } from './core/services/ipc.service';
import { LoggerService } from './core/services/logger.service';
import { SQLClientService } from './core/services/sqlclient.service';
import { WaitIndicatorComponent } from './viewAPI/wait-indicator/wait-indicator.component';
import { TreeViewComponent } from './viewAPI/tree-view/tree-view.component';
import { FooterComponent } from './viewAPI/footer/footer.component';
import { InquiryModule } from './modules/inquiry/inquiry.module';
import { GroupComponent } from './viewAPI/group/group.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    InquiryModule,
    ModalComponent,
    TreeViewComponent,
    FooterComponent,
    WaitIndicatorComponent
  ],
  providers: [SQLClientService, IpcService, LoggerService],
  bootstrap: [AppComponent]
})

export class AppModule {

}
