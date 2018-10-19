import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { WsPacket} from '../model/packet/ReqPacket';
// import { RespPacket } from '../model/packet/RespPakcet';
import { AbstractPacket } from '../model/packet/AbstractPacket';
import { PacketId } from '../model/packet/PacketId';
import { load, Root, Writer, Type } from 'protobufjs';
import { LoginAuthReq } from '../model/proto/bundle';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  static ws: WebSocket;
  static observable: Observable<any>;
  // 缓存.proto的代理对象
  private myroot = new Root();

  

  constructor() {
  }

  // 返回一个可观测的流，包括服务器返回的消息
  createObservableSocket(url: string): Observable<any> {
    WebSocketService.ws = new WebSocket(url);
    WebSocketService.ws.binaryType = 'arraybuffer';
    return new Observable<any>(
      (observer) => {
        WebSocketService.ws.onopen = (event) => {
          // console.log(WebSocketService.ws);
          observer.next('连接到服务器成功');
        };
        WebSocketService.ws.onmessage = (event) => {
          // 把event.data转化为RespPacket
          observer.next(event.data);
        };
        WebSocketService.ws.onerror = (event) => observer.error(event);
        WebSocketService.ws.onclose = (event) => observer.complete();
        return {unsubscribe(){
          console.log("unsubscribe");
        }};
      }
    );
  }
  // 向服务器端发送消息
  sendPacket(messageClass: any, obj: any): void {
    // TODO 把message转换为ReqPacket
    // 获取请求包packetId
    const id = PacketId.class2PacketId.get(messageClass.name);
    // 参数校验
    if (messageClass.verify(obj) != null) {
      console.log(`传入参数${JSON.stringify(obj)}异常,必备字段不完整或不是${messageClass.name}对象`);
      return;
    }
    console.log(`发送请求包：packetId[${id}] 类名[${messageClass.name}] 内容\n${JSON.stringify(obj)}`);
    const messageUint8Array = messageClass.encode(obj).finish();
    // console.log(`messageUint8Array = ${Array.prototype.toString.call(messageUint8Array)}`);
    const reqPacket = WsPacket.valueOf(id, messageUint8Array);
    const sendData = reqPacket.getBuffer();
    console.log(`实际发送的数据：${Array.prototype.map.call(new Uint8Array(sendData), x => x.toString(10)).join(',')}`);
    WebSocketService.ws.send(sendData);
  }
}
