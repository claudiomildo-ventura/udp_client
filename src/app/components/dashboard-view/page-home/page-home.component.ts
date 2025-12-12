import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {PageHomeValidation} from 'src/app/shared/validator/PageHomeValidation';
import {ApiResponse} from "../../../shared/interface/ApiResponse";
import {ArchetypeService} from "../../../core/services/archetype.service";
import {CommonModule} from "@angular/common";
import {ENVIRONMENT} from 'src/environments/environment';
import {StringFunc} from 'src/app/shared/string-utils/StringFunc';
import {PageTitleComponent} from "../page-title/page-title.component";
import {PageEndComponent} from "../page-end/page-end.component";
import {NUMBER_CONSTANT} from "../../../shared/NumberConstant";

@Component({
    selector: 'page-home',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PageTitleComponent, PageEndComponent],
    templateUrl: './page-home.component.html',
    styleUrls: ['./page-home.component.css'],
})
export class PageHomeComponent implements OnInit, AfterViewInit {
    result: any;
    @ViewChild('btnConfirm') btnConfirm!: ElementRef<HTMLButtonElement>;
    @ViewChild('txtDetail') txtDetail!: ElementRef<HTMLTextAreaElement>;
    @ViewChild('txtFile') txtFile!: ElementRef<HTMLInputElement>;

    private readonly formBuilder: FormBuilder = inject(FormBuilder);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    public detail: ApiResponse<any> = {data: ''};
    public frmHomePage!: FormGroup;
    public startValidation: boolean = false;

    public errorList: Array<string> = [];

    ngOnInit(): void {
        this.frmHomePageInitialize();
    }

    ngAfterViewInit(): void {
        this.txtDetailInitialize();
        this.btnConfirmInitialize();
        this.errorListInitialize();
    }

    private async sendData(auxs: string): Promise<void> {
        const url: string = `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.structure}`;
        const aux = {data: auxs};
        await this.archetypeService.postMapping(url, aux);
    }

    public submit(): void {
        if (this.frmHomePageValidate(this.frmHomePage)) {
            const group1Values: any = this.frmHomePage.get('group1')?.value ?? null;
            const result = StringFunc.encodeBase64(group1Values.detail);
            this.sendData(result);
            /*this.router.navigate(['/page-structure'], { state: {detailContent: result}}).then((success: boolean): void => {
                TECHNICAL_LOGGER.info(`Navigation result: ${success}`);
            });*/
        }
    }

    public onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result as string;
            this.txtDetailGetFormContent(text);
        };

        reader.readAsText(file);
    }

    public get getDetailForm(): FormControl<string> {
        return this.frmHomePage.get('group1.detail') as FormControl<string>;
    }

    public get errorMessage(): string | null {
        const error: ValidationErrors | null = this.getDetailForm?.errors;

        if (!error) return null;

        if (error['minlength']) return this.errorList[0];
        if (error['required'] || error['textContainsValue']) return this.errorList[1];
        if (error['textContainsDefaultValue'] || error['textContainsCreateTableValue']) return this.errorList[2];

        return null;
    }

    private frmHomePageInitialize(): void {
        this.frmHomePage = this.formBuilder.group({
            group1: this.formBuilder.group({
                detail: new FormControl(StringFunc.STRING_EMPTY,
                    [
                        Validators.required,
                        Validators.minLength(NUMBER_CONSTANT.INITIALIZE_WITH_2),
                        PageHomeValidation.textContainsValue,
                        PageHomeValidation.textContainsDefaultValue,
                        PageHomeValidation.textContainsCreateTableValue
                    ]),
            }),
        });
    }

    private frmHomePageValidate(form: FormGroup<any>): boolean {
        if (form.invalid) {
            this.startValidation = true;
            form.markAllAsTouched();
            return false;
        }

        return true;
    }

    private txtDetailInitialize(): void {
        this.setDetail();
        this.txtDetail.nativeElement.readOnly = true;
        this.txtDetail.nativeElement.focus();
    }

    private btnConfirmInitialize(): void {
        this.btnConfirm.nativeElement.title = 'Create the Structure';
        this.btnConfirm.nativeElement.style.width = '70px';
        this.btnConfirm.nativeElement.disabled = true;
    }

    private errorListInitialize(): void {
        this.errorList = Array.of(
            'The detail content must be at least 2 characters long.',
            'The detail content is empty for generate the structure.',
            'The detail content is invalid for generate the structure.'
        );
    }

    private txtDetailGetFormContent(content: string): void {
        const detail = this.frmHomePage.get(['group1', 'detail']) as FormControl<string>;
        detail.setValue(content, {emitEvent: true});
        detail.updateValueAndValidity({onlySelf: true});
        this.btnConfirm.nativeElement.disabled = false;
        this.btnConfirm.nativeElement.focus();
    }

    private async setDetail(): Promise<void> {
        const url: string = `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.detail}`;
        this.detail.data = await this.archetypeService.getMapping(url);
    }
}