import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
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
export class ChatComponent implements AfterViewInit {
  public feed: Observable<{}>;
  public messages: Message[];
  messagePlaceholder: string = null;

  @ViewChild('chatDom')
  chatDom: ElementRef;

  public readonly user: User = {
    id: this.roleService.selectedRole.roleId,
    name: this.roleService.selectedRole.name
  };


  constructor(
    private wsService: WebSocketService,
    private roleService: RoleService,
    private chatService: ChatService,
    private elementRef: ElementRef
  ) {
    // Merge local and remote messages into a single stream
    // this.messages = this.chatService.worldMessages;
    this.feed = this.chatService.getFeed();
   }

   ngAfterViewInit() {
    const dom = this.elementRef.nativeElement.querySelector('.k-message-list');
    dom.scrollTop = Math.max(0, dom.scrollHeight - dom.offsetHeight);
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    const dom = this.elementRef.nativeElement.querySelector('.k-message-list');
    console.log(`${dom.scrollHeight}   ${dom.offsetHeight}`);
  }
  // subscription: Subscription;
  public sendMessage(e: SendMessageEvent): void {
    const subscription = this.wsService.observable.subscribe({
      next : message => {
        if (message.clazz === ChatResp) {
          const chatResp = <ChatResp>message.resp;
          if (chatResp.result) {
            this.chatService.next(e.message);
          }
          subscription.unsubscribe();
        }
      },
      error: err => console.log(err)
    });
    this.wsService.sendPacket(ChatReq, {targetId: 0, content: e.message.text});
  }

}
