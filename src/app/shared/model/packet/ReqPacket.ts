/**
 * 请求包
 * @author sando
 */
export class ReqPakcet {
    private packetId: number;
    // protobuff 对象生成的数组
    private data: Uint8Array;

    constructor() {
    }

    static valueOf(packetId: number, data: Uint8Array): ReqPakcet {
        const reqPacket = new ReqPakcet();
        reqPacket.packetId = packetId;
        reqPacket.data = data;
        return reqPacket;
    }

    /**
     * 获取对象的ArrayBuffer
     */
    getBuffer(): ArrayBuffer {
        const buffer = new ArrayBuffer(2 + this.data.byteLength); // 初始化6个Byte的二进制数据缓冲区
        // 复合视图
        // 第0-1字节: 一个16位无符号整数
        // 第2-末尾字节： 8位无符号整数数组（protobuff对象）
        const dataV = new  DataView(buffer);
        // 必须采用大端字节序服务端读取到的数据才正常
        dataV.setUint16(0, this.packetId);
        // 单个字节无需区分字节序，所以可以用Uint8Array视图，否则必须用DataView确保大端字节序
        const dataView = new Uint8Array(buffer, 2);
        let i = 0;
        this.data.forEach(element => {
            dataView[i] = element;
            i++;
        });
        return buffer;
    }
}
