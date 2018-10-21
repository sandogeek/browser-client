import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../shared/service/web-socket-service.service';
import { stringify } from '@angular/core/src/util';
import { LoginAuthReq } from '../shared/model/proto/bundle';
import { Subscription, NextObserver } from 'rxjs';

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
  observer: NextObserver<any>;
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
    // 订阅了服务器发送过来的消息，并把消息打印在控制台上
    this.wsService.createObservableSocket(`ws://${this.address}:${this.port}/${this.subdir}`);
    this.observer = {
      next : obj => {
        if ((obj as string) && this.state !== 1 ) {
          this.state = 1;
          this.hint = obj as string;
        }
        console.log(`来自观察者一号${JSON.stringify(obj)}`);
      },
      error: err => console.log(err),
      complete: () => {
        this.state = 3;
        this.hint = '服务器已关闭此channel,请重新连接';
        console.log(this.hint);
      }
    };
    this.observer2 = {
      next : obj => {
        if (obj as string) {
          this.state = 1;
          this.hint = obj as string;
        }
        console.log(`来自观察者二号${JSON.stringify(obj)}`);
      },
      error: err => console.log(err),
      complete: () => {
        this.state = 3;
        this.hint = '服务器已关闭此channel,请重新连接';
        console.log(this.hint);
      }
    };
    this.subscription = this.wsService.observable.subscribe(this.observer);
    this.subscription2 = this.wsService.observable.subscribe(this.observer2);
  }
  disconnect = () => {
    this.wsService.disconnect();
  }

  // 移除观察者
  unsubscribe = () => {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
  unsubscribe2 = () => {
    if (this.subscription !== undefined) {
      this.subscription2.unsubscribe();
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
    this.wsService.sendPacket(LoginAuthReq, {account: this.account, password: this.password});
    this.hint = undefined;
  }
}
