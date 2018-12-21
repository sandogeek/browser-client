import { Component, OnInit, ViewChild } from '@angular/core';
import { Role } from './model/Role';
import { RoleType, GetRoleListReq, GetRoleListResp,
  AddRoleReq, AddRoleResp, DeleteRoleResp, DeleteRoleReq, ChooseRoleReq } from '../shared/model/proto/bundle';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WebSocketService, CustomMessage } from '../shared/service/web-socket-service.service';
import { PartialObserver } from 'rxjs';
import { MatSnackBar, MatTable } from '@angular/material';

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
          this.roles.push(role);
          this.table.renderRows();
        } else {
          this.snackBar.open('角色昵称重复，请更换其它昵称');
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
          this.roles.some((role, index, roles) => {
            if (role.name === deleteRoleResp.nameDelete) {
              roles.splice(index, 1);
              return true;
            }
            return false;
          });
          this.table.renderRows();
        } else {
          this.snackBar.open('角色删除失败');
        }
      }
    },
    error: err => console.log(err),
    complete: () => {
    }
  };

  constructor(
    private wsService: WebSocketService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.wsService.observable.subscribe(this.roleListObserver);
    this.wsService.observable.subscribe(this.addRoleObserver);
    this.wsService.observable.subscribe(this.deleteRoleObserver);
    
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
