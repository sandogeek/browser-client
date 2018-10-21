
import { LoginAuthReq, LoginResultResp } from '../proto/bundle';
import { Type } from '@angular/core';
import { Reader, Writer } from 'protobufjs';

// class Codec {
//     decode: (reader: (Reader|Uint8Array), length?: number) => any;
//     create: (properties?: any) => any;
//     encode: (message: any, writer?: Writer) => Writer;
// }
export class PacketId {
    static readonly class2PacketId = new Map<any, number>();
    static readonly packetId2Class = new Map<number, any>();

    // 登录认证请求
    static readonly LOGIN_AUTH_REQ: number = 10001;
    // 登录结果
    static readonly LOGIN_RESULT_RESP: number = 10002;

    constructor() {
        PacketId.put(PacketId.LOGIN_AUTH_REQ, LoginAuthReq);
        PacketId.put(PacketId.LOGIN_RESULT_RESP, LoginResultResp);
    }

    static put(packetId: number, classtName: any) {
        PacketId.class2PacketId.set(classtName, packetId);
        PacketId.packetId2Class.set(packetId, classtName);
    }
}
