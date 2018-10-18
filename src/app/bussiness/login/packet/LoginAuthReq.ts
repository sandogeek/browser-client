import { Injectable, OnInit } from '@angular/core';
import { PacketId } from '../../../shared/model/packet/PacketId';
import { AbstractPacket } from '../../../shared/model/packet/AbstractPacket';

/**
 * 类名必须和.proto文件名一致，.proto文件名必须与里面的message名一致
 */
export class LoginAuthReq extends AbstractPacket {

    private account: string;

    private password: string;

    constructor() {
        super();
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

    getPacketId() {
        return PacketId.LOGIN_AUTH_REQ;
    }
}
