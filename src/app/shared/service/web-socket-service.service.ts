import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WsPacket} from '../model/packet/ReqPacket';
// import { RespPacket } from '../model/packet/RespPakcet';
import { AbstractPacket } from '../model/packet/AbstractPacket';
import { PacketId } from '../model/packet/PacketId';
import { load, Root } from 'protobufjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws: WebSocket;
  private observable: Observable<any>;
  // 缓存.proto的代理对象
  private myroot = new Root();

    /**
     * Getter $ws
     * @return {WebSocket}
     */
  public get $ws(): WebSocket {
    return this.ws;
  }

    /**
     * Getter $observable
     * @return {Observable<any>}
     */
  public get $observable(): Observable<any> {
    return this.observable;
  }

    /**
     * Setter $ws
     * @param {WebSocket} value
     */
  public set $ws(value: WebSocket) {
    this.ws = value;
  }

    /**
     * Setter $observable
     * @param {Observable<any>} value
     */
  public set $observable(value: Observable<any>) {
    this.observable = value;
  }

  constructor() {
  }

  // 返回一个可观测的流，包括服务器返回的消息
  createObservableSocket(url: string): Observable<any> {
    this.ws = new WebSocket(url);
    this.ws.binaryType = 'arraybuffer';
    return new Observable(
      observer => {
        this.ws.onopen = (event) => observer.next('连接到服务器成功');
        this.ws.onmessage = (event) => {
          // 把event.data转化为RespPacket
          observer.next(event.data);
        };
        this.ws.onerror = (event) => observer.error(event);
        this.ws.onclose = (event) => observer.complete();
      });
  }
  // 向服务器端发送消息
  sendPacket<T extends AbstractPacket>(message: T): void {
    // TODO 把message转换为ReqPacket
    // 获取请求包packetId
    const id = message.getPacketId();
    const className = PacketId.packetId2Class.get(id);
    // 拿到protobufjs生成的字节数组，封装成ReqPakcet
    load(`src/assets/proto/${className}.proto`, this.myroot , (err, root) => {
      if (err) {
        throw err;
      }

      const proxy = root.lookupType(className);

      // const result = proxy.create(message);
      // console.log(`发送请求包：packetId[${id}] 类名[${className}] 内容\n${JSON.stringify(result)}`);

      const buffer = proxy.encode(message).finish();
      console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);

      // const decoded = proxy.decode(buffer);
      // console.log(`decoded = ${JSON.stringify(decoded)}`);
      const reqPacket = WsPacket.valueOf(id, buffer);
      // 实际发送的数据
      const sendData = reqPacket.getBuffer();
      console.log(`实际发送的数据：${Array.prototype.map.call(new Uint8Array(sendData), x => x.toString(10)).join(',')}`);
      this.ws.send(sendData);
    });
  }
}
