import { Component, OnInit, TemplateRef } from '@angular/core';
import { WebSocketService, CustomMessage } from '../shared/service/web-socket-service.service';
import { PartialObserver } from 'rxjs';
import {  EnterWorldReq, RoleUiInfoResp,
  ObjectDisappearResp, SceneUiInfoResp,
   ISceneCanGoInfo, SwitchSceneReq, 
   MonsterUiInfoResp, CustomRoleUiInfoResp, SkillUiInfo, UseSkillReq, SkillListUpdate, ISkillUiInfo } from '../shared/model/proto/bundle';
import { Role, CustomRole } from '../choose-role/model/Role';
import { RoleService } from '../shared/service/role.service';
import { NzModalService } from 'ng-zorro-antd';
import { BackpackComponent } from './backpack/backpack.component';
import { EquipComponent } from './equip/equip.component';
import { ChatComponent } from './chat/chat.component';
import { MailComponent } from './mail/mail.component';
import { ShopComponent } from './shop/shop.component';
import { ChatService } from './chat/service/chat.service';
import { BackpackService } from './backpack/service/backpack.service';
import { PacketId } from '../shared/model/packet/PacketId';
import * as Long from 'long';
import {parse, stringtify} from 'json-bigint';

@Component({
  selector: 'app-gaming',
  templateUrl: './gaming.component.html',
  styleUrls: ['./gaming.component.css']
})
export class GamingComponent implements OnInit {

  sceneCanGoInfos: Array<ISceneCanGoInfo> = new Array();
  sceneId: number;
  currentSceneName: string;
  sceneSwitchFlag = false;

  isToggle = false;
  equipSelected = false;

  packetId: number;
  content: string;

  selfInfo = [this];

  selectedSkillId = 1;

  infoObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === SceneUiInfoResp) {
        const sceneUiInfo = <SceneUiInfoResp>message.resp;
        this.sceneId = sceneUiInfo.sceneId;
        this.currentSceneName = sceneUiInfo.sceneName;
        this.sceneCanGoInfos = sceneUiInfo.sceneCanGoInfos;
      } else if (message.clazz === MonsterUiInfoResp) {
        const resp = <MonsterUiInfoResp>message.resp;
        this.monstersMap.set(resp.objId.toString(), resp);
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
        if (!this.rolesMap.delete(objectDisappearResp.id.toString())) {
          console.error(`角色删除失败`);
        }
        // this.roles = this.roles.filter(role => role.roleId !== );
      }
    },
    error: err => console.log(err)
  };

  selfInfoUpdate$: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === CustomRoleUiInfoResp) {
        const resp = <CustomRoleUiInfoResp>message.resp;
        const customRole: CustomRole = {...resp,
        roleTypeName: Role.getRoleTypeNameByType(resp.roleType)};
        if (resp.roleId === this.roleService.selectedRole.roleId) {
          this.roleService.selectedRole = customRole;
        } else {
          this.rolesMap.set(resp.roleId.toString(), customRole);
        }
      }
    },
    error: err => console.log(err)
  };

  constructor(
    private wsService: WebSocketService,
    private roleService: RoleService,
    private modalService: NzModalService,
    // 提前创建聊天服务
    private chatService: ChatService,
    private backpackService: BackpackService,
  ) {
    this.wsService.observable.subscribe(this.infoObserver);
    this.wsService.observable.subscribe(this.objectDisappearObserver);
    this.wsService.observable.subscribe(this.selfInfoUpdate$);
    wsService.sendPacket(EnterWorldReq, {});
    // this.skillList.push(new SkillUiInfo({skillId: 1, skillName: '普通攻击'}));
  }

  switchTo = (sceneId: number) => {
    this.rolesMap = new Map();
    this.monstersMap = new Map();
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
      nzFooter: null,
      nzWidth: 600
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

  useSkill = (objId: number|Long) => {
    this.wsService.sendPacket(UseSkillReq, {skillId: this.selectedSkillId, targetId: objId});
  }

  send = () => {
    const clazz = PacketId.packetId2Class.get(this.packetId);
    this.wsService.sendPacket(clazz, parse(this.content));
  }

  ngOnInit() {
  }
  get roles() {
    return [...this.rolesMap.values()];
  }
  get rolesMap() {
    return this.roleService.rolesMap;
  }
  set rolesMap(rolesMap: Map<string, CustomRole>) {
    this.roleService.rolesMap = rolesMap;
  }

  get monstersMap() {
    return this.roleService.monstersMap;
  }
  set monstersMap(monstersMap: Map<string, MonsterUiInfoResp>) {
    this.roleService.monstersMap = monstersMap;
  }

  get skillList() {
    return this.roleService.skillList;
  }


  get monsters() {
    return [...this.monstersMap.values()];
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
