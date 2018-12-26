import { Component, OnInit } from '@angular/core';

import { stringify } from '@angular/core/src/util';
import { Subscription, NextObserver, PartialObserver } from 'rxjs';
import { LoginFacade } from './facade/LoginFacade';
import { WebSocketService, GameState, CustomMessage } from 'src/app/shared/service/web-socket-service.service';
import { LoginAuthReq, LoginResultResp, LoginResultType } from 'src/app/shared/model/proto/bundle';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    account: [''],
    password: ['']
  });
  hide = true;

  constructor(
    private wsService: WebSocketService,
    private messageService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    const observer: PartialObserver<CustomMessage> = {
      next : message => {
        // console.log(`接收内容：packetId[${message.packetId}] 类名[${message.clazz.name}] 内容\n${JSON.stringify(message.resp)}`);
        if (message.clazz === LoginResultResp ) {
          if ((<LoginResultResp>message.resp).resultType === LoginResultType.SUCCESS) {
            this.wsService.state = GameState.LOGINED;
            // console.log(`接收内容：packetId[${message.packetId}] 类名[${message.clazz.name}] 内容\n${JSON.stringify(message.resp)}`);
            this.router.navigate(['/chooseRole']);
          } else {
            this.messageService.error('登陆失败，账号或密码错误');
            // this.password = '';
          }
        }
      },
      error: err => console.log(err),
      complete: () => {
      }
    };
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
    // if (this.account === undefined || this.account === '') {
    //   this.hint = '帐号不能为空';
    //   return;
    // } else if (this.password === undefined || this.password === '') {
    //   this.hint = '密码不能为空';
    //   return;
    // }
    this.wsService.sendPacket(LoginAuthReq, {account: this.loginForm.get('account').value, password: this.loginForm.get('password').value});
    // this.hint = undefined;
  }
}
