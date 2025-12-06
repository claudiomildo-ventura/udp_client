import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MetadataValidation} from 'src/app/shared/validator/metadatavalidation';
import {Hyperparameters} from "../../../shared/interface/hyperparameters";
import {ArchetypeService} from "../../../core/services/archetype.service";
import {CommonModule} from "@angular/common";
import {environment} from 'src/environments/environment';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {PageTitleComponent} from "../page-title/page-title.component";
import {PageEndComponent} from "../page-end/page-end.component";

@Component({
    selector: 'page-home',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, RouterLinkActive, PageTitleComponent, PageEndComponent],
    templateUrl: './page-home.component.html',
    styleUrls: ['./page-home.component.css'],
})
export class PageHomeComponent implements OnInit, AfterViewInit {

    private router = inject(Router);
    private route = inject(ActivatedRoute);

    btnCreate: string = '';
    detailIsDefault: boolean = true;

    public detail: Hyperparameters = {data: ''};
    public archetypeFrm!: FormGroup;
    public fileContent: string | ArrayBuffer | null = '';
    public startValidation: boolean = false;
    @ViewChild('btnCreateStructure') btnCreateStructure!: ElementRef<HTMLButtonElement>;

    constructor(private readonly formBuilder: FormBuilder,
                private readonly archetypeService: ArchetypeService
    ) {
    }

    ngOnInit(): void {
        this.btnCreate = environment.btnCreate;
        this.setDetail();
        this.archetypeFormCreate();
    }

    ngAfterViewInit() {
        this.btnCreateStructure.nativeElement.focus();
    }

    private async setDetail(): Promise<void> {
        this.detail.data = await this.archetypeService.getData(`${environment.basePath}${environment.endpoints.detail}`);
    }

    public archetypeFormCreate(): void {
        this.archetypeFrm = this.formBuilder.group({
            archetypeFrmGroupOne: this.formBuilder.group({
                archetypeDetail: new FormControl('', [Validators.required, Validators.minLength(2), MetadataValidation.notOnlyWhitespace, MetadataValidation.textContainsInicialValue]),
            }),
        });
    }

    get getArchetypeDetail() {
        return this.archetypeFrm.get('archetypeFrmGroupOne.archetypeDetail');
    }

    public archetypeSubmit(): void {
        console.log("It's here");

        this.router.navigate(['/page-structure']).then(success => {
            console.log('Navigation result:', success);
        });
        /*if (this.archetypeFrm.invalid) {
            this.startValidation = true;
            this.archetypeFrm.markAllAsTouched();
        } else {
            const groupValue = this.archetypeFrm.get('archetypeFrmGroupOne')?.value;
            console.log(groupValue);
        }*/
    }

    public onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const content = reader.result as string;
            this.fileContent = content;
            this.detailIsDefault = false;

            this.archetypeFrm.patchValue({archetypeFrmGroupOne: {archetypeDetail: content}});
            this.archetypeFrm.get('archetypeFrmGroupOne.archetypeDetail')?.updateValueAndValidity();
        };

        reader.readAsText(file);
        this.btnCreateStructure.nativeElement.focus();
    }

    private encodeBase64(text: string): string {
        return window.btoa(new TextEncoder().encode(text).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    }
}