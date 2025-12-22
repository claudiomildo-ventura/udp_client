import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {ArchetypeService} from "../../../core/services/archetype.service";
import {ApiResponse} from "../../../shared/interface/ApiResponse";
import {ENVIRONMENT} from "../../../../environments/environment";
import {TableResponse} from "../../../shared/interface/TablesResponse";
import {CommonModule} from "@angular/common";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";
import {Table} from "../../../shared/interface/Table";
import {Field} from "../../../shared/interface/Field";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../../material.module";
import {IndexedDbService} from "../../../core/services/indexed-db.service";
import {TECHNICAL_LOGGER} from "../../../../config/technical-logger";
import {Router} from "@angular/router";

@Component({
    selector: 'page-structure',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule
    ],
    templateUrl: './page-structure.component.html',
    styleUrl: './archetype-structure-app.component.css'
})
export class PageStructureComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSort) sort!: MatSort;

    public frmStructurePage!: FormGroup;
    private detailContent: unknown;
    public readonly obj: ApiResponse<any> = {data: ''};
    public selectionModel: SelectionModel<Field> = new SelectionModel<Field>(true, []);
    private readonly formBuilder: FormBuilder = inject(FormBuilder);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);
    private readonly indexedDbService: IndexedDbService = inject(IndexedDbService);
    private readonly router: Router = inject(Router);

    public tables: any[] = [];
    public dtsTablesCols: string[] = ['fields'];
    public dtsTables: MatTableDataSource<any> = new MatTableDataSource<any>();
    public isPageLoading: boolean = true;

    ngOnInit(): void {
        this.getDetailFromDashboardForm();
        this.formActive();
    }

    ngAfterViewInit(): void {
        this.progressBarInitialize();
    }

    public submit(): void {
        if (this.frmStructurePage.invalid || this.selectionModel.selected.length === 0) return;

        const tablesWithFields: Table[] = this.getAllTablesWithFieldsFromStructureForm()
        //this.save(tablesWithFields);
        this.navigateToPageParameter();
    }

    public toggleRow(row: any): void {
        this.selectionModel.toggle(row);
    }

    public toggleAll(table: Table): void {
        this.isAllSelected(table)
            ? table.fields.forEach((f: Field) => this.selectionModel.deselect(f))
            : table.fields.forEach((f: Field) => this.selectionModel.select(f));
    }

    public isAllSelected(table: any): boolean {
        const numSelected: number = this.selectionModel.selected.filter(f => table.fields.includes(f)).length;
        const numRows: any = table.fields.length;
        return numSelected === numRows;
    }

    private selectingAllCheckboxesOnLoad(): void {
        this.selectionModel.select(...this.tables.flatMap(t => t.fields));
    }

    private getDetailFromDashboardForm(): void {
        const {detailContent} = history.state ?? {};
        this.detailContent = detailContent as string;
    }

    private dtsTablesInitialize(tables: Table[]): void {
        this.tables = tables;
        this.dtsTables = new MatTableDataSource<Table>(this.tables);
    }

    private dataSourceSort(): void {
        this.dtsTables.sort = this.sort;
    }

    private formShow(tablesResponse: TableResponse): void {
        this.dtsTablesInitialize(tablesResponse.tables);
        this.dataSourceSort();
        this.selectingAllCheckboxesOnLoad();
    }

    private formActive(): void {
        this.frmStructurePage = this.formBuilder.group({
            group1: this.formBuilder.group({})
        });
    }

    private progressBarInitialize(): void {
        setTimeout((): void => {
            this.dataPost();
            this.isPageLoading = false;
        }, 1000);
    }

    private getAllTablesWithFieldsFromStructureForm(): Table[] {
        return this.dtsTables.data
            .map((table: Table) => ({
                ...table,
                fields: table.fields.filter((field: Field): boolean =>
                    this.selectionModel.isSelected(field))
            }))
            .filter(table => table.fields.length > 0);
    }

    private navigateToPageParameter(): void {
        this.router.navigate(['/page-parameter'], {
        }).then(success => TECHNICAL_LOGGER.info(`Navigation result: ${success}`));
    }

    private async dataPost(): Promise<void> {
        const url: string = `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.structure}`;
        const response: TableResponse = await this.archetypeService.postMapping<TableResponse>(url, {data: this.detailContent});
        this.formShow(response);
    }

    private async save(columns: any): Promise<void> {
        try {
            await this.indexedDbService.addColumns(columns);
        } catch (err) {
            console.error(err);
        }
    }
}