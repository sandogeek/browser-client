import { Component, OnInit } from '@angular/core';
import { User, Message, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';
import { Observable, Subject, merge, from } from 'rxjs';
import { scan } from 'rxjs/operators/scan';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  public feed: Observable<Message[]>;
  messagePlaceholder: string = null;

  public readonly user: User = {
    id: 1
  };

  public readonly bot: User = {
    id: 0
  };

  private local: Subject<Message> = new Subject<Message>();


  constructor() {
    const hello: Message = {
      author: this.bot,
      suggestedActions: [{
        type: 'reply',
        value: 'Neat!'
      }, {
        type: 'reply',
        value: 'Thanks, but this is boring.'
      }],
      timestamp: new Date(),
      text: 'Hello, this is a demo bot. I don\t do much, but I can count symbols!'
    };

    // Merge local and remote messages into a single stream
    this.feed = merge(
      from([ hello ]),
      this.local
    ).pipe(
      // ... and emit an array of all messages
      scan((acc, x) => [...acc, x], [])
    );
   }

  ngOnInit() {
  }

  public sendMessage(e: SendMessageEvent): void {
    this.local.next(e.message);
  }

}
