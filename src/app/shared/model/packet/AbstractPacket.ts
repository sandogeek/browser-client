import { PacketId } from './PacketId';
/**
 * 相当于服务器的AbstractPacket
 * !!!记得一定要在子类的构造方法中调用super()!!!
 */
export abstract class AbstractPacket {
    constructor() {
        PacketId.put(this.getPacketId(), this.constructor.name);
    }
    abstract getPacketId(): number;

}
