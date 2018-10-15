import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../shared/service/web-socket-service.service';

@Component({
  selector: 'app-web-socket',
  templateUrl: './web-socket.component.html',
  styleUrls: ['./web-socket.component.css']
})
export class WebSocketComponent implements OnInit {
  clientMessage: string;

  constructor(private wsService: WebSocketService) { }
  
  ngOnInit() {
    // 订阅了服务器发送过来的消息，并把消息打印在控制台上
    this.wsService.createObservableSocket("ws://localhost:8088/")
    .subscribe(
      data => console.log(data),
      err => console.log(err),
      () => console.log("流已经结束")
    );
  }

  // 向服务端发送消息
  send():void {
    if (this.clientMessage===undefined){
      return;
    }
    console.log("发送的内容："+this.clientMessage);
    this.wsService.sendMessage(this.clientMessage);
  }
}
