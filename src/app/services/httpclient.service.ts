import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Hyperparameters} from "../common/interface/hyperparameters";
import {HyperparametersItems} from "../common/interface/hyperparametersItems";

@Injectable({
    providedIn: 'root',
})
export class HttpclientService {
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private readonly http: HttpClient) {
    }

    public getData$(url: string): Observable<Hyperparameters> {
        return this.http.get<Hyperparameters>(url, this.httpOptions);
    }

    public sendData$(url: string, data: any): Observable<any> {
        return this.http.post<any>(url, data, this.httpOptions);
    }

    public getDataItems$(url: string): Observable<HyperparametersItems[]> {
        return this.http.get<HyperparametersItems[]>(url, this.httpOptions);
    }
}
