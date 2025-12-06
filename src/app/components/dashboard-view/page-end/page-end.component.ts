import {Component, OnInit} from '@angular/core';
import {Hyperparameters} from "../../../shared/interface/hyperparameters";
import {ArchetypeService} from "../../../core/services/archetype.service";
import {PageEnterpriseComponent} from "../page-enterprise/page-enterprise.component";
import {ENVIRONMENT} from 'src/environments/environment';

@Component({
    selector: 'page-end',
    standalone: true,
    imports: [PageEnterpriseComponent],
    templateUrl: './page-end.component.html',
    styleUrl: './page-end.component.css'
})
export class PageEndComponent implements OnInit {
    public readonly footer: Hyperparameters = {data: ''};

    constructor(private archetypeService: ArchetypeService) {
    }

    ngOnInit(): void {
        this.setFooter();
    }

    private async setFooter(): Promise<void> {
        this.footer.data = await this.archetypeService.getData(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.footer}`);
    }
}