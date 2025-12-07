import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {PageHomeValidation} from 'src/app/shared/validator/PageHomeValidation';
import {Hyperparameters} from "../../../shared/interface/hyperparameters";
import {ArchetypeService} from "../../../core/services/archetype.service";
import {CommonModule} from "@angular/common";
import {ENVIRONMENT} from 'src/environments/environment';
import {STRING_FUNC} from 'src/app/core/string-utils/StringFunc';
import {Router} from "@angular/router";
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

    @ViewChild('btnConfirm') btnConfirm!: ElementRef<HTMLButtonElement>;
    @ViewChild('txtDetail') txtDetail!: ElementRef<HTMLTextAreaElement>;
    @ViewChild('txtFile') txtFile!: ElementRef<HTMLInputElement>;

    private readonly router: Router = inject(Router);
    private readonly formBuilder: FormBuilder = inject(FormBuilder);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    public detail: Hyperparameters = {data: ''};
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

    public get getDetail(): FormControl<string> {
        return this.frmHomePage.get('group1.detail') as FormControl<string>;
    }

    public submit(): void {

        if (this.frmHomePage.invalid) {
            this.startValidation = true;
            this.frmHomePage.markAllAsTouched();
        } else {
            const groupValue: any = this.frmHomePage.get('group1')?.value;

            this.router.navigate(['/page-structure']).then(success => {
                console.log('Navigation result:', success);
            });
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

    private async setDetail(): Promise<void> {
        const url: string = `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.detail}`;
        this.detail.data = await this.archetypeService.getData(url);
    }

    private frmHomePageInitialize(): void {
        this.frmHomePage = this.formBuilder.group({
            group1: this.formBuilder.group({
                detail: new FormControl(STRING_FUNC.STRING_EMPTY,
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
            'The detail content is empty.',
            'The detail content is invalid.'
        );
    }

    private txtDetailGetFormContent(content: string): void {
        const detail = this.frmHomePage.get(['group1', 'detail']) as FormControl<string>;
        detail.setValue(content, {emitEvent: true});
        detail.updateValueAndValidity({onlySelf: true});
        this.btnConfirm.nativeElement.disabled = false;
        this.btnConfirm.nativeElement.focus();
    }
}