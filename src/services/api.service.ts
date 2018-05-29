import { Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';

const API_URL = environment.apiUrl;

@Injectable()
export class ApiService {

    constructor(
        private http: HttpClient
    ) { } // end constructor

    public get(endpoint, params?) {
        if (params) {
            let getParams = new HttpParams();
            for (let key in params) {
                getParams = getParams.append(key, params[key]);
            }
            return this.http.get(`${API_URL}/${endpoint}`, { params: getParams });
        } else {
            return this.http.get(`${API_URL}/${endpoint}`);
        }
    } // end get

    public post(endpoint, body, queryParams?) {
        return this.http.post(`${API_URL}/${endpoint}`, body);
    } // end post

    public put(endpoint, body, queryParams?) {
        return this.http.put(`${API_URL}/${endpoint}`, body);
    } // end put

}
