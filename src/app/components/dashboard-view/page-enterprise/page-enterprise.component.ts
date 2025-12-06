import {Component, inject, OnInit} from '@angular/core';
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
export class PageEnterpriseComponent implements OnInit  {
    public readonly enterprise: Hyperparameters = {data: ''};
    private readonly archetypeService= inject(ArchetypeService);

    ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.setEnterprise();
    }

    private async setEnterprise(): Promise<void> {
        this.enterprise.data = await this.archetypeService.getData(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.enterprise}`);
    }
}