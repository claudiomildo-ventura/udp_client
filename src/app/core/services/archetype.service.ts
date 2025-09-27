import {Injectable} from '@angular/core';
import {HttpclientService} from "./httpclient.service";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class ArchetypeService {
    constructor(private client: HttpclientService) {
    }

    public async getData(url: string): Promise<string> {
        const response = await this.client.getData$(url).toPromise();
        return response.data;
    }

    public async getDataItems(url: string): Promise<any> {
        return this.client.getDataItems$(url).pipe(
            map(response => response)
        ).toPromise();
    }
}
