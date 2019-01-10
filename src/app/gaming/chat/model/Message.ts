import { User } from './User';

export class Message {
    author: User;
    text: string;
    timestamp?: string;
}
