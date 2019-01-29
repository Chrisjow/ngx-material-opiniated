import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OpiniatedTypeaheadModule, OpiniatedDisplayModule, OpiniatedInputsModule , OpiniatedGridModule, INotificationService, OpiniatedCommonModule } from 'projects/ngx-material-opiniated/src/public_api';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ContextMenuModule } from 'ngx-contextmenu';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    OpiniatedTypeaheadModule,
    OpiniatedDisplayModule,
    OpiniatedInputsModule,
    OpiniatedGridModule,
    OpiniatedCommonModule.forRoot(),
    HttpClientModule,
    MatCardModule
  ],
  providers: [INotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }