import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";
import {ArchetypeService} from "../../../core/services/archetype.service";
import {ApiResponse} from "../../../shared/interface/ApiResponse";

@Component({
    selector: 'page-structure',
    standalone: true,
    imports: [],
    templateUrl: './page-structure.component.html',
    styleUrl: './archetype-structure-app.component.css'
})
export class PageStructureComponent {
    public readonly obj: ApiResponse<any> = {data: ''};
    private readonly router: Router = inject(Router);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);
}