import { Observable } from 'rxjs/Observable';
import { IUserItem } from '../shared/model/user-item.interface';


export interface IUserService {
    getUsers(): Observable<IUserItem[]>;
    getUser(userId: string): Observable<IUserItem>;
    addUser(IUserItem): Observable<IUserItem>;
    editUser(IUserItem): Observable<IUserItem>;
    deleteUser(userId: any): Observable<Object>;
}
