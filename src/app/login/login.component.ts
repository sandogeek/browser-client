import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../shared/service/web-socket-service.service';
import { LoginAuthReq } from '../bussiness/login/packet/LoginAuthReq';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  account: string;
  password: string;

  constructor(
    private wsService: WebSocketService,
    private loginAuthReq: LoginAuthReq
  ) { }

  ngOnInit() {
  }

  // 向服务端发送消息
  sendPacket() {
    this.loginAuthReq.$account = this.account;
    this.loginAuthReq.$password = this.password;
    this.wsService.sendPacket(this.loginAuthReq);
  }
}
