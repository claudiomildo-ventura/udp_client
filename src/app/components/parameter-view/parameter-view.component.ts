import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MaterialModule} from "../../material.module";
import {IndexedDbService} from "../../core/services/indexed-db.service";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {ENVIRONMENT} from "../../../environments/environment";
import {ParameterListResponse} from "../../shared/interface/parameter-list-response";
import {ArchetypeService} from "../../core/services/archetype.service";
import {NUMBER_CONSTANT} from "../../shared/NumberConstant";
import {PARAMETERS_LABEL} from "../../shared/constant/form-label";

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
export class ParameterViewComponent implements OnInit {
    public architectureTitle: string = '';
    public databaseTitle: string = '';
    public databaseEngineerTitle: string = '';
    public environmentTitle: string = '';
    public templateTitle: string = '';
    public scaffoldTitle: string = '';

    public architectureList: ParameterListResponse[] = [];
    public databaseList: ParameterListResponse[] = [];
    public databaseEngineerList: ParameterListResponse[] = [];
    public environmentList: ParameterListResponse[] = [];
    public templateList: ParameterListResponse[] = [];
    public scaffoldList: ParameterListResponse[] = [];

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly indexedDbService: IndexedDbService = inject(IndexedDbService);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    public form = this.fb.group({
        architecture: [0],
        database: [0],
        databaseEngineer: [0],
        environment: [0],
        template: [0],
        scaffold: [0]
    });

    async ngOnInit(): Promise<void> {
        await this.architecturesInitialize();
        await this.databasesInitialize();
        await this.databasesEngineerInitialize();
        await this.environmentsInitialize();
        await this.templatesInitialize();
        await this.scaffoldsInitialize();
    }

    public submit(): void {
        if (this.form.invalid) {
            console.warn('Form inválido!');
            return;
        }
        console.log('Selecionado:', this.form.value.architecture);
    }

    private async architecturesInitialize(): Promise<void> {
        this.architectureTitle = PARAMETERS_LABEL.ARCHITECTURE;
        this.architectureList = await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.architectures}`);
        this.form.patchValue({architecture: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async databasesInitialize(): Promise<void> {
        this.databaseTitle = PARAMETERS_LABEL.DATABASE;
        this.databaseList = await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.databases}`);
        this.form.patchValue({database: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async databasesEngineerInitialize(): Promise<void> {
        this.databaseEngineerTitle = PARAMETERS_LABEL.DATABASE_ENGINEER;
        this.databaseEngineerList = await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.databases_engineer}`);
        this.form.patchValue({databaseEngineer: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async environmentsInitialize(): Promise<void> {
        this.environmentTitle = PARAMETERS_LABEL.ENVIRONMENT;
        this.environmentList = await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.environments}`);
        this.form.patchValue({environment: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async templatesInitialize(): Promise<void> {
        this.templateTitle = PARAMETERS_LABEL.TEMPLATE;
        this.templateList = await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.templates}`);
        this.form.patchValue({template: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async scaffoldsInitialize(): Promise<void> {
        this.scaffoldTitle = PARAMETERS_LABEL.SCAFFOLD;
        this.scaffoldList = await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.scaffolds}`);
        this.form.patchValue({scaffold: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async load(): Promise<void> {
        try {
            await this.indexedDbService.getColumns();
        } catch (err) {
            console.error('Error saving/loading columns:', err);
        }
    }
}