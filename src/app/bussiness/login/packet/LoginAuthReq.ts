import { Injectable, OnInit } from '@angular/core';
import { PacketId } from '../../../shared/model/packet/PacketId';
import { IPacket } from '../../../shared/model/packet/IPacket';

/**
 * 类名必须和.proto文件名一致，.proto文件名必须与里面的message名一致
 */
@Injectable({
  providedIn: 'root'
})
export class LoginAuthReq implements IPacket {

    private account: string;

    private password: string;

    constructor(
        private packetId: PacketId
    ) {
        PacketId.put(PacketId.LOGIN_AUTH_REQ, this.getClassName());
    }

    /**
     * Getter $account
     * @return {string}
     */
	public get $account(): string {
		return this.account;
	}

    /**
     * Getter $password
     * @return {string}
     */
	public get $password(): string {
		return this.password;
	}

    /**
     * Setter $account
     * @param {string} value
     */
	public set $account(value: string) {
		this.account = value;
	}

    /**
     * Setter $password
     * @param {string} value
     */
	public set $password(value: string) {
		this.password = value;
	}

    getClassName() {
        return this.constructor.name;
    }
}