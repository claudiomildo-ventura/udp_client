import {Injectable} from '@angular/core';
import {HttpclientService} from "./httpclient.service";

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

    public setTitle(): string {
        let result: string = '';

        this.client.getData$(`${this._basePath}${this._title}`).subscribe((response: any): void => {
            result = response.data;
            console.log(result);
        });

        return result;
    }
}
