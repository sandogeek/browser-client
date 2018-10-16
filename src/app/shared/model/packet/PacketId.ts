import { Injectable, Type } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class PacketId {
    static readonly class2PacketId = new Map<string, number>();
    static readonly packetId2Class = new Map<number, string>();

    // 登录认证请求
    static readonly LOGIN_AUTH_REQ = 10001;

    constructor() {
    }
    static valueOf() {
        return new PacketId();
    }
    static put(packetId: number, classtName: string) {
        PacketId.class2PacketId.set(classtName, packetId);
        PacketId.packetId2Class.set(packetId, classtName);
    }
    static get(obj: number): string;
    static get(obj: string): number;
    static get(obj: number|string): number|string {
        if (typeof obj === 'number') {
            return PacketId.packetId2Class.get(obj);
        } else {
            return PacketId.class2PacketId.get(obj);
        }
    }
}
