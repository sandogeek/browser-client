
import { ChatReq, ChatResp, LoginAuthReq, LoginResultResp, FirstEnterSceneResp, RegisterReq, RegisterResp, AddRoleReq, AddRoleResp, ChooseRoleReq, ChooseRoleResp, DeleteRoleReq, DeleteRoleResp, GetRoleListReq, GetRoleListResp, PingHeartBeat, PongHeartBeat } from '../proto/bundle';
import { Type } from '@angular/core';
import { Reader, Writer } from 'protobufjs';
import { IPacket } from '../proto/IPacket';

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
    /** 聊天请求*/
    static readonly CHAT_REQ: number = 10101;
    /** 聊天响应*/
    static readonly CHAT_RESP: number = 10102;
    /** 登录认证*/
    static readonly LOGIN_AUTH_REQ: number = 10001;
    /** 登录结果响应包*/
    static readonly LOGIN_RESULT_RESP: number = 10002;
    /** 首次进入场景可见信息响应包*/
    static readonly FIRST_ENTER_SCENE_RESP: number = 10401;
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
    /** ping心跳包*/
    static readonly PING_HEART_BEAT: number = 1001;
    /** pong心跳包*/
    static readonly PONG_HEART_BEAT: number = 1002;
    // end

    constructor() {
        // start
        PacketId.put(PacketId.CHAT_REQ, ChatReq);
        PacketId.put(PacketId.CHAT_RESP, ChatResp);
        PacketId.put(PacketId.LOGIN_AUTH_REQ, LoginAuthReq);
        PacketId.put(PacketId.LOGIN_RESULT_RESP, LoginResultResp);
        PacketId.put(PacketId.FIRST_ENTER_SCENE_RESP, FirstEnterSceneResp);
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
        PacketId.put(PacketId.PING_HEART_BEAT, PingHeartBeat);
        PacketId.put(PacketId.PONG_HEART_BEAT, PongHeartBeat);
        // end
    }

    static put(packetId: number, classtName: any) {
        PacketId.class2PacketId.set(classtName, packetId);
        PacketId.packetId2Class.set(packetId, classtName);
    }
}
