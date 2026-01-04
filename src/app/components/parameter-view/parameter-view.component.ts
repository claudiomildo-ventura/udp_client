import {CommonModule} from "@angular/common";
import {AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {ArchetypeGenerate} from "src/app/shared/interface/archetype-generate";
import {TECHNICAL_LOGGER} from "src/config/technical-logger";
import {ENVIRONMENT} from "src/environments/environment";
import {ArchetypeService} from "../../core/services/archetype.service";
import {DialogService} from "../../core/services/dialog.service";
import {IndexedDbService} from "../../core/services/indexed-db.service";
import {MaterialModule} from "../../material.module";
import {PARAMETERS_LABEL} from "../../shared/constant/form-label";
import {Field} from "../../shared/interface/Field";
import {ParameterListResponse} from "../../shared/interface/parameter-list-response";
import {Table} from "../../shared/interface/Table";
import {NUMBER_CONSTANT} from "../../shared/NumberConstant";
import {StringFunc} from "../../shared/string-utils/StringFunc";

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
export class ParameterViewComponent implements OnInit, AfterViewInit {
    public architectureTitle: WritableSignal<string> = signal(StringFunc.STRING_EMPTY);
    public databasePlatformTitle: WritableSignal<string> = signal(StringFunc.STRING_EMPTY);
    public databaseEngineerTitle: WritableSignal<string> = signal(StringFunc.STRING_EMPTY);
    public engineeringPlatformTitle: WritableSignal<string> = signal(StringFunc.STRING_EMPTY);
    public templateTitle: WritableSignal<string> = signal(StringFunc.STRING_EMPTY);
    public projectTemplateTitle: WritableSignal<string> = signal(StringFunc.STRING_EMPTY);

    public architectures: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public databasePlatforms: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public databaseEngineers: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public engineeringPlatforms: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public templates: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public projectTemplates: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);

    public isPageLoading: boolean = true;
    private readonly router: Router = inject(Router);
    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly dialogService: DialogService = inject(DialogService);
    private readonly indexedDbService: IndexedDbService = inject(IndexedDbService);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    @ViewChild('lblArchitecture') lblArchitecture!: ElementRef<HTMLElement>;
    @ViewChild('lblDatabasePlatform') lblDatabasePlatform!: ElementRef<HTMLElement>;
    @ViewChild('lblDatabaseEngineer') lblDatabaseEngineer!: ElementRef<HTMLElement>;
    @ViewChild('lblEngineeringPlatform') lblEngineeringPlatform!: ElementRef<HTMLElement>;
    @ViewChild('lblTemplate') lblTemplate!: ElementRef<HTMLElement>;
    @ViewChild('lblProjectTemplate') lblProjectTemplate!: ElementRef<HTMLElement>;

    public frm: FormGroup = this.fb.group({
        architectures: [0],
        databasePlatforms: [0],
        databaseEngineers: [0],
        engineeringPlatforms: [0],
        templates: [0],
        projectTemplates: [0]
    });

    ngOnInit(): void {
        this.allTitleComponentsInitialize();
        this.allListComponentsInitialize();
        this.allTemplateComponentsInitialize();
    }

    ngAfterViewInit(): void {
        this.progressBarInitialize();
    }

    public async submit(): Promise<void> {
        if (this.frm.invalid) {
            void this.dialogService.alert('Form inválido!');
            return;
        }

        this.isPageLoading = true;

        setTimeout(async (): Promise<void> => {
            await this.dataPost();
            await this.navigateToPageHome();
            this.isPageLoading = false;
        }, 2000);
    }

    private async navigateToPageHome(): Promise<void> {
        await this.router.navigate(['/page-home'], {}).then(success => TECHNICAL_LOGGER.info(`Navigation result: ${success}`));
    }

    private progressBarInitialize(): void {
        setTimeout((): void => {
            this.isPageLoading = false;
        }, 1000);
    }

    private async dataPost(): Promise<void> {
        const tablesData: any[] = await this.indexedDbService.getColumns();

        const tables: Table[] = [];

        for (const element of tablesData) {
            const t = element;

            const table: Table = {
                id: t.id,
                name: t.name,
                type: t.type,
                isAutoCreated: t.isAutoCreated,
                fields: []
            };

            for (const element of t.fields) {
                const column = element;

                const field: Field = {
                    id: column.id,
                    tableRelationId: column.tableRelationId,
                    columnName: column.columnName,
                    type: column.type,
                    index: column.index,
                    length: column.length,
                    sequence: column.sequence,
                    isAutoCreated: column.isAutoCreated,
                    isPrimaryKey: column.isPrimaryKey,
                    isForeignKey: column.isForeignKey,
                    isIndex: column.isIndex,
                    isNotNull: column.isNotNull
                };

                table.fields.push(field);
            }
            tables.push(table);
        }

        const archetypeGenerate: ArchetypeGenerate = {
            architectures: this.frm.value.architectures,
            databasePlatforms: this.frm.value.databasePlatforms,
            databaseEngineers: this.frm.value.databaseEngineers,
            engineeringPlatforms: this.frm.value.engineeringPlatforms,
            templates: this.frm.value.templates,
            projectTemplates: this.frm.value.projectTemplates,
            tables: tables
        };

        try {
            await this.archetypeService.postMapping<void>(
                `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.generate_solution}`,
                archetypeGenerate
            );
            void this.dialogService.info('Solution generated successfully.');
        } catch (ex) {
            void this.dialogService.alert('Error generating solution:' + ex);
        }
    }

    private allTitleComponentsInitialize(): void {
        this.architectureTitle.set(StringFunc.STRING_EMPTY);
        this.databasePlatformTitle.set(StringFunc.STRING_EMPTY);
        this.databaseEngineerTitle.set(StringFunc.STRING_EMPTY);
        this.engineeringPlatformTitle.set(StringFunc.STRING_EMPTY);
        this.templateTitle.set(StringFunc.STRING_EMPTY);
        this.projectTemplateTitle.set(StringFunc.STRING_EMPTY);
    }

    private allListComponentsInitialize(): void {
        this.architectures.set([]);
        this.databasePlatforms.set([]);
        this.databaseEngineers.set([]);
        this.engineeringPlatforms.set([]);
        this.templates.set([]);
        this.projectTemplates.set([]);
    }

    private allTemplateComponentsInitialize(): void {
        void this.architecturesInitialize();
        void this.dtbPlatformInitialize();
        void this.dtbEngineerInitialize();
        void this.engPlatformInitialize();
        void this.templatesInitialize();
        void this.scaffoldsInitialize();
    }

    private async architecturesInitialize(): Promise<void> {
        this.architectureTitle.set(PARAMETERS_LABEL.ARCHITECTURE);
        this.architectures.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.architectures}`));
        this.frm.patchValue({architecture: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async dtbPlatformInitialize(): Promise<void> {
        this.databasePlatformTitle.set(PARAMETERS_LABEL.DATABASE_PLATFORM);
        this.databasePlatforms.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.database_platforms}`));
        this.frm.patchValue({databasePlatform: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async dtbEngineerInitialize(): Promise<void> {
        this.databaseEngineerTitle.set(PARAMETERS_LABEL.DATABASE_ENGINEER);
        this.databaseEngineers.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.database_engineers}`));
        this.frm.patchValue({databaseEngineer: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async engPlatformInitialize(): Promise<void> {
        this.engineeringPlatformTitle.set(PARAMETERS_LABEL.ENGINEERING_PLATFORM);
        this.engineeringPlatforms.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.engineering_platforms}`));
        this.frm.patchValue({engineeringPlatform: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async templatesInitialize(): Promise<void> {
        this.templateTitle.set(PARAMETERS_LABEL.TEMPLATE);
        this.templates.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.templates}`));
        this.frm.patchValue({template: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async scaffoldsInitialize(): Promise<void> {
        this.projectTemplateTitle.set(PARAMETERS_LABEL.PROJECT_TEMPLATE);
        this.projectTemplates.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.project_templates}`));
        this.frm.patchValue({projectTemplate: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }
}