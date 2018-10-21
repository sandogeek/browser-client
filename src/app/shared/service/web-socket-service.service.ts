import { Injectable } from '@angular/core';
import { Observable, Subscriber, Subscription, Unsubscribable } from 'rxjs';
import { WsPacket } from '../model/packet/WsPacket';
import { PacketId } from '../model/packet/PacketId';

export class MyUnsubscribable implements Unsubscribable {
  outer: WebSocketService;
  unsubscribe: () => void;
}
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  ws: WebSocket;
  observable: Observable<any>;
  conneted = false;

  subscribers: Array<Subscriber<any>> = [];
  myUnsubscribables: Array<MyUnsubscribable> = [];
  constructor() {
  }

  // 返回一个可观测的流，包括服务器返回的消息
  createObservableSocket = (url: string) => {
    if (this.conneted === false) {
      // 连接服务器
      this.ws = new WebSocket(url);
      this.ws.binaryType = 'arraybuffer';
      this.observable = new Observable<any>(this.onSubscribe);
    }
  }
  // 当this.observable被.subscribe(x)调用,subscriber = x
  onSubscribe = (subscriber: Subscriber<any>) => {
    this.subscribers.push(subscriber);
    // console.log(this.subscribers.length);
    // 只绑定一次就够了
    if (this.subscribers.length === 1) {
      this.ws.onopen = (event) => {
        // console.log(`进来了`);
        this.conneted = true;
        // 此处会触发x.next回调函数,由于每次.subscribe(x) x不相同，导致只有最后一个x.next回调函数被调用
        this.subscribers.forEach((value, index, subscribers) => {
            value.next('连接到服务器成功');
          // value.next('连接到服务器成功');
        });
      };
      // 接收响应消息时回调
      this.ws.onmessage = (event) => {
        // 查看收发数据是否一致
        console.log(`实际接收的数据：${Array.prototype.map.call(new Uint8Array(event.data), x => x.toString(10)).join(',')}`);
        // 把event.data转化为相应的类对象
        if (event.data as ArrayBuffer) {
          /**
           * 0-3 包长 4-5 packetId 6-最后 probuf编码的对象
           */
          const packetLength = (event.data as ArrayBuffer).byteLength;
          const dataView = new DataView(event.data);
          const packetId = dataView.getUint16(4);
          const data = new Uint8Array(event.data, 6);
          // 验证包长是否正确
          if ( packetLength !== dataView.getUint32(0) ) {
            console.error(`packetId[${packetId}]包长不对`);
            return;
          }
          const messageClass = PacketId.packetId2Class.get(packetId);
          const obj = messageClass.decode(data);
          console.log(`接收到的包：packetId[${packetId}] 类名[${messageClass.name}] 内容\n${JSON.stringify(obj)}`);
          this.subscribers.forEach((value, index, subscribers) => {
            value.next(obj);
            // value.next('连接到服务器成功');
          });
        }
      };
      this.ws.onerror = (event) => subscriber.error(event);
      this.ws.onclose = (event) => {
        this.conneted = false;
        subscriber.complete();
      };
    }
    const myUnsubscribable = new MyUnsubscribable();
    myUnsubscribable.outer = this;
    // 同时需要外部的this,以及调用这个函数的this怎么解决
    // 把外部的this当作对象的属性传进去
    myUnsubscribable.unsubscribe = function(this: MyUnsubscribable) {
      const index = this.outer.myUnsubscribables.indexOf(this);
      // console.log(index);
      // console.log(this.outer.myUnsubscribables);
      if (index > -1) {
        this.outer.myUnsubscribables.splice(index, 1);
      }
      // console.log(this.outer.myUnsubscribables);
      // console.log(this);
    };
    this.myUnsubscribables.push(myUnsubscribable);
    return myUnsubscribable;
  }
  // 断开与服务器的连接
  disconnect = () => {
    if (this.conneted === true) {
      this.ws.close(1000, '溜了溜了，下线');
    }
  }
  // 向服务器端发送消息
  sendPacket(messageClass: any, obj: any): void {
    // TODO 把message转换为ReqPacket
    // 获取请求包packetId
    const id = PacketId.class2PacketId.get(messageClass);
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
    this.ws.send(sendData);
  }
}
