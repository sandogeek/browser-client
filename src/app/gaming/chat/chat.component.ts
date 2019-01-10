import { Component, OnInit, ElementRef, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { User, Message, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';
import { Observable, Subject, merge, from, Subscription } from 'rxjs';
import { scan } from 'rxjs/operators/scan';
import { map } from 'rxjs/operators';
import { WebSocketService } from 'src/app/shared/service/web-socket-service.service';
import { RoleService } from 'src/app/shared/service/role.service';
import { ChatResp, ChatReq } from 'src/app/shared/model/proto/bundle';
import { ChatService } from './service/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  // public source$: Subject<Message[]>;
  public source$: Observable<{}> = null;
  public messages: Message[];
  public currentMessagesArray: Message[];
  autoScroll = true;

  public readonly user: User = {
    id: this.roleService.selectedRole.roleId,
    name: this.roleService.selectedRole.name
  };


  constructor(
    private wsService: WebSocketService,
    private roleService: RoleService,
    private chatService: ChatService,
  ) {
    this.currentMessagesArray = this.chatService.worldMessage;
    this.source$ = this.chatService.getMessagesSource();
   }

  public sendMessage = (e: string): void => {
    if (e === '') {
      return;
    }
    const subscription = this.wsService.observable.subscribe({
      next : message => {
        if (message.clazz === ChatResp) {
          const chatResp = <ChatResp>message.resp;
          if (chatResp.result) {
            // this.messages = [...this.messages, e.message];
            const tempMessage: Message = {
              author: this.user,
              text: e,
              timestamp: new Date()
            };
            this.chatService.next(tempMessage);
            this.currentMessagesArray.push(tempMessage);
          }
          subscription.unsubscribe();
        }
      },
      error: err => console.log(err)
    });
    this.wsService.sendPacket(ChatReq, {targetId: 0, content: e});
  }

}
