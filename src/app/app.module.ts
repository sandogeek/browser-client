import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { WebSocketComponent } from './web-socket/web-socket.component';
import { WebSocketSubjectComponent } from './web-socket-subject/web-socket-subject.component';

@NgModule({
  declarations: [
    AppComponent,
    WebSocketComponent,
    WebSocketSubjectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
