import { Component, OnInit } from '@angular/core';
import { Role } from './model/Role';
import { RoleType } from '../shared/model/proto/bundle';

@Component({
  selector: 'app-choose-role',
  templateUrl: './choose-role.component.html',
  styleUrls: ['./choose-role.component.css']
})
export class ChooseRoleComponent implements OnInit {
  roles: Array<Role> = new Array();
  constructor() {
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
   }

  ngOnInit() {
  }

}
