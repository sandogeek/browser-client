import { Injectable } from '@angular/core';
import { Subject, merge, from, PartialObserver } from 'rxjs';
import { scan, delay } from 'rxjs/operators';
import { WebSocketService, CustomMessage } from 'src/app/shared/service/web-socket-service.service';
import { ChatMessage } from 'src/app/shared/model/proto/bundle';
import { Message } from '../model/Message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSource$: Subject<Message> = new Subject<Message>();
  worldMessage: Message[] = new Array<Message>();
  // private worldFeed = merge(
  //   from(this.worldMessage),
  //   this.local
  // ).pipe(
  //   // ... and emit an array of all messages
  //   scan((acc, x) => {
  //     this.worldMessage = [...acc, x];
  //     console.log(`${this.worldMessage.length}`);
  //     return this.worldMessage;
  //   }, [])
  // );

  private chatMessageObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === ChatMessage) {
        const chatMessage = <ChatMessage>message.resp;
        const tempMessage: Message = {
          author: {id: chatMessage.sourceRoleId, name: chatMessage.name},
          text: chatMessage.content
        };
        if (chatMessage.channelId === 0 ) {
          this.worldMessage.push(tempMessage);
          this.next(tempMessage);
        }
      }
    },
    error: err => console.log(err)
  };

  constructor(
    private wsService: WebSocketService,
  ) {
    this.wsService.observable.subscribe(this.chatMessageObserver);
  }

  getMessagesSource = () => {
    // return this.worldFeed;
    return merge(
      from(this.worldMessage),
      this.messagesSource$
    ).pipe(
      delay(0),
      // ... and emit an array of all messages
      scan((acc, x) => {
        // console.log(`${this.worldMessage.length}`);
        return [...acc, x];
      }, [])
    );
    // const historyMessage = new Array<Message>();
    // historyMessage.push(...this.worldMessage);
    // this.messagesSource$.next(historyMessage);
    // return this.messagesSource$;
  }

  // get worldMessages() {
  //   return this.worldMessage;
  // }

  next = (message: Message) => {
    this.messagesSource$.next(message);
  }
}
