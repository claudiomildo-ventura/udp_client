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
    private readonly formBuilder: FormBuilder = inject(FormBuilder);
    private readonly router: Router = inject(Router);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    public frmHomePage!: FormGroup;
    public startValidation: boolean = false;
    public selectedFileName: string = '';
    public detail: ApiResponse<any> = {data: ''};
    public errorList: string[] = [];

    ngOnInit(): void {
        this.formActive();
        this.errorsInitialize();
        this.detailInitialize();
    }

    get detailControl(): AbstractControl<any, any> | null {
        return this.frmHomePage.get('group1.detail');
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
        if (this.frmHomePage.valid) {
            const group1Values: any = this.frmHomePage.get('group1')?.value;
            this.navigateToPageStructure(StringFunc.encodeBase64(group1Values.detail));
        } else {
            this.startValidation = true;
            this.frmHomePage.markAllAsTouched();
        }
    }

    public onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file: File | undefined = input.files?.[0];
        if (!file) return;

        this.selectedFileName = file.name;

        const reader = new FileReader();
        reader.onload = (): void => {
            this.detailControl?.setValue(reader.result as string);
            this.detailControl?.updateValueAndValidity();
        };
        reader.readAsText(file);
    }

    private formActive(): void {
        this.frmHomePage = this.formBuilder.group({
            group1: this.formBuilder.group({
                detail: [
                    StringFunc.STRING_EMPTY,
                    [
                        Validators.required,
                        Validators.minLength(NUMBER_CONSTANT.INITIALIZE_WITH_2),
                        Validator.textContainsValue,
                        Validator.textContainsDefaultValue,
                        Validator.textContainsCreateTableValue
                    ]
                ]
            })
        });
    }

    private errorsInitialize(): void {
        this.errorList = [
            'The detail content must be at least 2 characters long.',
            'The detail content is empty for generating the structure.',
            'The detail content is invalid for generating the structure.'
        ];
    }

    private navigateToPageStructure(content: string): void {
        this.router.navigate(['/page-structure'], {
            state: {detailContent: content}
        }).then(success => TECHNICAL_LOGGER.info(`Navigation result: ${success}`));
    }

    private async detailInitialize(): Promise<void> {
        const url = `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.detail}`;
        this.detail.data = await this.archetypeService.getMapping(url);
        this.detailControl?.setValue(this.detail.data);
    }
}