
import { LoginAuthReq } from '../proto/bundle';

export class PacketId {
    static readonly class2PacketId = new Map<string, number>();
    static readonly packetId2Class = new Map<number, string>();

    // 登录认证请求
    static readonly LOGIN_AUTH_REQ: number = 10001;

    constructor() {
        PacketId.put(PacketId.LOGIN_AUTH_REQ, LoginAuthReq.name);
    }

    static put(packetId: number, classtName: string) {
        PacketId.class2PacketId.set(classtName, packetId);
        PacketId.packetId2Class.set(packetId, classtName);
    }
}
