import { Component, OnInit } from '@angular/core';
import { WebSocketService, CustomMessage, GameState } from '../shared/service/web-socket-service.service';
import { PartialObserver, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})
export class ConnectComponent implements OnInit {
  address: string;
  // 1 连接成功 2 初始状态断开 3显示重连提示
  connected: boolean;
  port: number;
  subdir: string;
  // 提示语
  // hint: string;
  subscription: Subscription;

  observer: PartialObserver<CustomMessage>;

  constructor(
    private wsService: WebSocketService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.address = 'localhost';
    this.port = 8090;
    this.subdir = '';
    // this.connected = wsService.conneted;
    // if (this.connected) {
    //   router.navigate(['./connected'], {relativeTo: this.route});
    // }
  }

  ngOnInit() {
  }
  connect = () => {
    this.wsService.createObservableSocket(`ws://${this.address}:${this.port}/${this.subdir}`);
    this.observer = {
      next : message => {
        if ((message.resp as string) && this.wsService.state === GameState.CONNECTED ) {
          this.router.navigate(['./connected'], { relativeTo: this.route });
          return;
        }
        // console.log(`login组件接收内容：packetId[${message.packetId}] 类名[${message.clazz.name}] 内容\n${JSON.stringify(message.resp)}`);
      },
      error: err => console.log(err),
      complete: () => {
        // this.state = 3;
        // this.hint = '服务器已关闭此channel,请重新连接';
        // console.log(this.hint);
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
    // this.subscription2 = this.wsService.observable.subscribe(this.observer2);
  }
}
