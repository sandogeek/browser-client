import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { WebSocketSubject } from 'rxjs/internal-compatibility';
import { Message } from '../../web-socket-subject/web-socket-subject.component';



@Injectable({
  providedIn: 'root'
})
export class WebSocketSubjectServiceService {

  private wsocket: WebSocketSubject<Message>;
  
  constructor() { }
  // 返回一个可观测的流，包括服务器返回的消息
  createObservableSocket(url: string): Observable<Message> {
    let destination: Observer<Message> = {
      next: (value: Message) => console.log(value),
      error: (err: any) => console.error(err),
      complete: () => console.warn('Completed!')
    };
    // this.wsocket = new WebSocketSubject('ws://localhost:8088/',destination);
    this.wsocket = new WebSocketSubject(url);

    return this.wsocket;
  }
  // 向服务器端发送消息
  public send(message: Message): void {
    this.wsocket.next(message);
  }
}
