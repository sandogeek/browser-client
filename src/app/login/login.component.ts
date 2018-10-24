import { Component, OnInit } from '@angular/core';
import { WebSocketService, CustomMessage } from '../shared/service/web-socket-service.service';
import { stringify } from '@angular/core/src/util';
import { LoginAuthReq } from '../shared/model/proto/bundle';
import { Subscription, NextObserver, PartialObserver } from 'rxjs';


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
    this.observer2 = {
      next : message => {
        if ((message.resp as string) && this.state !== 1 ) {
          this.state = 1;
          this.hint = message.resp;
          return;
        }
        let user = new User("sando",1);
        user.changeName(null);
        console.log(`观察者二号接收到消息`);
      },
      error: err => console.log(err),
      complete: () => {
        this.state = 3;
        this.hint = '服务器已关闭此channel,请重新连接';
        console.log(`观察者二号完成`);
      }
    };
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
    this.wsService.sendPacket(LoginAuthReq, {account: this.account, password: this.password});
    this.hint = undefined;
  }
}
// 定义一个私有 key
const requiredMetadataKey = Symbol("required")

// 定义参数装饰器，大概思路就是把要校验的参数索引保存到成员中
const required = function (target, propertyKey: string, parameterIndex: number) {
  // 参数装饰器只能拿到参数的索引
  if (!target[propertyKey][requiredMetadataKey]) {
    target[propertyKey][requiredMetadataKey] = {}
  } 
  // 把这个索引挂到属性上
  target[propertyKey][requiredMetadataKey][parameterIndex] = true
  // console.log(target[propertyKey]);
}
// 定义一个方法装饰器，从成员中获取要校验的参数进行校验
const validateEmptyStr = function (target, propertyKey: string, descriptor: PropertyDescriptor) {
  // 保存原来的方法
  let method = descriptor.value
  // 重写原来的方法
  descriptor.value = function () {
    let args = arguments
    // 看看成员里面有没有存的私有的对象
    console.log(method[requiredMetadataKey]);
    if (method[requiredMetadataKey]) {
      // 检查私有对象的 key
      Object.keys(method[requiredMetadataKey]).forEach(parameterIndex => {
        // 对应索引的参数进行校验
        console.log(args[parameterIndex]);
        if (!args[parameterIndex]) throw Error(`arguments${parameterIndex} is invalid`)
      })
    }
  }
}
class User {
  name: string
  id: number
  constructor(name:string, id: number) {
    this.name = name
    this.id = id
  }

  // 方法装饰器做校验
  @validateEmptyStr
  changeName (@required newName: string) { // 参数装饰器做描述
    this.name = newName
  }
}