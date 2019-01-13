import { Injectable } from '@angular/core';
import { IUserService } from '../contracts/user-service.interface';
import { Observable, BehaviorSubject } from 'rxjs';
import { IUserItem } from '../shared/model/user-item.interface';
import { HttpClient} from '@angular/common/http';
import { CustomError } from 'app/error/custom-error';
import { AuthData } from 'app/shared/model/auth-data.model';

@Injectable()
export class UserService implements IUserService {
    public subject = new BehaviorSubject<IUserItem[]>([])
    public userItems$: Observable<IUserItem[]> = this.subject.asObservable()
    public registrationSubject = new BehaviorSubject<AuthData[]>([])
    public registrationItems$: Observable<AuthData[]> = this.registrationSubject.asObservable()
    constructor(
        private http: HttpClient
    ) {

    }
    deleteUser(request: any):  Observable<AuthData> {
       return this.http.post<AuthData>('user/remove', request)
    }
    getUsers(): Observable<IUserItem[]> {
        const network = this.http.get<IUserItem[]>('user/all').publishReplay(1, 5000)
            .refCount();

        network.subscribe(
            userItems => {
                console.log('users' + JSON.stringify(userItems))
                this.subject.next(userItems);
            },
            (err) => {
                throw new CustomError(err, 'Something went wrong :(')
            },
        );

        return network;
    }

    getUser(userId: string): Observable<IUserItem> {
        throw new Error('Method not implemented.');
    }
    addUser(data: any): Observable<IUserItem> {
        return this.http.post<IUserItem>('user', data)
    }
    registerUser(data: any): Observable<IUserItem> {
        return this.http.post<IUserItem>('auth/register', data)
    }
    editUser(iUserItem: IUserItem): Observable<IUserItem> {
        throw new Error('Method not implemented.');
    }

    getRegistrationRequests(): Observable<AuthData[]> {
        const network = this.http.get<AuthData[]>('user').publishReplay(1, 5000)
            .refCount();

        network.subscribe(
            userItems => {
                this.registrationSubject.next(userItems);
            }
        );
        return network;
    }

}
