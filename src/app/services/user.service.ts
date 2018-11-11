import { Injectable } from '@angular/core';
import { IUserService } from '../contracts/user-service.interface';
import { Observable, BehaviorSubject } from 'rxjs';
import { IUserItem } from '../shared/model/user-item.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomError } from 'app/error/custom-error';

@Injectable()
export class UserService implements IUserService {
    private subject = new BehaviorSubject<IUserItem[]>([])
    public userItems$: Observable<IUserItem[]> = this.subject.asObservable()
    constructor(
        private http: HttpClient
    ) {

    }
    deleteUser(userId: string): boolean {
        throw new Error('Method not implemented.');
    }
    getUsers(): Observable<IUserItem[]> {
        const network = this.http.get<IUserItem[]>('/').publishReplay(1, 5000)
            .refCount();

        network.subscribe(
            userItems => {
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
    editUser(IUserItem: any): Observable<IUserItem> {
        throw new Error('Method not implemented.');
    }

}
