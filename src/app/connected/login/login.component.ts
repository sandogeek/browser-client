import { Component, OnInit } from '@angular/core';

import { stringify } from '@angular/core/src/util';
import { Subscription, NextObserver, PartialObserver } from 'rxjs';
import { LoginFacade } from './facade/LoginFacade';
import { WebSocketService, GameState, CustomMessage } from 'src/app/shared/service/web-socket-service.service';
import { LoginAuthReq, LoginResultResp, LoginResultType } from 'src/app/shared/model/proto/bundle';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  account: string;
  password: string;
  // 提示语
  hint: string;

  constructor(
    private wsService: WebSocketService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const observer: PartialObserver<CustomMessage> = {
      next : message => {
        if (message.clazz === LoginResultResp ) {
          if ((<LoginResultResp>message.resp).resultType === LoginResultType.SUCESS) {
            this.wsService.state = GameState.LOGINED;
            // console.log(`接收内容：packetId[${message.packetId}] 类名[${message.clazz.name}] 内容\n${JSON.stringify(message.resp)}`);
            this.router.navigate(['/chooseRole']);
          } else {
            this.hint = '登陆失败，账号或密码错误';
            this.password = '';
          }
        }
      },
      error: err => console.log(err),
      complete: () => {
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
    this.wsService.observable.subscribe(observer);
  }

  ngOnInit() {
  }


  // 移除观察者
  // unsubscribe = (subscription: Subscription) => {
  //   if (subscription !== undefined) {
  //     subscription.unsubscribe();
  //   }
  // }

  // 向服务端发送消息
  login = () => {
    if (this.account === undefined || this.account === '') {
      this.hint = '帐号不能为空';
      return;
    } else if (this.password === undefined || this.password === '') {
      this.hint = '密码不能为空';
      return;
    }
    this.wsService.sendPacket(LoginAuthReq, {account: this.account, password: this.password});
    this.hint = undefined;
  }
}
