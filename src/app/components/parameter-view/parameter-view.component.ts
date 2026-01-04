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
    public dtbPlatformTitle: WritableSignal<string> = signal(StringFunc.STRING_EMPTY);
    public dtbEngineerTitle: WritableSignal<string> = signal(StringFunc.STRING_EMPTY);
    public engPlatformTitle: WritableSignal<string> = signal(StringFunc.STRING_EMPTY);
    public templateTitle: WritableSignal<string> = signal(StringFunc.STRING_EMPTY);
    public scaffoldTitle: WritableSignal<string> = signal(StringFunc.STRING_EMPTY);

    public architectureList: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public dtbPlatformList: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public dtbEngineerList: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public engPlatformList: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public templateList: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);
    public scaffoldList: WritableSignal<ParameterListResponse[]> = signal<ParameterListResponse[]>([]);

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
        architecture: [0],
        databasePlatform: [0],
        databaseEngineer: [0],
        engineeringPlatform: [0],
        template: [0],
        projectTemplate: [0]
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
            architecture: this.frm.value.architecture,
            databasePlatform: this.frm.value.databasePlatform,
            databaseEngineer: this.frm.value.databaseEngineer,
            engineeringPlatform: this.frm.value.engineeringPlatform,
            template: this.frm.value.template,
            projectTemplate: this.frm.value.projectTemplate,
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
        this.dtbPlatformTitle.set(StringFunc.STRING_EMPTY);
        this.dtbEngineerTitle.set(StringFunc.STRING_EMPTY);
        this.engPlatformTitle.set(StringFunc.STRING_EMPTY);
        this.templateTitle.set(StringFunc.STRING_EMPTY);
        this.scaffoldTitle.set(StringFunc.STRING_EMPTY);
    }

    private allListComponentsInitialize(): void {
        this.architectureList.set([]);
        this.dtbPlatformList.set([]);
        this.dtbEngineerList.set([]);
        this.engPlatformList.set([]);
        this.templateList.set([]);
        this.scaffoldList.set([]);
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
        this.architectureList.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.architecture}`));
        this.frm.patchValue({architecture: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async dtbPlatformInitialize(): Promise<void> {
        this.dtbPlatformTitle.set(PARAMETERS_LABEL.DTB_PLATFORM);
        this.dtbPlatformList.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.database_platform}`));
        this.frm.patchValue({databasePlatform: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async dtbEngineerInitialize(): Promise<void> {
        this.dtbEngineerTitle.set(PARAMETERS_LABEL.DTB_ENGINEER);
        this.dtbEngineerList.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.database_engineer}`));
        this.frm.patchValue({databaseEngineer: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async engPlatformInitialize(): Promise<void> {
        this.engPlatformTitle.set(PARAMETERS_LABEL.ENG_PLATFORM);
        this.engPlatformList.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.engineering_platform}`));
        this.frm.patchValue({engineeringPlatform: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async templatesInitialize(): Promise<void> {
        this.templateTitle.set(PARAMETERS_LABEL.TEMPLATE);
        this.templateList.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.template}`));
        this.frm.patchValue({template: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async scaffoldsInitialize(): Promise<void> {
        this.scaffoldTitle.set(PARAMETERS_LABEL.SCAFFOLD);
        this.scaffoldList.set(await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.project_template}`));
        this.frm.patchValue({projectTemplate: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }
}