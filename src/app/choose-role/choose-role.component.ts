import { Component, OnInit, ViewChild } from '@angular/core';
import { Role, CustomRole } from './model/Role';
import { RoleType, GetRoleListReq, GetRoleListResp,
  AddRoleReq, AddRoleResp, DeleteRoleResp, DeleteRoleReq, ChooseRoleReq, ChooseRoleResp } from '../shared/model/proto/bundle';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WebSocketService, CustomMessage, GameState } from '../shared/service/web-socket-service.service';
import { PartialObserver } from 'rxjs';
import { MatSnackBar, MatTable } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { RoleService } from '../shared/service/role.service';

@Component({
  selector: 'app-choose-role',
  templateUrl: './choose-role.component.html',
  styleUrls: ['./choose-role.component.css']
})
export class ChooseRoleComponent implements OnInit {
  roles: Array<Role> = new Array();
  hint: string;
  roleForm = this.fb.group({
    name: ['', [Validators.required]],
    roleTypeSelect: ['', [Validators.required]]
  });

  roleTypeName2EnumName: Map<String, string> = new Map();
  roleTypeNames: Array<string> = new Array();

  columnsToDisplay = ['roleName', 'roleType' , 'roleLevel', 'function'];
  @ViewChild('roleTable') table: MatTable<Role>;

  roleListObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === GetRoleListResp ) {
        this.roles = new Array();
        (<GetRoleListResp>message.resp).roleInfoList.forEach(v => {
          const role = new Role();
          role.name = v.name;
          role.level = v.level;
          role.roleType = v.roleType;
          this.roles.push(role);
        });
      }
    },
    error: err => console.log(err),
    complete: () => {
    }
  };
  addRoleObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === AddRoleResp) {
        const addRoleResp = <AddRoleResp>message.resp;
        if (addRoleResp.result) {
          const role = new Role();
          role.name = addRoleResp.roleInfo.name;
          role.level = addRoleResp.roleInfo.level;
          role.roleType = addRoleResp.roleInfo.roleType;
          // this.roles.push(role);
          // this.table.renderRows();
          this.roles = [ ...this.roles, role];
        } else {
          this.messageService.error('角色昵称重复，请更换其它昵称');
        }
      }
    },
    error: err => console.log(err),
    complete: () => {
    }
  };
  deleteRoleObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === DeleteRoleResp) {
        const deleteRoleResp = <DeleteRoleResp>message.resp;
        if (deleteRoleResp.result) {
          this.roles = this.roles.filter(role => role.name !== deleteRoleResp.nameDelete);
        } else {
          this.messageService.error('角色删除失败');
        }
      }
    },
    error: err => console.log(err),
    complete: () => {
    }
  };
  chooseRoleObserver: PartialObserver<CustomMessage> = {
    next : message => {
      if (message.clazz === ChooseRoleResp) {
        const chooseRoleResp = <ChooseRoleResp>message.resp;
        if (chooseRoleResp.result) {
          const uiResp = chooseRoleResp.roleUiInfoResp;
          const selectedRole = this.roleService.selectedRole;
          selectedRole.roleId = uiResp.roleId;
          selectedRole.name = uiResp.name;
          selectedRole.level = uiResp.level;
          selectedRole.roleType = uiResp.roleType;
          this.wsService.state = GameState.GAMING;
          this.router.navigate(['/gaming']);
        }
      }
    },
    error: err => console.log(err),
    complete: () => {
    }
  };

  constructor(
    private wsService: WebSocketService,
    private roleService: RoleService,
    private messageService: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.wsService.observable.subscribe(this.roleListObserver);
    this.wsService.observable.subscribe(this.addRoleObserver);
    this.wsService.observable.subscribe(this.deleteRoleObserver);
    this.wsService.observable.subscribe(this.chooseRoleObserver);

    this.wsService.sendPacket(GetRoleListReq, {});
    for (const typeName in RoleType) {
      if (RoleType.hasOwnProperty(typeName)) {
        const type = RoleType[<keyof typeof RoleType>typeName];
        const briefName = Role.getRoleTypeNameByType(type);
        this.roleTypeNames.push(briefName);
        this.roleTypeName2EnumName.set(briefName, typeName);
      }
    }
  }
  getEnumName(briefName: string) {
    return this.roleTypeName2EnumName.get(briefName);
  }

  addRole = () => {
    const type = RoleType[<keyof typeof RoleType>this.roleForm.get('roleTypeSelect').value];
    this.wsService.sendPacket(AddRoleReq, {roleName: this.roleForm.get('name').value, roleType: type});
  }

  chooseRole = (roleName: string) => {
    this.wsService.sendPacket(ChooseRoleReq, {name: roleName});
    this.wsService.selectedRoleName = roleName;
  }

  deleteRole = (roleName: string) => {
    this.wsService.sendPacket(DeleteRoleReq, {roleName: roleName});
  }

  get roleSizeLess3() {
    return this.roles.length < 3;
  }

  ngOnInit() {
  }

}
