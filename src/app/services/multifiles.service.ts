import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IShopItem } from 'app/shared/model/shop-item.interface';
@Injectable({
  providedIn: 'root'
})
export class MultifilesService {

  constructor(  private http: HttpClient) { }

  saveFiles(formFiles: any) {
    return this.http.post<IShopItem>('files', formFiles);
  }

  getFiles(documentType: any) {
    return this.http.get<[any]>('files/'.concat(documentType));
  }

}
