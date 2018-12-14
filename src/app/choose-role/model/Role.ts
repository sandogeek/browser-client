import { RoleType } from 'src/app/shared/model/proto/bundle';

export class Role {
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

    get roleTypeName() {
        let roleTypeName: string;
        switch (this.roleType) {
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
