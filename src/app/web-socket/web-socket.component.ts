import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../shared/service/web-socket-service.service';
import { IPacket } from '../shared/model/packet/IPacket';
import { LoginAuthReq } from '../bussiness/login/packet/LoginAuthReq';

@Component({
  selector: 'app-web-socket',
  templateUrl: './web-socket.component.html',
  styleUrls: ['./web-socket.component.css']
})
export class WebSocketComponent implements OnInit {
  clientMessage: string;

  constructor(
    private wsService: WebSocketService,
    private loginAuthReq:LoginAuthReq
    ) { }
  
  ngOnInit() {
  }

  // 向服务端发送消息
  sendPacket<T extends IPacket>(message:T):void {
    if (this.clientMessage===undefined){
      return;
    }
    this.loginAuthReq.$account="sando";
    this.loginAuthReq.$password="123456";
    this.wsService.sendMessage(this.loginAuthReq);
  }
}
