/**
 * 字节包对应于服务端的WsPacket
 * @author sando
 */
export class WsPacket {
    private packetId: number;
    // protobuff 对象生成的数组
    private data: Uint8Array;

    constructor() {
    }

    static valueOf(packetId: number, data: Uint8Array): WsPacket {
        const reqPacket = new WsPacket();
        reqPacket.packetId = packetId;
        reqPacket.data = data;
        return reqPacket;
    }

    /**
     * 获取对象的ArrayBuffer
     */
    getBuffer(): ArrayBuffer {
        // 前4个字节表示包字节数量 接下来两个字节表示packetId 剩下的数据表示protobuf编码的对象
        const packetLenth = 4 + 2 + this.data.byteLength;
        const buffer = new ArrayBuffer(packetLenth); // 初始化6个Byte的二进制数据缓冲区
        // 复合视图
        // 第0-3字节: 一个32位无符号整数 包字节数量
        // 第4-5字节：一个16位无符号整数 packetId
        // 第6-末尾字节： 8位无符号整数数组（protobuff对象）
        const dataV = new  DataView(buffer);
        // 必须采用大端字节序服务端读取到的数据才正常
        dataV.setUint32(0, packetLenth);
        dataV.setUint16(4, this.packetId);
        // 单个字节无需区分字节序，所以可以用Uint8Array视图，否则必须用DataView确保大端字节序
        const dataView = new Uint8Array(buffer, 6);
        let i = 0;
        this.data.forEach(element => {
            dataView[i] = element;
            i++;
        });
        return buffer;
    }
}
