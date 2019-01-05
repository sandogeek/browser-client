import * as $protobuf from 'protobufjs';

export abstract class IPacket {
    name: String = this.name;
    abstract create(properties?: any): any;
    abstract encode(message: any, writer?: $protobuf.Writer): $protobuf.Writer;
    abstract encodeDelimited(message: any, writer?: $protobuf.Writer): $protobuf.Writer;
    abstract decode(reader: ($protobuf.Reader|Uint8Array), length?: number): any;
    abstract decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): any;
    abstract verify(message: { [k: string]: any }): (string|null);
    abstract fromObject(object: { [k: string]: any }): any;
    abstract toObject(message: any, options?: $protobuf.IConversionOptions): { [k: string]: any };
    // toJSON(): { [k: string]: any };
}
