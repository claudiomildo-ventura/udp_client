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

    public architectureList: ParameterListResponse[] = [];
    public dtbPlatformList: ParameterListResponse[] = [];
    public dtbEngineerList: ParameterListResponse[] = [];
    public engPlatformList: ParameterListResponse[] = [];
    public templateList: ParameterListResponse[] = [];
    public scaffoldList: ParameterListResponse[] = [];

    @ViewChild('lblArchitecture') lblArchitecture!: ElementRef<HTMLElement>;
    @ViewChild('lblDbPlatform') lblDbPlatform!: ElementRef<HTMLElement>;
    @ViewChild('lblDbEngineer') lblDbEngineer!: ElementRef<HTMLElement>;
    @ViewChild('lblEnvironment') lblEnvironment!: ElementRef<HTMLElement>;
    @ViewChild('lblTemplate') lblTemplate!: ElementRef<HTMLElement>;
    @ViewChild('lblScaffold') lblScaffold!: ElementRef<HTMLElement>;

    public isPageLoading: boolean = true;
    private readonly router: Router = inject(Router);
    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly dialogService: DialogService = inject(DialogService);
    private readonly indexedDbService: IndexedDbService = inject(IndexedDbService);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);

    public frm: FormGroup = this.fb.group({
        architecture: [0],
        dtbPlatform: [0],
        dtbEngineer: [0],
        engPlatform: [0],
        template: [0],
        scaffold: [0]
    });

    ngOnInit(): void {
        void this.architecturesInitialize();
        void this.dtbPlatformInitialize();
        void this.dtbEngineerInitialize();
        void this.engPlatformInitialize();
        void this.templatesInitialize();
        void this.scaffoldsInitialize();
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
            dbPlatform: this.frm.value.dtbPlatform,
            dbEngineer: this.frm.value.dtbEngineer,
            engPlatform: this.frm.value.engPlatform,
            template: this.frm.value.template,
            scaffold: this.frm.value.scaffold,
            tables: tables
        };

        try {
            await this.archetypeService.postMapping<void>(
                `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.generateSolution}`,
                archetypeGenerate
            );
            void this.dialogService.info('Solution generated successfully.');
        } catch (ex) {
            void this.dialogService.alert('Error generating solution:' + ex);
        }
    }

    private async architecturesInitialize(): Promise<void> {
        this.architectureTitle.set(PARAMETERS_LABEL.ARCHITECTURE);
        this.architectureList = await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.architectures}`);
        this.frm.patchValue({architecture: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async dtbPlatformInitialize(): Promise<void> {
        this.dtbPlatformTitle.set(PARAMETERS_LABEL.DTB_PLATFORM);
        this.dtbPlatformList = await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.dtb_platform}`);
        this.frm.patchValue({dtbPlatform: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async dtbEngineerInitialize(): Promise<void> {
        this.dtbEngineerTitle.set(PARAMETERS_LABEL.DTB_ENGINEER);
        this.dtbEngineerList = await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.dtb_engineer}`);
        this.frm.patchValue({dtbEngineer: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async engPlatformInitialize(): Promise<void> {
        this.engPlatformTitle.set(PARAMETERS_LABEL.ENG_PLATFORM);
        this.engPlatformList = await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.eng_platform}`);
        this.frm.patchValue({engPlatform: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async templatesInitialize(): Promise<void> {
        this.templateTitle.set(PARAMETERS_LABEL.TEMPLATE);
        this.templateList = await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.templates}`);
        this.frm.patchValue({template: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }

    private async scaffoldsInitialize(): Promise<void> {
        this.scaffoldTitle.set(PARAMETERS_LABEL.SCAFFOLD);
        this.scaffoldList = await this.archetypeService.getMappingList<ParameterListResponse[]>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.scaffolds}`);
        this.frm.patchValue({scaffold: NUMBER_CONSTANT.INITIALIZE_WITH_0});
    }
}