import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { Observable, Observer } from 'rxjs';
import { WebSocketService } from './shared/service/web-socket-service.service';
import { PacketId } from './shared/model/packet/PacketId';
import { LoginFacade } from './login/facade/LoginFacade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = '长生界';

  constructor(
    private websocketService: WebSocketService,
    // facade单例生成
    private loginFacade: LoginFacade
    ) {
      // 初始化PacketId以完成PacketId中的map的初始化
      const packetId = new PacketId();
  }
  ngOnInit() {
  }
}
