import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './shared/footer/footer.component';
import { EditorComponent } from './shared/editor/editor.component';
import { DataGridComponent } from './shared/data-grid/data-grid.component';
import { RibbonComponent } from './shared/ribbon/ribbon.component';
import { TreeViewComponent } from './shared/tree-view/tree-view.component';
import { ModalComponent } from './shared/modal/modal.component';
import { IpcService } from './core/services/ipc.service';
import { LoggerService } from './core/services/logger.service';
import { SQLClientService } from './core/services/sqlclient.service';
import { WaitIndicatorComponent } from './shared/wait-indicator/wait-indicator.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    EditorComponent,
    DataGridComponent,
    RibbonComponent,
    TreeViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ModalComponent,
    WaitIndicatorComponent
  ],
  providers: [SQLClientService, IpcService, LoggerService],
  bootstrap: [AppComponent]
})

export class AppModule {

}
