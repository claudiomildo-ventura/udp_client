import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {ArchetypeService} from "../../../core/services/archetype.service";
import {ApiResponse} from "../../../shared/interface/ApiResponse";
import {ENVIRONMENT} from "../../../../environments/environment";
import {TableResponse} from "../../../shared/interface/TablesResponse";
import {CommonModule} from "@angular/common";
import {MatTable, MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {PageTitleComponent} from "../../dashboard-view/page-title/page-title.component";
import {SelectionModel} from "@angular/cdk/collections";
import {MatCheckbox} from "@angular/material/checkbox";
import {PageEndComponent} from "../../dashboard-view/page-end/page-end.component";
import {Table} from "../../../shared/interface/Table";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {Field} from "../../../shared/interface/Field";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
    selector: 'page-structure',
    standalone: true,
    imports: [CommonModule,
        MatTable,
        MatTableModule,
        PageTitleComponent,
        MatCheckbox,
        PageEndComponent,
        MatCardTitle,
        MatCardSubtitle,
        MatCardHeader,
        MatCard,
        MatCardActions,
        MatProgressSpinnerModule, MatCardContent, MatSort],
    templateUrl: './page-structure.component.html',
    styleUrl: './archetype-structure-app.component.css'
})
export class PageStructureComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSort) sort!: MatSort;

    private detailContent: unknown;
    public readonly obj: ApiResponse<any> = {data: ''};
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);
    public selectionModel: SelectionModel<Field> = new SelectionModel<Field>(true, []);

    public tables: any[] = [];
    dtsTablesCols: string[] = ['id', 'name', 'fields'];
    public dtsTables: MatTableDataSource<any> = new MatTableDataSource<any>();

    public isPageLoading: boolean = true;

    ngOnInit(): void {
        const {detailContent} = history.state ?? {};
        this.getDetail(detailContent);
    }

    ngAfterViewInit(): void {
        this.initializeProgressBar();
    }

    public toggleRow(row: any): void {
        this.selectionModel.toggle(row);
    }

    public isAllSelected(table: any): boolean {
        const numSelected: number = this.selectionModel.selected.filter(f => table.fields.includes(f)).length;
        const numRows: any = table.fields.length;
        return numSelected === numRows;
    }

    public masterToggle(table: Table): void {
        this.isAllSelected(table)
            ? table.fields.forEach((f: Field) => this.selectionModel.deselect(f))
            : table.fields.forEach((f: Field) => this.selectionModel.select(f));
    }

    public getDetail(detail: unknown): string {
        return this.detailContent = detail as string;
    }

    private initializeProgressBar(): void {
        setTimeout((): void => {
            this.dataPost();
            this.isPageLoading = false;
        }, 1000);
    }

    private initializeForm(tablesResponse: TableResponse): void {
        this.tables = tablesResponse.tables;
        this.dtsTables = new MatTableDataSource<Table>(this.tables);
        this.dataSourceSort();
        this.selectingAllCheckboxesOnLoad();
    }

    private dataSourceSort(): void {
        this.dtsTables.sort = this.sort;
    }

    private selectingAllCheckboxesOnLoad(): void {
        this.selectionModel.select(...this.tables.flatMap(t => t.fields));
    }

    private async dataPost(): Promise<void> {
        const url: string = `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.structure}`;
        const response: TableResponse = await this.archetypeService.postMapping<TableResponse>(url, {data: this.detailContent});
        this.initializeForm(response);
    }
}