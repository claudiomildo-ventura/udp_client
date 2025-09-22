import {Injectable} from '@angular/core';
import {HttpclientService} from "./httpclient.service";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class ArchetypeService {
    private readonly _basePath: string = 'http://localhost:3000/api/udphyperparameters/v1';
    private readonly _title: string = '/title';
    private readonly _description: string = '/description';
    private readonly _databases: string = '/databases';
    private readonly _architectures: string = '/architectures';
    private readonly _databasesEngineer: string = '/databases-engineer';
    private readonly _environments: string = '/environments';
    private readonly _forms: string = '/forms';


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
