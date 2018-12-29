import { Long } from 'protobufjs';

export class Monster {
    objId: number;
    name: string;
    currentHp: number|Long;
    maxHp: number|Long;

    constructor() {

    }
}
