import {Component, inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Validator} from 'src/app/shared/validator/validator';
import {ApiResponse} from "../../../shared/interface/ApiResponse";
import {ArchetypeService} from "../../../core/services/archetype.service";
import {ENVIRONMENT} from 'src/environments/environment';
import {StringFunc} from 'src/app/shared/string-utils/StringFunc';
import {NUMBER_CONSTANT} from "../../../shared/NumberConstant";
import {Router} from "@angular/router";
import {TECHNICAL_LOGGER} from "../../../../config/technical-logger";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../../../material.module";

@Component({
    selector: 'page-home',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    templateUrl: './page-home.component.html',
    styleUrls: ['./page-home.component.css'],
})
export class PageHomeComponent implements OnInit {
    public startValidation: boolean = false;
    public selectedFileName: string = StringFunc.STRING_EMPTY;
    public detail: ApiResponse<any> = {data: StringFunc.STRING_EMPTY};
    public errorList: string[] = [];

    private readonly router: Router = inject(Router);
    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    public frm: FormGroup = this.fb.group({
        detail: [StringFunc.STRING_EMPTY,
            [
                Validators.required,
                Validators.minLength(NUMBER_CONSTANT.INITIALIZE_WITH_2),
                Validator.textContainsValue,
                Validator.textContainsDefaultValue,
                Validator.textContainsCreateTableValue
            ]
        ]
    });

    ngOnInit(): void {
        void this.detailInitialize();
    }

    get detailControl(): AbstractControl<any, any> | null {
        return this.frm.get('group1.detail');
    }

    get errorMessage(): string | null {
        const error = this.detailControl?.errors;
        if (!error) return null;

        if (error['minlength']) return this.errorList[0];
        if (error['required'] || error['textContainsValue']) return this.errorList[1];
        if (error['textContainsDefaultValue'] || error['textContainsCreateTableValue']) return this.errorList[2];

        return null;
    }

    public submit(): void {
        if (this.frm.valid) {
            const detailValue: any = this.frm.getRawValue().detail;
            this.navigateToPageStructure(StringFunc.encodeBase64(detailValue));
        } else {
            this.startValidation = true;
            this.frm.markAllAsTouched();
        }
    }

    public onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file: File | undefined = input.files?.[0];
        if (!file) return;

        this.selectedFileName = file.name;
        const reader = new FileReader();
        reader.onload = (): void => this.frm.patchValue({detail: reader.result as string});
        reader.readAsText(file);
    }

    private navigateToPageStructure(content: string): void {
        this.router.navigate(['/page-structure'], {
            state: {detailContent: content}
        }).then(success => TECHNICAL_LOGGER.info(`Navigation result: ${success}`));
    }

    private async detailInitialize(): Promise<void> {
        this.detail.data = await this.archetypeService.getMapping(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.detail}`);
        this.frm.patchValue({detail: this.detail.data});
    }
}