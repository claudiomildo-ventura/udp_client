import {AfterViewInit, Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../../material.module";
import {IndexedDbService} from "../../core/services/indexed-db.service";
import {Router} from "@angular/router";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ApiResponse} from "../../shared/interface/ApiResponse";

@Component({
    selector: 'parameter-view',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule
    ],
    templateUrl: './parameter-view.component.html',
    styleUrl: './parameter-view.component.css'
})
export class ParameterViewComponent implements AfterViewInit {
    private readonly indexedDbService: IndexedDbService = inject(IndexedDbService);
    private readonly router: Router = inject(Router);
    public frmParameterPage!: FormGroup;
    public detail: ApiResponse<any> = {data: ''};

    ngAfterViewInit(): void {

    }

    public submit(): void {
        if (this.frmParameterPage.invalid) return;
    }

    private async load(): Promise<void> {
        try {
            await this.indexedDbService.getColumns();
        } catch (err) {
            console.error('Error saving/loading columns:', err);
        }
    }
}