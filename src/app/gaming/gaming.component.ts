import { Component, OnInit } from '@angular/core';
import { WebSocketService, CustomMessage } from '../shared/service/web-socket-service.service';
import { PartialObserver } from 'rxjs';
import {  EnterWorldReq, RoleUiInfoResp, ObjectDisappearResp } from '../shared/model/proto/bundle';
import { Role } from '../choose-role/model/Role';

@Component({
  selector: 'app-gaming',
  templateUrl: './gaming.component.html',
  styleUrls: ['./gaming.component.css']
})
export class GamingComponent implements OnInit {
  roles: Array<Role> = new Array();
  currentSceneName: string;

  sceneUiInfoObserver: PartialObserver<CustomMessage> = {
    next : message => {
      // console.log(`${JSON.stringify(message.resp)}`);
      if (message.clazz === RoleUiInfoResp) {
        const roleUiInfoResp = <RoleUiInfoResp>message.resp;
        const role = new Role();
        role.roleId = roleUiInfoResp.roleId;
        role.name = roleUiInfoResp.name;
        role.level = roleUiInfoResp.level;
        role.roleType = roleUiInfoResp.roleType;
        this.roles = [ ...this.roles, role];
      }
    },
    error: err => console.log(err),
    complete: () => {
    }
  };
  objectDisappearObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === ObjectDisappearResp) {
        const objectDisappearResp = <ObjectDisappearResp>message.resp;
        this.roles = this.roles.filter(role => role.roleId !== objectDisappearResp.id);
      }
    }
  };
  constructor(
    private wsService: WebSocketService,
  ) {
    this.wsService.observable.subscribe(this.sceneUiInfoObserver);
    this.wsService.observable.subscribe(this.objectDisappearObserver);
    wsService.sendPacket(EnterWorldReq, {});
  }

  ngOnInit() {
  }

}
