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
import { LoggerService } from './base/services/logger.service';
import { EditorComponent } from './shared/editor/editor.component';
import { DataGridComponent } from './shared/data-grid/data-grid.component';
import { RibbonComponent } from './shared/ribbon/ribbon.component';
import { TreeViewComponent } from './shared/tree-view/tree-view.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalComponent,
    FooterComponent,
    BackdropComponent,
    EditorComponent,
    DataGridComponent,
    RibbonComponent,
    TreeViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [SQLClientService, IpcService, LoggerService],
  bootstrap: [AppComponent]
})

export class AppModule {

}
