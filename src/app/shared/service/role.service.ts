import { Injectable } from '@angular/core';
import { CustomRole } from 'src/app/choose-role/model/Role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  selectedRole: CustomRole;
  constructor() { }
}
