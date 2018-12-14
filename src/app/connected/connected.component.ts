import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../shared/service/web-socket-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connected',
  templateUrl: './connected.component.html',
  styleUrls: ['./connected.component.css']
})
export class ConnectedComponent implements OnInit {
  uiState: String = 'login';

  constructor(private wsService: WebSocketService, private router: Router) {}

  ngOnInit() {
  }
  get showLoginComponent() {
    return this.uiState === 'login';
  }
  get showRegisterComponent() {
    return this.uiState === 'register';
  }
  disconnect = () => {
    // this.wsService.observable.
    this.wsService.disconnect();
    this.router.navigateByUrl('');
    // this.unsubscribe(this.subscription);
    // this.unsubscribe(this.subscription2);
  }
  chooseLogin = () => {
    this.uiState = 'login';
  }
  chooseRegister = () => {
    this.uiState = 'register';
  }
}
