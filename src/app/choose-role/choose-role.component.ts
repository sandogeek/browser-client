import { Component, OnInit } from '@angular/core';
import { Role } from './model/Role';
import { RoleType, GetRoleListReq, GetRoleListResp, AddRoleReq, AddRoleResp } from '../shared/model/proto/bundle';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WebSocketService, CustomMessage } from '../shared/service/web-socket-service.service';
import { PartialObserver } from 'rxjs';
import { MatSnackBar } from '@angular/material';

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


  constructor(
    private wsService: WebSocketService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    const observer: PartialObserver<CustomMessage> = {
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
        } else if (message.clazz === AddRoleResp) {
          if ((<AddRoleResp>message.resp).result) {
            this.wsService.sendPacket(GetRoleListReq, {});
          } else {
            snackBar.open('角色昵称重复，请更换其它昵称');
          }
        }
      },
      error: err => console.log(err),
      complete: () => {
      }
    };
    this.wsService.observable.subscribe(observer);
    this.wsService.sendPacket(GetRoleListReq, {});
    // const role1 = new Role();
    // role1.name = '小菲菲';
    // role1.level = 20;
    // role1.roleType = RoleType.DEVIL;
    // const role2 = new Role();
    // role2.name = '小二货';
    // role2.level = 30;
    // role2.roleType = RoleType.ELF;
    // this.roles.push(role1);
    // this.roles.push(role2);
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

  get roleSizeLess3() {
    return this.roles.length < 3;
  }

  ngOnInit() {
  }

}
