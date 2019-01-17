import { IUserItem } from './user-item.interface';


export class UserItem implements IUserItem {
    uid?: string;    emailAddress?: string;
    contactNumber: string;
    userAddress?: string;
    name?: string;
    surname?: string;
    selected?: string;
    info?: boolean;
    twitter?: boolean;
    faceBook?: boolean;
    events?: boolean;
    about?: string;
    profilePicURL?: string;
    role?: string;
    id?: string;

}
