import { Injectable, OnInit } from "@angular/core";
import { PacketId } from "../../../shared/model/packet/PacketId";
import { IPacket } from "../../../shared/model/packet/IPacket";

/**
 * 登录认证请求
 */
@Injectable({
  providedIn: 'root'
})
export class LoginAuthReq implements OnInit,IPacket{

    private account:string;
    
    private password:string;

	constructor(
        private packetId:PacketId
    ) {
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
    
    ngOnInit() {
        PacketId.put(PacketId.LOGIN_AUTH_REQ,this.getClassName());
    }

    getClassName(){
        return "LoginAuthReq";
    }
}