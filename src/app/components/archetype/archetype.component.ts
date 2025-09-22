import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {MetadataValidation} from 'src/app/shared/validator/metadatavalidation';
import {HttpclientService} from 'src/app/core/services/httpclient.service';
import {Hyperparameters} from "../../shared/interface/hyperparameters";
import {HyperparametersItems} from "../../shared/interface/hyperparametersItems";
import {ArchetypeService} from "../../core/services/archetype.service";

@Component({
    selector: 'app-archetype',
    templateUrl: './archetype.component.html',
    styleUrls: ['./archetype.component.css'],
})
export class ArchetypeComponent implements OnInit {
    private readonly _basePath: string = 'http://localhost:3000/api/udphyperparameters/v1';
    private readonly _title: string = '/title';
    private readonly _description: string = '/description';
    private readonly _databases: string = '/databases';
    private readonly _architectures: string = '/architectures';
    private readonly _databasesEngineer: string = '/databases-engineer';
    private readonly _environments: string = '/environments';
    private readonly _forms: string = '/forms';

    private DEFAULT_ITEM_ID: number = 0;
    private DEFAULT_ITEM_LABEL: string = 'Items';

    public readonly title: Hyperparameters = {data: ''};
    public readonly description: Hyperparameters = {data: ''};
    public architectures: HyperparametersItems[] = [{id: 0, data: ''}];
    public databases: HyperparametersItems[] = [{id: 0, data: ''}];
    public databasesEngineer: HyperparametersItems[] = [{id: 0, data: ''}];
    public environments: HyperparametersItems[] = [{id: 0, data: ''}];
    public forms: HyperparametersItems[] = [{id: 0, data: ''}];

    public metadataFormGroup!: FormGroup;
    public fileContent: string | ArrayBuffer | null = '';

    public startValidation: boolean = false;

    constructor(
        private archetypeService: ArchetypeService,
        private metadataService: HttpclientService,
        private formBuilder: FormBuilder,
        private changeDetector: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.loadMetadata();
        this.createMetadataForm();
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

    private loadMetadata(): void {
        this.setTitle();
        this.setDescription();
        this.setArchitectures();
        this.setDatabases();
        this.setDatabasesEngineer();
        this.setEnvironments();
        this.setForms();
    }

    private async setTitle(): Promise<void> {
        this.title.data = await this.archetypeService.getData(`${this._basePath}${this._title}`);
    }

    private async setDescription(): Promise<void> {
        this.description.data = await this.archetypeService.getData(`${this._basePath}${this._description}`);
    }

    private async setArchitectures(): Promise<void> {
        this.architectures = await this.archetypeService.getDataItems(`${this._basePath}${this._architectures}`);
    }

    private async setDatabases(): Promise<void> {
        this.databases = await this.archetypeService.getDataItems(`${this._basePath}${this._databases}`);
    }

    private async setDatabasesEngineer(): Promise<void> {
        this.databasesEngineer = await this.archetypeService.getDataItems(`${this._basePath}${this._databasesEngineer}`);
    }

    private async setEnvironments(): Promise<void> {
        this.environments = await this.archetypeService.getDataItems(`${this._basePath}${this._environments}`);
    }

    private async setForms(): Promise<void> {
        this.forms = await this.archetypeService.getDataItems(`${this._basePath}${this._forms}`);
    }

    public itemDescriptionFromList(itemId: number, itemData: string): string {
        return itemId === this.DEFAULT_ITEM_ID ? this.DEFAULT_ITEM_LABEL : itemData;
    }

    public createMetadataForm(): void {
        let formInitialValue: string = '0';

        this.metadataFormGroup = this.formBuilder.group({
            metadata: this.formBuilder.group({
                metadataFormDescription: new FormControl('', [Validators.required, Validators.minLength(2), MetadataValidation.notOnlyWhitespace, MetadataValidation.textContainsInicialValue]),
            }),
            metadataItemList: this.formBuilder.group({
                metadataFormArchitecture: new FormControl(formInitialValue, [Validators.required, Validators.min(1)]),
                metadataFormDatabase: new FormControl(formInitialValue, [Validators.required, Validators.min(1)]),
                metadataFormDatabaseEngineer: new FormControl(formInitialValue, [Validators.required, Validators.min(1)]),
                metadataFormDevelopmentEnvironment: new FormControl(formInitialValue, [Validators.required, Validators.min(1)]),
                metadataFormForm: new FormControl(formInitialValue, [Validators.required, Validators.min(1)]),
            }),
        });
    }

    get getDescription() {
        return this.metadataFormGroup.get('metadata.metadataFormDescription');
    }

    get getArchitecture() {
        return this.metadataFormGroup.get('metadataItemList.metadataFormArchitecture');
    }

    get getDatabase() {
        return this.metadataFormGroup.get('metadataItemList.metadataFormDatabase');
    }

    get getDatabaseEngineer() {
        return this.metadataFormGroup.get('metadataItemList.metadataFormDatabaseEngineer');
    }

    get getDevelopmentEnvironment() {
        return this.metadataFormGroup.get('metadataItemList.metadataFormDevelopmentEnvironment');
    }

    get getForm() {
        return this.metadataFormGroup.get('metadataItemList.metadataFormForm');
    }

    public metadataFormSubmit(): void {
        console.log('Form here');

        if (this.metadataFormGroup.invalid) {
            this.startValidation = true;
            this.metadataFormGroup.markAllAsTouched();
        } else {
            console.log(this.metadataFormGroup.get('metadata')?.value);
            console.log(this.metadataFormGroup.get('metadataItemList')?.value);
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
