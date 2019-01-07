
import { LoginAuthReq, LoginResultResp, CustomRoleUiInfoResp, MonsterUiInfoResp, RoleUiInfoResp, RegisterReq, RegisterResp, AddRoleReq, AddRoleResp, ChooseRoleReq, ChooseRoleResp, DeleteRoleReq, DeleteRoleResp, GetRoleListReq, GetRoleListResp, EnterWorldReq, ObjectDisappearResp, SwitchSceneReq, PingHeartBeat, PongHeartBeat, ChatMessage, ChatReq, ChatResp, SceneUiInfoResp } from '../proto/bundle';
import { Type } from '@angular/core';
import { Reader, Writer } from 'protobufjs';
import { IPacket } from './IPacket';

// class Codec {
//     decode: (reader: (Reader|Uint8Array), length?: number) => any;
//     create: (properties?: any) => any;
//     encode: (message: any, writer?: Writer) => Writer;
// }
export class PacketId {
    static readonly class2PacketId = new Map<IPacket, number>();
    static readonly packetId2Class = new Map<number, IPacket>();

    // 以下的start到end之间的内容由服务端生成，请勿删除这两行注释
    // start
    /** 登录认证*/
    static readonly LOGIN_AUTH_REQ: number = 10001;
    /** 登录结果响应包*/
    static readonly LOGIN_RESULT_RESP: number = 10002;
    /** 自身信息*/
    static readonly CUSTOM_ROLE_UI_INFO_RESP: number = 10502;
    /** 怪物提供给前端的ui信息响应包*/
    static readonly MONSTER_UI_INFO_RESP: number = 10503;
    /** 角色UI信息响应包*/
    static readonly ROLE_UI_INFO_RESP: number = 10501;
    /** 注册请求*/
    static readonly REGISTER_REQ: number = 10201;
    /** 注册响应包*/
    static readonly REGISTER_RESP: number = 10202;
    /** 添加角色请求*/
    static readonly ADD_ROLE_REQ: number = 10303;
    /** 添加角色响应*/
    static readonly ADD_ROLE_RESP: number = 10304;
    /** 选择角色请求*/
    static readonly CHOOSE_ROLE_REQ: number = 10307;
    /** 选择角色响应*/
    static readonly CHOOSE_ROLE_RESP: number = 10308;
    /** 删除角色请求*/
    static readonly DELETE_ROLE_REQ: number = 10305;
    /** 删除角色响应*/
    static readonly DELETE_ROLE_RESP: number = 10306;
    /** 获取角色列表请求*/
    static readonly GET_ROLE_LIST_REQ: number = 10301;
    /** 获取角色列表响应*/
    static readonly GET_ROLE_LIST_RESP: number = 10302;
    /** 进入世界请求*/
    static readonly ENTER_WORLD_REQ: number = 10403;
    /** 可见物消失响应包*/
    static readonly OBJECT_DISAPPEAR_RESP: number = 10402;
    /** 切换场景请求*/
    static readonly SWITCH_SCENE_REQ: number = 10401;
    /** ping心跳包*/
    static readonly PING_HEART_BEAT: number = 1001;
    /** pong心跳包*/
    static readonly PONG_HEART_BEAT: number = 1002;
    /** 聊天消息*/
    static readonly CHAT_MESSAGE: number = 10103;
    /** 聊天请求*/
    static readonly CHAT_REQ: number = 10101;
    /** 聊天响应*/
    static readonly CHAT_RESP: number = 10102;
    /** 场景信息响应包*/
    static readonly SCENE_UI_INFO_RESP: number = 10404;
    // end

    constructor() {
        // start
        PacketId.put(PacketId.LOGIN_AUTH_REQ, LoginAuthReq);
        PacketId.put(PacketId.LOGIN_RESULT_RESP, LoginResultResp);
        PacketId.put(PacketId.CUSTOM_ROLE_UI_INFO_RESP, CustomRoleUiInfoResp);
        PacketId.put(PacketId.MONSTER_UI_INFO_RESP, MonsterUiInfoResp);
        PacketId.put(PacketId.ROLE_UI_INFO_RESP, RoleUiInfoResp);
        PacketId.put(PacketId.REGISTER_REQ, RegisterReq);
        PacketId.put(PacketId.REGISTER_RESP, RegisterResp);
        PacketId.put(PacketId.ADD_ROLE_REQ, AddRoleReq);
        PacketId.put(PacketId.ADD_ROLE_RESP, AddRoleResp);
        PacketId.put(PacketId.CHOOSE_ROLE_REQ, ChooseRoleReq);
        PacketId.put(PacketId.CHOOSE_ROLE_RESP, ChooseRoleResp);
        PacketId.put(PacketId.DELETE_ROLE_REQ, DeleteRoleReq);
        PacketId.put(PacketId.DELETE_ROLE_RESP, DeleteRoleResp);
        PacketId.put(PacketId.GET_ROLE_LIST_REQ, GetRoleListReq);
        PacketId.put(PacketId.GET_ROLE_LIST_RESP, GetRoleListResp);
        PacketId.put(PacketId.ENTER_WORLD_REQ, EnterWorldReq);
        PacketId.put(PacketId.OBJECT_DISAPPEAR_RESP, ObjectDisappearResp);
        PacketId.put(PacketId.SWITCH_SCENE_REQ, SwitchSceneReq);
        PacketId.put(PacketId.PING_HEART_BEAT, PingHeartBeat);
        PacketId.put(PacketId.PONG_HEART_BEAT, PongHeartBeat);
        PacketId.put(PacketId.CHAT_MESSAGE, ChatMessage);
        PacketId.put(PacketId.CHAT_REQ, ChatReq);
        PacketId.put(PacketId.CHAT_RESP, ChatResp);
        PacketId.put(PacketId.SCENE_UI_INFO_RESP, SceneUiInfoResp);
        // end
    }

    static put(packetId: number, classtName: any) {
        PacketId.class2PacketId.set(classtName, packetId);
        PacketId.packetId2Class.set(packetId, classtName);
    }
}
