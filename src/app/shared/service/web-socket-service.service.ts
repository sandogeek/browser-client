import { Injectable, Type } from '@angular/core';
import { Observable, Subscriber, Subject, ConnectableObservable } from 'rxjs';
import { WsPacket } from '../model/packet/WsPacket';
import { PacketId } from '../model/packet/PacketId';
import { PingHeartBeat, PongHeartBeat } from '../model/proto/bundle';
import { IPacket } from '../model/proto/IPacket';

// export class MyUnsubscribable implements Unsubscribable {
//   outer: WebSocketService;
//   unsubscribe: () => void;
// }
export class CustomMessage {
  packetId: number;
  clazz: IPacket;
  resp: any;
}
export enum GameState {
  /**
   * 未连接
   */
  UNCONNECTED,
  /**
   * 已连接
   */
  CONNECTED,
  /**
   * 已登陆但还没进入游戏（正在选择角色）
   */
  LOGINED,
  /**
   * 游戏中
   */
  GAMING
}
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  ws: WebSocket;
  observable: Observable<CustomMessage>;
  state: GameState = GameState.UNCONNECTED;
  selectedRoleName: string;
  private timer: NodeJS.Timer;

  // subscribers: Array<Subscriber<any>> = [];
  // myUnsubscribables: Array<MyUnsubscribable> = [];
  constructor() {
  }

  // 连接服务器，初始化一个可观察者（消息源）
  createObservableSocket = (url: string) => {
    if (this.state === GameState.UNCONNECTED) {
      // 连接服务器
      this.ws = new WebSocket(url);
      // 设定发送的数据为二进制数据
      this.ws.binaryType = 'arraybuffer';
      const subject = new Subject<CustomMessage>();
      const connectObservable = new ConnectableObservable<CustomMessage>(new Observable(this.onSubscribe), () => {
        return subject;
      });
      this.observable = connectObservable.refCount();
    }
  }
  // 当this.observable被.subscribe(x)调用,subscriber = x
  onSubscribe = (subscriber: Subscriber<CustomMessage>) => {
    // 添加观察者，因为使用的是循环subscribers,调用每个next，所以他们是同步的，如果前一个next发生耗时操作，会导致
    // 后一个订阅者无法及时接收到消息，可能导致问题，最好让每个观察者中的next error complete变成异步执行

    // Websocket生命周期回调函数只绑定一次就够了
    if (this.state === GameState.UNCONNECTED) {
      this.bindWsLifecircle(subscriber);
    }
    // const myUnsubscribable = new MyUnsubscribable();
    // myUnsubscribable.outer = this;
    // // 同时需要外部的this,以及调用这个函数的this怎么解决
    // // 把外部的this当作对象的属性传进去
    // myUnsubscribable.unsubscribe = function(this: MyUnsubscribable) {
    //   // console.log(this);
    //   // 移除对应的MyUnsubscribable
    //   const index = this.outer.myUnsubscribables.indexOf(this);
    //   // console.log(index);
    //   // console.log(this.outer.myUnsubscribables);
    //   if (index > -1) {
    //     this.outer.myUnsubscribables.splice(index, 1);
    //   }
    //   // console.log(this.outer.myUnsubscribables);
    // };
    // this.myUnsubscribables.push(myUnsubscribable);
    return {
      unsubscribe : () => {
        console.log(`取消订阅`);
      }
    };
  }
  /**
   * 绑定websocket生命周期回调函数
   */
  private bindWsLifecircle = (subscriber: Subscriber<CustomMessage>) => {
    this.ws.onopen = (event) => {
      // console.log(`进来了`);
      this.state = GameState.CONNECTED;
      // 此处会触发x.next回调函数
      subscriber.next({
        packetId : 0,
        clazz : null,
        resp : '连接到服务器成功'
      });
      // this.subscribers.forEach((value, index, subscribers) => {
      //     value.next('连接到服务器成功');
      // });
    };
    // 接收响应消息时回调
    this.ws.onmessage = (event) => {
      // 查看收发数据是否一致
      // console.log(`实际接收的数据：${Array.prototype.map.call(new Uint8Array(event.data), x => x.toString(10)).join(',')}`);
      // 把event.data转化为相应的类对象
      if (event.data as ArrayBuffer) {
        this.decodeWebSocketBinaryFrameAndNext(subscriber, event);
      }
    };
    this.ws.onerror = (event) => subscriber.error(event);
    this.ws.onclose = (event) => {
      this.state = GameState.UNCONNECTED;
      if (this.timer !== undefined) {
        clearTimeout(this.timer);
      }
      subscriber.complete();
    };
  }
  /**
   * 解码服务器发过来的WebSocketBinaryFrame
   */
  private decodeWebSocketBinaryFrameAndNext = (subscriber: Subscriber<CustomMessage>, event: MessageEvent) => {
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
    if (messageClass === undefined) {
      console.error(`PacketId中不存在id为${packetId}的包`);
    }
    const obj = messageClass.decode(data);
    // console.log(`接收到的包：packetId[${packetId}] 类名[${messageClass.name}] 内容\n${JSON.stringify(obj)}`);
    // this.subscribers.forEach((value, index, subscribers) => {
    const nextData = {
      packetId: packetId,
      clazz : messageClass,
      resp: obj
    };
    subscriber.next(nextData);
    // });
  }
  // 正常地断开与服务器的连接
  disconnect = () => {
    if (this.state === GameState.CONNECTED) {
      this.ws.close(1000, '溜了溜了，下线');
    }
  }
  // 向服务器端发送消息
  sendPacket = (messageClass: IPacket, obj: any): void => {
    // if (messageClass !== PingHeartBeat) {
    //   this.resetTimeout();
    // }
    // 获取请求包packetId
    const id = PacketId.class2PacketId.get(messageClass);
    // 参数校验
    if (messageClass.verify(obj) !== null) {
      console.log(`传入参数${JSON.stringify(obj)}异常,必备字段不完整或不是${messageClass.name}对象`);
      return;
    }
    if (messageClass.name !== 'PingHeartBeat') {
      console.log(`发送请求包：packetId[${id}] 类名[${messageClass.name}] 内容\n${JSON.stringify(obj)}`);
    }
    const messageUint8Array = messageClass.encode(obj).finish();
    // console.log(`messageUint8Array = ${Array.prototype.toString.call(messageUint8Array)}`);
    const reqPacket = WsPacket.valueOf(id, messageUint8Array);
    const sendData = reqPacket.getBuffer();
    // console.log(`实际发送的数据：${Array.prototype.map.call(new Uint8Array(sendData), x => x.toString(10)).join(',')}`);
    this.ws.send(sendData);
  }
  private resetTimeout = () => {
    // 每次发普通包，重置发送ping包时间。
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }
    this.timeoutLoop();
  }
  private timeoutLoop() {
    this.timer = setTimeout(() => {
      this.sendPacket(PingHeartBeat, {});
      this.timeoutLoop();
    }, 25000);
  }
}
