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
  private ws: WebSocket;
  private observable: Observable<RespPacket>;

    /**
     * Getter $ws
     * @return {WebSocket}
     */
  public get $ws(): WebSocket {
    return this.ws;
  }

    /**
     * Getter $observable
     * @return {Observable<RespPacket>}
     */
  public get $observable(): Observable<RespPacket> {
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
     * @param {Observable<RespPacket>} value
     */
  public set $observable(value: Observable<RespPacket>) {
    this.observable = value;
  }

  constructor(
    private packetId: PacketId
  ) {
    // 订阅了服务器发送过来的消息，并把消息打印在控制台上
    this.createObservableSocket('ws://localhost:8088/')
    .subscribe(
      data => console.log(data),
      err => console.log(err),
      () => console.log('流已经结束')
    );
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
  sendPacket<T extends IPacket>(message: T): void {
    // TODO 把message转换为ReqPacket
    // 获取请求包packetId
    const className = message.getClassName();
    const id = PacketId.class2PacketId.get(className);
    // 拿到protobufjs生成的字节数组，封装成ReqPakcet
    const myroot = new Root();
    load(`src/assets/proto/${className}.proto`, myroot , (err, root) => {
      if (err) {
        throw err;
      }

      // example code
      const proxy = root.lookupType(className);

      const result = proxy.create(message);
      console.log(`发送请求包：packetId[${id}] 类名[${className}] 内容\n${JSON.stringify(result)}`);

      const buffer = proxy.encode(message).finish();
      // console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);

      // const decoded = proxy.decode(buffer);
      // console.log(`decoded = ${JSON.stringify(decoded)}`);
      const reqPacket = ReqPakcet.valueOf(id, buffer);
      // 实际发送的数据
      const sendData = reqPacket.getBuffer();
      // console.log(`实际发送的数据：${Array.prototype.map.call(new Uint8Array(sendData), x => x.toString(10)).join(',')}`);
      this.ws.send(sendData);
    });
  }
}
