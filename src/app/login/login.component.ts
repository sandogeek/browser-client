import { Component, OnInit } from '@angular/core';
import { WebSocketService, CustomMessage } from '../shared/service/web-socket-service.service';
import { stringify } from '@angular/core/src/util';
import { LoginAuthReq } from '../shared/model/proto/bundle';
import { Subscription, NextObserver, PartialObserver } from 'rxjs';
import { LoginFacade } from './facade/LoginFacade';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  account: string;
  password: string;
  address: string;
  // 1 连接成功 2 初始状态断开 3显示重连提示
  state: number;
  // 提示语
  hint: string;
  port: number;
  subdir: string;
  subscription: Subscription;
  subscription2: Subscription;
  observer: PartialObserver<CustomMessage>;
  observer2: NextObserver<any>;

  constructor(
    private wsService: WebSocketService,
  ) {
    this.address = 'localhost';
    this.state = 2;
    this.port = 8088;
    this.subdir = '';
    // this.connected = this.wsService.conneted;
  }

  ngOnInit() {
  }
  connect = () => {
    this.wsService.createObservableSocket(`ws://${this.address}:${this.port}/${this.subdir}`);
    this.observer = {
      next : message => {
        if ((message.resp as string) && this.state !== 1 ) {
          this.state = 1;
          this.hint = message.resp;
          return;
        }
        console.log(`login组件接收内容：packetId[${message.packetId}] 类名[${message.clazz.name}] 内容\n${JSON.stringify(message.resp)}`);
      },
      error: err => console.log(err),
      complete: () => {
        this.state = 3;
        this.hint = '服务器已关闭此channel,请重新连接';
        console.log(this.hint);
      }
    };
    // this.observer2 = {
    //   next : message => {
    //     if ((message.resp as string) && this.state !== 1 ) {
    //       this.state = 1;
    //       this.hint = message.resp;
    //       return;
    //     }
    //     // console.log(`观察者二号接收到消息`);
    //   },
    //   error: err => console.log(err),
    //   complete: () => {
    //     this.state = 3;
    //     this.hint = '服务器已关闭此channel,请重新连接';
    //     console.log(`观察者二号完成`);
    //   }
    // };
    this.subscription = this.wsService.observable.subscribe(this.observer);
    this.subscription2 = this.wsService.observable.subscribe(this.observer2);
  }
  disconnect = () => {
    // this.wsService.observable.
    this.wsService.disconnect();
    // this.unsubscribe(this.subscription);
    // this.unsubscribe(this.subscription2);
  }

  // 移除观察者
  unsubscribe = (subscription: Subscription) => {
    if (subscription !== undefined) {
      subscription.unsubscribe();
    }
  }

  // 向服务端发送消息
  sendPacket = () => {
    if (this.account === undefined || this.account === '') {
      this.hint = '帐号不能为空';
      return;
    } else if (this.password === undefined || this.password === '') {
      this.hint = '密码不能为空';
      return;
    }
    // const loginAuthReq = LoginAuthReq.create();
    setInterval(this.wsService.sendPacket, 500, LoginAuthReq, {account: this.account, password: this.password});
    // while (1) {
    //   this.sleep(10000);
    //   this.wsService.sendPacket(LoginAuthReq, {account: this.account, password: this.password});
    // }
    // this.wsService.sendPacket(LoginAuthReq, {account: this.account, password: this.password});
    this.hint = undefined;
  }
  sleep(d) {
    for (const t = Date.now(); Date.now() - t <= d;) {
      console.log(t);
      return;
    }
  }
}
