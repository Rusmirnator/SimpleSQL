import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './shared/modal/modal.component';
import { IpcService } from './core/services/ipc.service';
import { LoggerService } from './core/services/logger.service';
import { SQLClientService } from './core/services/sqlclient.service';
import { WaitIndicatorComponent } from './shared/wait-indicator/wait-indicator.component';
import { TreeViewComponent } from './shared/tree-view/tree-view.component';
import { FooterComponent } from './shared/footer/footer.component';
import { InquiryModule } from './modules/inquiry/inquiry.module';

@NgModule({
  declarations: [
    AppComponent
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
