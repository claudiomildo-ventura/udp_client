import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {ApiResponse} from "../../../shared/interface/ApiResponse";
import {ArchetypeService} from "../../../core/services/archetype.service";
import {ENVIRONMENT} from "../../../../environments/environment";
import {MatCard} from "@angular/material/card";

@Component({
    selector: 'page-enterprise',
    standalone: true,
    imports: [
        MatCard
    ],
    templateUrl: './page-enterprise.component.html',
    styleUrl: './page-enterprise.component.css'
})
export class PageEnterpriseComponent implements OnInit {

    @ViewChild('txtEnterprise') txtEnterprise!: ElementRef<HTMLParagraphElement>;

    public readonly enterprise: ApiResponse<any> = {data: ''};
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    ngOnInit(): void {
        this.txtEnterpriseInitialize();
    }

    private async setEnterprise(): Promise<void> {
        const url: string = `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.enterprise}`;
        this.enterprise.data = await this.archetypeService.getMapping(url);
    }

    private txtEnterpriseInitialize(): void {
        this.setEnterprise();
    }
}