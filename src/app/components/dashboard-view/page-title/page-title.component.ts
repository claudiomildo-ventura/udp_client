import {Component, inject, OnInit} from '@angular/core';
import {ArchetypeService} from "../../../core/services/archetype.service";
import {Hyperparameters} from "../../../shared/interface/hyperparameters";
import {ENVIRONMENT} from 'src/environments/environment';
import {UpperCasePipe} from "@angular/common";

@Component({
    selector: 'page-title',
    standalone: true,
    imports: [UpperCasePipe],
    templateUrl: './page-title.component.html',
    styleUrls: ['./page-title.component.css']
})
export class PageTitleComponent implements OnInit {
    public readonly title: Hyperparameters = {data: ''};
    private readonly archetypeService = inject(ArchetypeService);

    ngOnInit(): void {
        this.setTitle();
    }

    private async setTitle(): Promise<void> {
        this.title.data = await this.archetypeService.getData(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.title}`);
    }
}