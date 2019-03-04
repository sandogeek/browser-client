import { Injectable } from '@angular/core';
import { CustomRole } from 'src/app/choose-role/model/Role';
import { PartialObserver } from 'rxjs';
import { CustomMessage, WebSocketService } from './web-socket-service.service';
import { CurrentHpUpdate, CurrentMpUpdate, MaxHpUpdate, MaxMpUpdate } from '../model/proto/bundle';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  selectedRole: CustomRole = new CustomRole();

  private currentHpUpdateObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === CurrentHpUpdate) {
        const resp = <CurrentHpUpdate>message.resp;
        if (this.selectedRole.roleId === undefined || resp.roleId === this.selectedRole.roleId) {
          this.selectedRole.currentHp = resp.currentHp;
        }
      }
    },
    error: err => console.log(err)
  };
  private currentMpUpdateObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === CurrentMpUpdate) {
        const resp = <CurrentMpUpdate>message.resp;
        if (this.selectedRole.roleId === undefined || resp.roleId === this.selectedRole.roleId) {
          this.selectedRole.currentMp = resp.currentMp;
        }
      }
    },
    error: err => console.log(err)
  };
  private maxHpUpdateObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === MaxHpUpdate) {
        const resp = <MaxHpUpdate>message.resp;
        if (this.selectedRole.roleId === undefined || resp.roleId === this.selectedRole.roleId) {
          this.selectedRole.maxHp = resp.maxHp;
        }
      }
    },
    error: err => console.log(err)
  };
  private maxMpUpdateObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === MaxMpUpdate) {
        const resp = <MaxMpUpdate>message.resp;
        if (this.selectedRole.roleId === undefined || resp.roleId === this.selectedRole.roleId) {
          this.selectedRole.maxMp = resp.maxMp;
        }
      }
    },
    error: err => console.log(err)
  };

  constructor(
    private wsService: WebSocketService,
  ) {
    this.wsService.observable.subscribe(this.currentHpUpdateObserver);
    this.wsService.observable.subscribe(this.currentMpUpdateObserver);
    this.wsService.observable.subscribe(this.maxHpUpdateObserver);
    this.wsService.observable.subscribe(this.maxMpUpdateObserver);
  }
}
