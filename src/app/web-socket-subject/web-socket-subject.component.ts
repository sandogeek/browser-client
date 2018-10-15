import { Component, OnInit } from '@angular/core';
import { WebSocketSubjectServiceService } from '../shared/service/web-socket-subject-service.service';

export class Message {
  constructor(
    public packetID: number,
    public content: string,
  ) { }
}
@Component({
  selector: 'app-web-socket-subject',
  templateUrl: './web-socket-subject.component.html',
  styleUrls: ['./web-socket-subject.component.css']
})
export class WebSocketSubjectComponent implements OnInit {
  clientMessage: string;

  constructor(private  webSocketSubjectServiceService: WebSocketSubjectServiceService) { }

  ngOnInit() {
    this.webSocketSubjectServiceService.createObservableSocket('ws://localhost:8088/').subscribe(
        (message) => console.log("subscribe:"+JSON.stringify(message,null,4)),
        (err) => {
          console.log("来自subscribe");
          console.error(err);
        },
        () => console.warn('Completed!')
    );
  }

  send(){
    const message = new Message(10001, this.clientMessage);
    // this.clientMessage = '';
    this.webSocketSubjectServiceService.send(message);
  }

}
