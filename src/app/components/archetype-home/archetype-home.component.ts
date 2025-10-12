import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MetadataValidation} from 'src/app/shared/validator/metadatavalidation';
import {Hyperparameters} from "../../shared/interface/hyperparameters";
import {HyperparametersItems} from "../../shared/interface/hyperparametersItems";
import {ArchetypeService} from "../../core/services/archetype.service";
import {CommonModule} from "@angular/common";
import {environment} from 'src/environments/environment';

@Component({
    selector: 'archetype-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './archetype-home.component.html',
    styleUrls: ['./archetype-home.component.css'],
})
export class ArchetypeHomeComponent implements OnInit {

    btnCreate: string = '';
    private ID_DEFAULT_ITEM: number = 0;
    private LABEL_DEFAULT_ITEM: string = 'Items';

    public detail: Hyperparameters = {data: ''};
    public architectures: HyperparametersItems[] = [{id: 0, data: ''}];
    public databases: HyperparametersItems[] = [{id: 0, data: ''}];
    public databasesEngineer: HyperparametersItems[] = [{id: 0, data: ''}];
    public environments: HyperparametersItems[] = [{id: 0, data: ''}];
    public forms: HyperparametersItems[] = [{id: 0, data: ''}];
    public scaffolds: HyperparametersItems[] = [{id: 0, data: ''}];

    public archetypeFrm!: FormGroup;
    public fileContent: string | ArrayBuffer | null = '';

    public startValidation: boolean = false;

    constructor(private formBuilder: FormBuilder,
                private changeDetector: ChangeDetectorRef,
                private archetypeService: ArchetypeService
    ) {
    }

    ngOnInit(): void {
        this.btnCreate = environment.btnCreate;
        this.setDescription();
        this.setArchitectures();
        this.setDatabases();
        this.setDatabasesEngineer();
        this.setEnvironments();
        this.setForms();
        this.setScaffolds();
        this.archetypeFormCreate();
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

    private async setDescription(): Promise<void> {
        this.detail.data = await this.archetypeService.getData(`${environment.basePath}${environment.endpoints.detail}`);
    }

    private async setArchitectures(): Promise<void> {
        this.architectures = await this.archetypeService.getDataItems(`${environment.basePath}${environment.endpoints.architectures}`);
    }

    private async setDatabases(): Promise<void> {
        this.databases = await this.archetypeService.getDataItems(`${environment.basePath}${environment.endpoints.databases}`);
    }

    private async setDatabasesEngineer(): Promise<void> {
        this.databasesEngineer = await this.archetypeService.getDataItems(`${environment.basePath}${environment.endpoints.databasesEngineer}`);
    }

    private async setEnvironments(): Promise<void> {
        this.environments = await this.archetypeService.getDataItems(`${environment.basePath}${environment.endpoints.environments}`);
    }

    private async setForms(): Promise<void> {
        this.forms = await this.archetypeService.getDataItems(`${environment.basePath}${environment.endpoints.forms}`);
    }

    private async setScaffolds(): Promise<void> {
        this.scaffolds = await this.archetypeService.getDataItems(`${environment.basePath}${environment.endpoints.scaffold}`);
    }

    public setItemDescriptionDefault(id: number, data: string): string {
        return id === this.ID_DEFAULT_ITEM ? this.LABEL_DEFAULT_ITEM : data;
    }

    public archetypeFormCreate(): void {

        this.archetypeFrm = this.formBuilder.group({
            archetypeFrmGroupOne: this.formBuilder.group({
                archetypeDetail: new FormControl('', [Validators.required, Validators.minLength(2), MetadataValidation.notOnlyWhitespace, MetadataValidation.textContainsInicialValue]),}),
            archetypeFrmGroupTwo: this.formBuilder.group({
                archetypeScaffold: new FormControl(String('0'), [Validators.required, Validators.min(1)]),
                archetypeArchitectures: new FormControl(String('0'), [Validators.required, Validators.min(1)]),
                archetypeDatabases: new FormControl(String('0'), [Validators.required, Validators.min(1)]),
                archetypeDatabasesEngineer: new FormControl(String('0'), [Validators.required, Validators.min(1)]),
                archetypeEnvironments: new FormControl(String('0'), [Validators.required, Validators.min(1)]),
                archetypeForms: new FormControl(String('0'), [Validators.required, Validators.min(1)]),
            }),
        });
    }

    get getArchetypeDetail() {
        return this.archetypeFrm.get('archetypeFrmGroupOne.archetypeDetail');
    }

    get getArchetypeScaffold() {
        return this.archetypeFrm.get('archetypeFrmGroupTwo.archetypeScaffold');
    }

    get getArchetypeArchitectures() {
        return this.archetypeFrm.get('archetypeFrmGroupTwo.archetypeArchitectures');
    }

    get getArchetypeDatabases() {
        return this.archetypeFrm.get('archetypeFrmGroupTwo.archetypeDatabases');
    }

    get getArchetypeDatabasesEngineer() {
        return this.archetypeFrm.get('archetypeFrmGroupTwo.archetypeDatabasesEngineer');
    }

    get getArchetypeEnvironments() {
        return this.archetypeFrm.get('archetypeFrmGroupTwo.archetypeEnvironments');
    }

    get getArchetypeForms() {
        return this.archetypeFrm.get('archetypeFrmGroupTwo.archetypeForms');
    }

    public metadataFormSubmit(): void {
        console.log('Form here');

        if (this.archetypeFrm.invalid) {
            this.startValidation = true;
            this.archetypeFrm.markAllAsTouched();
        } else {
            console.log(this.archetypeFrm.get('archetypeFrmGroupOne')?.value);
            console.log(this.archetypeFrm.get('archetypeFrmGroupTwo')?.value);
        }
    }

    public onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result !== null) {
                    this.fileContent = reader.result;
                }
            };
            reader.readAsText(file);
        }
    }
}
