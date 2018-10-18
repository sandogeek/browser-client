import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../shared/service/web-socket-service.service';
import { LoginAuthReq } from '../bussiness/login/packet/LoginAuthReq';
import { stringify } from '@angular/core/src/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  account: string;
  password: string;
  address: string;
  // 1 成功 2 初始状态断开 3显示重连提示
  state: number;
  hint: string;
  port: number;
  subdir: string;

  constructor(
    private wsService: WebSocketService,
  ) {
    this.address = 'localhost';
    this.state = 2;
    this.port = 8088;
    this.subdir = '';
  }

  ngOnInit() {
  }
  connect() {
    // 订阅了服务器发送过来的消息，并把消息打印在控制台上
    this.wsService.$observable = this.wsService.createObservableSocket(`ws://${this.address}:${this.port}/${this.subdir}`);
    this.wsService.$observable.subscribe(
      data => {
        if (data as string) {
          this.state = 1;
          this.hint = data as string;
        }
        console.log(data);
      },
      err => console.log(err),
      () => {
        this.state = 3;
        this.hint = '服务器已关闭此channel,请重新连接';
        console.log(this.hint);
      }
    );
  }

  // 向服务端发送消息
  sendPacket() {
    if (this.account === undefined || this.account === '') {
      this.hint = '帐号不能为空';
      return;
    } else if (this.password === undefined || this.password === '') {
      this.hint = '密码不能为空';
      return;
    }
    let loginAuthReq = new LoginAuthReq();
    loginAuthReq.$account = this.account;
    loginAuthReq.$password = this.password;
    this.wsService.sendPacket(loginAuthReq);
    this.hint = undefined;
  }
}
