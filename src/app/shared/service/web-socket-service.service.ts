import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReqPakcet} from '../model/packet/ReqPacket';
import { RespPacket } from '../model/packet/RespPakcet';
import { IPacket } from '../model/packet/IPacket';
import { PacketId } from '../model/packet/PacketId';
import { load, Root } from 'protobufjs';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  ws: WebSocket;

  constructor(
    private packetId: PacketId
  ) {
  }

  // 返回一个可观测的流，包括服务器返回的消息
  createObservableSocket(url: string): Observable<RespPacket> {
    this.ws = new WebSocket(url);
    this.ws.binaryType = 'arraybuffer';
    return new Observable(
      observer => {
        this.ws.onmessage = (event) => {
          // 把event.data转化为RespPacket
          observer.next(event.data);
        };
        this.ws.onerror = (event) => observer.error(event);
        this.ws.onclose = (event) => observer.complete();
      });
  }
  // 向服务器端发送消息
  sendMessage<T extends IPacket>(message: T): void {
    // TODO 把message转换为ReqPacket
    // 获取请求包packetId
    const id = PacketId.class2PacketId.get((message as IPacket).getClassName());
    // 拿到protobufjs生成的字节数组，封装成ReqPakcet
    const myroot = new Root();
    load(`src/assets/proto/${(message as IPacket).getClassName()}.proto`, myroot , (err, root) => {
      if (err) {
        throw err;
      }

      // example code
      const proxy = root.lookupType('LoginAuthReq');

      const result = proxy.create(message);
      console.log(`message = ${JSON.stringify(result)}`);

      const buffer = proxy.encode(message).finish();
      console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);

      const decoded = proxy.decode(buffer);
      console.log(`decoded = ${JSON.stringify(decoded)}`);
      const reqPacket = ReqPakcet.valueOf(id, buffer);
      this.ws.send(reqPacket.getBuffer());
    });
  }

}
