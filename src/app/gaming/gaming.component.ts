import { Component, OnInit } from '@angular/core';
import { WebSocketService, CustomMessage } from '../shared/service/web-socket-service.service';
import { PartialObserver } from 'rxjs';
import {  EnterWorldReq, RoleUiInfoResp,
  ObjectDisappearResp, SceneUiInfoResp, ISceneCanGoInfo, SwitchSceneReq } from '../shared/model/proto/bundle';
import { Role } from '../choose-role/model/Role';
import { RoleService } from '../shared/service/role.service';

@Component({
  selector: 'app-gaming',
  templateUrl: './gaming.component.html',
  styleUrls: ['./gaming.component.css']
})
export class GamingComponent implements OnInit {
  roles: Array<Role> = new Array();
  sceneCanGoInfos: Array<ISceneCanGoInfo> = new Array();
  currentSceneName: string;
  sceneSwitchFlag = false;
  selfInfo = [
    `昵称：${this.myName}`,
    `角色类型：${this.myRoleTypeName}`,
    `等级：${this.myLevel}`,
    `血量：${this.myCurrentHp}/${this.myMaxHp}`,
    `蓝量：${this.myCurrentMp}/${this.myMaxMp}`
  ];

  infoObserver: PartialObserver<CustomMessage> = {
    next : message => {
      // console.log(`${JSON.stringify(message.resp)}`);
      if (message.clazz === RoleUiInfoResp) {
        const roleUiInfoResp = <RoleUiInfoResp>message.resp;
        const role: Role = {...roleUiInfoResp, roleTypeName: null};
        this.roles = [ ...this.roles, role];
      } else if (message.clazz === SceneUiInfoResp) {
        const sceneUiInfo = <SceneUiInfoResp>message.resp;
        this.currentSceneName = sceneUiInfo.sceneName;
        this.sceneCanGoInfos = sceneUiInfo.sceneCanGoInfos;
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
    private roleService: RoleService,
  ) {
    this.wsService.observable.subscribe(this.infoObserver);
    this.wsService.observable.subscribe(this.objectDisappearObserver);
    wsService.sendPacket(EnterWorldReq, {});
  }

  switchTo = (sceneId: number) => {
    this.roles = new Array();
    this.wsService.sendPacket(SwitchSceneReq, {targetSceneId: sceneId});
  }

  ngOnInit() {
  }
  get myName() {
    return this.roleService.selectedRole.name;
  }
  get myLevel() {
    return this.roleService.selectedRole.level;
  }
  get myRoleTypeName() {
    return this.roleService.selectedRole.roleTypeName;
  }
  get myCurrentHp() {
    return this.roleService.selectedRole.currentHp;
  }
  get myMaxHp() {
    return this.roleService.selectedRole.maxHp;
  }
  get myCurrentMp() {
    return this.roleService.selectedRole.currentMp;
  }
  get myMaxMp() {
    return this.roleService.selectedRole.maxMp;
  }
}
