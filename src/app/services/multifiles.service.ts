import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MultifilesService {

  constructor(  private http: HttpClient) { }

  saveFiles(total_form) {

    // return this.http.post('http://localhost:8181/uploadFiles', total_form);
    return null;

  }

}
