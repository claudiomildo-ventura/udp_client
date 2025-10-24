import {Component, OnInit} from '@angular/core';
import {ArchetypeService} from "../../core/services/archetype.service";
import {Hyperparameters} from "../../shared/interface/hyperparameters";
import {environment} from 'src/environments/environment';
import {UpperCasePipe} from "@angular/common";

@Component({
    selector: 'archetype-title-app',
    standalone: true,
    imports: [
        UpperCasePipe
    ],
    templateUrl: './archetype-title-app.component.html',
    styleUrls: ['./archetype-title-app.component.css']
})
export class ArchetypeTitleAppComponent implements OnInit {
    public readonly title: Hyperparameters = {data: ''};

    constructor(private archetypeService: ArchetypeService) {
    }

    ngOnInit(): void {
        this.setTitle();
    }

    private async setTitle(): Promise<void> {
        this.title.data = await this.archetypeService.getData(`${environment.basePath}${environment.endpoints.title}`);
    }
}