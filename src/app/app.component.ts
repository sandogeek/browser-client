import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { Observable, Observer } from 'rxjs';
import { WebSocketService } from './shared/service/web-socket-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = '长生界';

  constructor(
    private websocketService: WebSocketService
    ) {

  }
  ngOnInit() {
  }
}
