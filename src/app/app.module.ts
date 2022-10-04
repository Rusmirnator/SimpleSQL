import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SQLClientService } from './base/services/sqlclient.service'
import { FormsModule } from '@angular/forms';
import { IpcService } from './base/services/ipc.service';
import { ModalComponent } from './shared/modal/modal.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BackdropComponent } from './shared/backdrop/backdrop.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalComponent,
    FooterComponent,
    BackdropComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [SQLClientService, IpcService],
  bootstrap: [AppComponent]
})

export class AppModule {

}
