import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
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

    @ViewChild('txtFooter') txtFooter!: ElementRef<HTMLParagraphElement>;

    public readonly footer: Hyperparameters = {data: ''};
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    ngOnInit(): void {
        this.txtEnterpriseInitialize();
    }

    private async setFooter(): Promise<void> {
        const url: string = `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.footer}`;
        this.footer.data = await this.archetypeService.getData(url);
    }

    private txtEnterpriseInitialize(): void {
        this.setFooter();
    }
}