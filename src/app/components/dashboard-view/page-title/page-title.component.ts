import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {ArchetypeService} from "../../../core/services/archetype.service";
import {ApiResponse} from "../../../shared/interface/ApiResponse";
import {ENVIRONMENT} from 'src/environments/environment';
import {UpperCasePipe} from "@angular/common";
import {SessionService} from "../../../core/services/session-storage.service";
import {SESSION_SERVICE} from "../../../../config/session-service";
import {MatCard} from "@angular/material/card";

@Component({
    selector: 'page-title',
    standalone: true,
    imports: [UpperCasePipe, MatCard],
    templateUrl: './page-title.component.html',
    styleUrls: ['./page-title.component.css']
})
export class PageTitleComponent implements OnInit {
    @ViewChild('txtTitle') txtTitle!: ElementRef<HTMLSpanElement>;

    public readonly title: ApiResponse<any> = {data: ''};
    private readonly sessionService: SessionService = inject(SessionService);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    ngOnInit(): void {
        this.txtTitleInitialize();
    }

    private async setTitle(): Promise<void> {
        const url: string = `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.title}`;
        this.title.data = await this.archetypeService.getMapping(url);
        this.sessionService.setItem(SESSION_SERVICE.application_title, this.title.data);
    }

    private txtTitleInitialize(): void {
        this.sessionService.clear();
        this.setTitle();
    }
}