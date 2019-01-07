import { Component, OnInit, TemplateRef } from '@angular/core';
import { WebSocketService, CustomMessage } from '../shared/service/web-socket-service.service';
import { PartialObserver } from 'rxjs';
import {  EnterWorldReq, RoleUiInfoResp,
  ObjectDisappearResp, SceneUiInfoResp, ISceneCanGoInfo, SwitchSceneReq } from '../shared/model/proto/bundle';
import { Role } from '../choose-role/model/Role';
import { RoleService } from '../shared/service/role.service';
import { NzModalService } from 'ng-zorro-antd';
import { BackpackComponent } from './backpack/backpack.component';
import { EquipComponent } from './equip/equip.component';
import { ChatComponent } from './chat/chat.component';
import { MailComponent } from './mail/mail.component';
import { ShopComponent } from './shop/shop.component';

@Component({
  selector: 'app-gaming',
  templateUrl: './gaming.component.html',
  styleUrls: ['./gaming.component.css']
})
export class GamingComponent implements OnInit {
  roles: Array<Role> = new Array();
  sceneCanGoInfos: Array<ISceneCanGoInfo> = new Array();
  sceneId: number;
  currentSceneName: string;
  sceneSwitchFlag = false;

  isToggle = false;
  equipSelected = false;

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
        this.sceneId = sceneUiInfo.sceneId;
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
    },
    error: err => console.log(err)
  };
  constructor(
    private wsService: WebSocketService,
    private roleService: RoleService,
    private modalService: NzModalService
  ) {
    this.wsService.observable.subscribe(this.infoObserver);
    this.wsService.observable.subscribe(this.objectDisappearObserver);
    wsService.sendPacket(EnterWorldReq, {});
  }

  switchTo = (sceneId: number) => {
    this.roles = new Array();
    this.wsService.sendPacket(SwitchSceneReq, {targetSceneId: sceneId});
  }

  showBackpack = () => {
    const modal = this.modalService.create({
      nzTitle: '<i class="iconfont icon-beibao-xian"></i>背包',
      nzContent: BackpackComponent,
      nzComponentParams: {
      },
      nzFooter: null
    });
    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));

    // Return a result when closed
    modal.afterClose.subscribe((result) => {
      console.log(`${this.isToggle}`);
      this.isToggle = true;
      // this.isToggle = false;
    });

    // delay until modal instance created
    // window.setTimeout(() => {
    //   const instance = modal.getContentComponent();
    //   instance.subtitle = 'sub title is changed';
    // }, 2000);
  }
  showEquip = () => {
    const modal = this.modalService.create({
      nzTitle: '<i class="iconfont icon-wodezhuangbeiku"></i>装备',
      nzContent: EquipComponent,
      nzComponentParams: {
      },
      nzFooter: null
    });
  }
  showChat = (tplTitle: TemplateRef<{}>) => {
    const modal = this.modalService.create({
      nzTitle: tplTitle,
      nzContent: ChatComponent,
      nzComponentParams: {
      },
      nzFooter: null
    });
  }
  showMail = (tplTitle: TemplateRef<{}>) => {
    const modal = this.modalService.create({
      nzTitle: tplTitle,
      nzContent: MailComponent,
      nzComponentParams: {
      },
      nzFooter: null
    });
  }
  showShop = (tplTitle: TemplateRef<{}>) => {
    const modal = this.modalService.create({
      nzTitle: tplTitle,
      nzContent: ShopComponent,
      nzComponentParams: {
      },
      nzFooter: null
    });
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
