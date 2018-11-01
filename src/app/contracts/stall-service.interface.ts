import { IStallItem } from "../shared/model/stall-item.interface";
import { Observable } from "rxjs";

export interface IStallService {
    getAllStallApplications(): Observable<IStallItem[]>;
    getStallItem(userId: string): Observable<IStallItem>;
    addStallItem(IStallItem): Observable<IStallItem>;
    removeStallItem(IStallItem): Observable<IStallItem>;
}