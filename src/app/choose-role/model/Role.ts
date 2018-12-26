import { RoleType } from 'src/app/shared/model/proto/bundle';
import { Long } from 'protobufjs';
export class Role {
    roleId: (number|Long);
    /**
     * 角色昵称
     */
    name: String;
    /**
     * 角色类型
     */
    roleType: RoleType;
    /**
     * 角色等级
     */
    level: number;

    static init() {
    }

    get roleTypeName() {
        return Role.getRoleTypeNameByType(this.roleType);
    }

    static getRoleTypeNameByType(roleType: RoleType) {
        let roleTypeName: string;
        switch (roleType) {
            case RoleType.ELF : {
                roleTypeName = '精灵';
                break;
            }
            case RoleType.DEVIL : {
                roleTypeName = '魔鬼';
                break;
            }
            case RoleType.SAINT : {
                roleTypeName = '圣使';
                break;
            }
            default: console.error(`roleType名称未定义`);
        }
        return roleTypeName;
    }
}
Role.init();
export class CustomRole extends Role {
    maxHp: (number|Long);
    maxMp: (number|Long);
    currentHp: (number|Long);
    currentMp: (number|Long);
}
