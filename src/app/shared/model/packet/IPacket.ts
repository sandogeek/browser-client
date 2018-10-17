import { Type } from '@angular/core';
/**
 * 相当于服务器的AbstractPacket
 */
export interface IPacket {
    getClassName(): string;
}
