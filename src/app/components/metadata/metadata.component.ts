import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {MetadataValidation} from 'src/app/common/validators/metadatavalidation';
import {HttpclientService} from 'src/app/services/httpclient.service';
import {Hyperparameters} from "../../common/interface/hyperparameters";
import {HyperparametersItems} from "../../common/interface/hyperparametersItems";

@Component({
    selector: 'app-metadata',
    templateUrl: './metadata.component.html',
    styleUrls: ['./metadata.component.css'],
})
export class MetadataComponent implements OnInit {
    private readonly _basePath = 'http://localhost:3000/api/udphyperparameters/v1';
    private readonly _title = '/title';
    private readonly _description = '/description';
    private readonly _databases = '/databases';
    private readonly _architectures = '/architectures';
    private readonly _databasesEngineer = '/databases-engineer';
    private readonly _environments = '/environments';
    private readonly _forms = '/forms';

    public metadataFormGroup!: FormGroup;
    public readonly title: Hyperparameters = {message: ''};
    public readonly description: Hyperparameters = {message: ''};
    public architectures: HyperparametersItems[] = [{id: 0, data: ''}];
    public databases: HyperparametersItems[] = [{id: 0, data: ''}];
    public databasesEngineer: HyperparametersItems[] = [{id: 0, data: ''}];
    public environments: HyperparametersItems[] = [{id: 0, data: ''}];
    public forms: HyperparametersItems[] = [{id: 0, data: ''}];

    public fileContent: string | ArrayBuffer | null = '';

    public startValidation: boolean = false;

    constructor(
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

    private setTitle(): void {
        this.metadataService.getData$(`${this._basePath}${this._title}`).subscribe((response) => {
            this.title.message = response.message;
        });
    }

    private setDescription(): void {
        this.metadataService.getData$(`${this._basePath}${this._description}`).subscribe((response) => {
            this.description.message = response.message;
        });
    }

    private setArchitectures(): void {
        this.metadataService.getDataItems$(`${this._basePath}${this._architectures}`).pipe(
            map(response => {
                return response;
            }))
            .subscribe(transformedResponse => {
                this.architectures = transformedResponse;
            });
    }

    private setDatabases(): void {
        this.metadataService.getDataItems$(`${this._basePath}${this._databases}`).pipe(
            map(response => {
                return response;
            }))
            .subscribe(transformedResponse => {
                this.databases = transformedResponse;
            });
    }

    private setDatabasesEngineer(): void {
        this.metadataService.getDataItems$(`${this._basePath}${this._databasesEngineer}`).pipe(
            map(response => {
                return response;
            }))
            .subscribe(transformedResponse => {
                this.databasesEngineer = transformedResponse;
            });
    }

    private setEnvironments(): void {
        this.metadataService.getDataItems$(`${this._basePath}${this._environments}`).pipe(
            map(response => {
                return response;
            }))
            .subscribe(transformedResponse => {
                this.environments = transformedResponse;
            });
    }

    private setForms(): void {
        this.metadataService.getDataItems$(`${this._basePath}${this._forms}`).pipe(
            map(response => {
                return response;
            }))
            .subscribe(transformedResponse => {
                this.forms = transformedResponse;
            });
    }

    public itemDescriptionFromList(itemId: number, itemData: string): string {
        return itemId === 0 ? 'Items' : itemData;
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
