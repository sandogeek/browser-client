import { Injectable } from '@angular/core';
import { CustomRole } from 'src/app/choose-role/model/Role';
import { PartialObserver } from 'rxjs';
import { CustomMessage, WebSocketService } from './web-socket-service.service';
import { CurrentHpUpdate, CurrentMpUpdate, MaxHpUpdate, MaxMpUpdate, LevelUpdate, MonsterUiInfoResp, MonsterHpUpdate, MonsterMaxHpUpdate, GlobalMessage, GlobalMessageType, SkillListUpdate, ISkillUiInfo } from '../model/proto/bundle';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  selectedRole: CustomRole = new CustomRole();
  rolesMap: Map<string, CustomRole> = new Map();
  monstersMap: Map<string, MonsterUiInfoResp> = new Map();

  skillList: Array<ISkillUiInfo> = new Array();

  private currentHpUpdateObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === CurrentHpUpdate) {
        const resp = <CurrentHpUpdate>message.resp;
        if (this.selectedRole.roleId == null || resp.roleId.toString() === this.selectedRole.roleId.toString()) {
          this.selectedRole.currentHp = resp.currentHp;
        } else if (this.rolesMap.has(resp.roleId.toString())) {
          this.rolesMap.get(resp.roleId.toString()).currentHp = resp.currentHp;
        }
      }
    },
    error: err => console.log(err)
  };
  private currentMpUpdateObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === CurrentMpUpdate) {
        const resp = <CurrentMpUpdate>message.resp;
        if (this.selectedRole.roleId == null || resp.roleId.toString() === this.selectedRole.roleId.toString()) {
          this.selectedRole.currentMp = resp.currentMp;
        } else if (this.rolesMap.has(resp.roleId.toString())) {
          this.rolesMap.get(resp.roleId.toString()).currentMp = resp.currentMp;
        }
      }
    },
    error: err => console.log(err)
  };
  private maxHpUpdateObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === MaxHpUpdate) {
        const resp = <MaxHpUpdate>message.resp;
        if (this.selectedRole.roleId == null || resp.roleId.toString() === this.selectedRole.roleId.toString()) {
          this.selectedRole.maxHp = resp.maxHp;
        } else if (this.rolesMap.has(resp.roleId.toString())) {
          this.rolesMap.get(resp.roleId.toString()).maxHp = resp.maxHp;
        }
      }
    },
    error: err => console.log(err)
  };
  private maxMpUpdateObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === MaxMpUpdate) {
        const resp = <MaxMpUpdate>message.resp;
        if (this.selectedRole.roleId == null || resp.roleId.toString() === this.selectedRole.roleId.toString()) {
          this.selectedRole.maxMp = resp.maxMp;
        } else if (this.rolesMap.has(resp.roleId.toString())) {
          this.rolesMap.get(resp.roleId.toString()).maxMp = resp.maxMp;
        }
      }
    },
    error: err => console.log(err)
  };
  private levelUpdateObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === MaxMpUpdate) {
        const resp = <LevelUpdate>message.resp;
        if (this.selectedRole.roleId == null || resp.roleId.toString() === this.selectedRole.roleId.toString()) {
          this.selectedRole.level = resp.level;
        } else if (this.rolesMap.has(resp.roleId.toString())) {
          this.rolesMap.get(resp.roleId.toString()).level = resp.level;
        }
      }
    },
    error: err => console.log(err)
  };
  private monsterHpObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === MonsterHpUpdate) {
        const resp = <MonsterHpUpdate>message.resp;
        this.monstersMap.get(resp.objId.toString()).currentHp = resp.hp;
      }
    },
    error: err => console.log(err)
  };
  private monsterMaxHpObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === MonsterMaxHpUpdate) {
        const resp = <MonsterMaxHpUpdate>message.resp;
        this.monstersMap.get(resp.objId.toString()).maxHp = resp.maxHp;
      }
    },
    error: err => console.log(err)
  };

  private globalMessageObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === GlobalMessage) {
        const resp = <GlobalMessage>message.resp;
        switch (resp.globalMessageType) {
          case GlobalMessageType.SUCCESS : {
            this.msgService.success(`${resp.message}`);
            break;
          }
          case GlobalMessageType.ERROR : {
            this.msgService.error(`${resp.message}`);
            break;
          }
          case GlobalMessageType.INFO : {
            this.msgService.info(`${resp.message}`);
            break;
          }
          case GlobalMessageType.WARNING : {
            this.msgService.warning(`${resp.message}`);
            break;
          }
          default : {
            console.error(`未知类型`);
          }
        }
      }
    },
    error: err => console.log(err)
  };
  skillListUpdate$: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === SkillListUpdate) {
        const resp = <SkillListUpdate>message.resp;
        this.skillList = resp.skillUiInfoList;
      }
    },
    error: err => console.log(err)
  };

  constructor(
    private wsService: WebSocketService,
    private msgService: NzMessageService
  ) {
    this.wsService.observable.subscribe(this.currentHpUpdateObserver);
    this.wsService.observable.subscribe(this.currentMpUpdateObserver);
    this.wsService.observable.subscribe(this.maxHpUpdateObserver);
    this.wsService.observable.subscribe(this.maxMpUpdateObserver);
    this.wsService.observable.subscribe(this.levelUpdateObserver);
    this.wsService.observable.subscribe(this.monsterHpObserver);
    this.wsService.observable.subscribe(this.monsterMaxHpObserver);
    this.wsService.observable.subscribe(this.globalMessageObserver);
    this.wsService.observable.subscribe(this.skillListUpdate$);
  }
}
