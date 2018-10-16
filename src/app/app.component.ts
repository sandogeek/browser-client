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
  title = 'browser-client';

  constructor(
    private websocketService:WebSocketService
    ) {
    
  }
  ngOnInit() {
    // 订阅了服务器发送过来的消息，并把消息打印在控制台上
    this.websocketService.createObservableSocket("ws://localhost:8088/")
    .subscribe(
      data => console.log(data),
      err => console.log(err),
      () => console.log("流已经结束")
    );
  }
}
