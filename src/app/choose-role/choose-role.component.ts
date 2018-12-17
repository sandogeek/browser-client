import { Component, OnInit } from '@angular/core';
import { Role } from './model/Role';
import { RoleType, GetRoleListReq } from '../shared/model/proto/bundle';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { WebSocketService, CustomMessage } from '../shared/service/web-socket-service.service';
import { PartialObserver } from 'rxjs';

@Component({
  selector: 'app-choose-role',
  templateUrl: './choose-role.component.html',
  styleUrls: ['./choose-role.component.css']
})
export class ChooseRoleComponent implements OnInit {
  roles: Array<Role> = new Array();
  hint: string;
  // roleForm: FormGroup;
  name: string;
  roleTypeSelect: string;

  roleTypeName2EnumName: Map<String, string> = new Map();
  roleTypeNames: Array<string> = new Array();

  constructor(
    private wsService: WebSocketService,
  ) {
    const observer: PartialObserver<CustomMessage> = {
      next : message => {
        // if (message.clazz === LoginResultResp ) {
        //   <LoginResultResp>message.resp
          
        // }
      },
      error: err => console.log(err),
      complete: () => {
      }
    };
    wsService.observable.subscribe(observer);
    wsService.sendPacket(GetRoleListReq, {});
    const role1 = new Role();
    role1.name = '小菲菲';
    role1.level = 20;
    role1.roleType = RoleType.DEVIL;
    const role2 = new Role();
    role2.name = '小二货';
    role2.level = 30;
    role2.roleType = RoleType.ELF;
    this.roles.push(role1);
    this.roles.push(role2);
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
    console.log(`${this.name}${this.roleTypeSelect}`);
  }
  get roleSizeLess3() {
    return this.roles.length < 3;
  }

  ngOnInit() {
  }

}
