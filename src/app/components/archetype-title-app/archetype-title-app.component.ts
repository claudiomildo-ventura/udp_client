import {Component, OnInit} from '@angular/core';
import {ArchetypeService} from "../../core/services/archetype.service";
import {Hyperparameters} from "../../shared/interface/hyperparameters";

@Component({
    selector: 'archetype-title-app',
    standalone: true,
    imports: [],
    templateUrl: './archetype-title-app.component.html',
    styleUrls: ['./archetype-title-app.component.css']
})
export class ArchetypeTitleAppComponent implements OnInit {
    private readonly _basePath: string = 'http://localhost:3000/api/udphyperparameters/v1';
    private readonly _title: string = '/title';
    public readonly title: Hyperparameters = {data: ''};

    constructor(private archetypeService: ArchetypeService) {
    }

    ngOnInit(): void {
        this.loadMetadata();
    }

    private loadMetadata(): void {
        this.setTitle();
    }

    private async setTitle(): Promise<void> {
        this.title.data = await this.archetypeService.getData(`${this._basePath}${this._title}`);
    }
}
