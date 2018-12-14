import { Component, OnInit } from '@angular/core';
import { WebSocketService, CustomMessage } from 'src/app/shared/service/web-socket-service.service';
import { RegisterReq, RegisterResp } from 'src/app/shared/model/proto/bundle';
import { PartialObserver } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  account: string;
  passwordFirst: string;
  passwordSecond: string;
  // 提示语
  hint: string;

  constructor(
    private wsService: WebSocketService,
  ) {
    const observer: PartialObserver<CustomMessage> = {
      next : message => {
        if (message.clazz === RegisterResp) {
          if ((<RegisterResp>message.resp).isSuccess) {
            this.hint = '注册成功';
          } else {
            this.hint = '注册失败';
          }
          // console.log(`内容：packetId[${message.packetId}] 类名[${message.clazz.name}] 内容\n${JSON.stringify(message.resp)}`);
        }

      },
      error: err => console.log(err),
      complete: () => {
        // this.state = 3;
        // this.hint = '服务器已关闭此channel,请重新连接';
        // console.log(this.hint);
      }
    };
    this.wsService.observable.subscribe(observer);
   }

  ngOnInit() {
  }
  register = () => {
    if (this.account === undefined || this.account === '') {
      this.hint = '帐号不能为空';
      return;
    } else if (this.passwordFirst === undefined || this.passwordFirst === '') {
      this.hint = '首次输入密码不能为空';
      return;
    } else if (this.passwordSecond === undefined || this.passwordSecond === '') {
      this.hint = '第二次输入密码不能为空';
      return;
    } else if (this.passwordFirst !== this.passwordSecond) {
      this.hint = '两次输入的密码不一致，请重新输入';
      this.passwordFirst = '';
      this.passwordSecond = '';
      return;
    }
    this.wsService.sendPacket(RegisterReq, {account: this.account, password: this.passwordFirst});
  }
}
