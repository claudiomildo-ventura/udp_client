import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {Hyperparameters} from "../../../shared/interface/hyperparameters";
import {ArchetypeService} from "../../../core/services/archetype.service";
import {ENVIRONMENT} from "../../../../environments/environment";

@Component({
    selector: 'page-enterprise',
    standalone: true,
    imports: [],
    templateUrl: './page-enterprise.component.html',
    styleUrl: './page-enterprise.component.css'
})
export class PageEnterpriseComponent implements OnInit {

    @ViewChild('txtEnterprise') txtEnterprise!: ElementRef<HTMLParagraphElement>;

    public readonly enterprise: Hyperparameters = {data: ''};
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    ngOnInit(): void {
        this.txtEnterpriseInitialize();
    }

    private async setEnterprise(): Promise<void> {
        const url: string = `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.enterprise}`;
        this.enterprise.data = await this.archetypeService.getData(url);
    }

    private txtEnterpriseInitialize(): void {
        this.setEnterprise();
    }
}