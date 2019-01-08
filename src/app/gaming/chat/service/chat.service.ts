import { Injectable } from '@angular/core';
import { Subject, merge, from, PartialObserver } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Message } from '@progress/kendo-angular-conversational-ui';
import { WebSocketService, CustomMessage } from 'src/app/shared/service/web-socket-service.service';
import { ChatMessage } from 'src/app/shared/model/proto/bundle';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private local: Subject<Message> = new Subject<Message>();
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
          timestamp: new Date(),
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

  getFeed = () => {
    // return this.worldFeed;
    return merge(
      from(this.worldMessage),
      this.local
    ).pipe(
      // ... and emit an array of all messages
      scan((acc, x) => {
        // console.log(`${this.worldMessage.length}`);
        return [...acc, x];
      }, [])
    );
  }

  // get worldMessages() {
  //   return this.worldMessage;
  // }

  next = (message: Message) => {
    this.local.next(message);
  }
}
