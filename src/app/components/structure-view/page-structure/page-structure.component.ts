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
import {MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {Field} from "../../../shared/interface/Field";

@Component({
    selector: 'page-structure',
    standalone: true,
    imports: [CommonModule, MatTable, MatTableModule, PageTitleComponent, MatCheckbox, MatSort, PageEndComponent, MatCardTitle, MatCardSubtitle, MatCardHeader, MatCard, MatCardActions],
    templateUrl: './page-structure.component.html',
    styleUrl: './archetype-structure-app.component.css'
})
export class PageStructureComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSort) sort!: MatSort;

    private detailContent: unknown;
    public readonly obj: ApiResponse<any> = {data: ''};
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);
    public readonly selectionModel: SelectionModel<Field> = new SelectionModel<Field>(true, []); // true = multiple selection

    public tables: any[] = [];
    dtsTablesCols: string[] = ['id', 'name', 'fields'];
    dtsTablesColsWithSelect: string[] = ['select', ...this.dtsTablesCols];
    public dtsTables: MatTableDataSource<any> = new MatTableDataSource<any>();

    ngOnInit(): void {
        const {detailContent} = history.state ?? {};
        this.getDetail(detailContent);
    }

    ngAfterViewInit(): void {
        this.dataPost();
    }

    toggleRow(row: any): void {
        this.selectionModel.toggle(row);
    }

    isAllSelected(table: any): boolean {
        const numSelected: number = this.selectionModel.selected.filter(f => table.fields.includes(f)).length;
        const numRows: any = table.fields.length;
        return numSelected === numRows;
    }

    masterToggle(table: Table): void {
        this.isAllSelected(table)
            ? table.fields.forEach((f: Field) => this.selectionModel.deselect(f))
            : table.fields.forEach((f: Field) => this.selectionModel.select(f));
    }

    public getDetail(detail: unknown): string {
        return this.detailContent = detail as string;
    }

    private initializeForm(tablesResponse: TableResponse): void {
        this.tables = tablesResponse.tables;
        this.dtsTables = new MatTableDataSource<Table>(this.tables);
        this.dtsTables.sort = this.sort;
        this.dtsTables.data.forEach(row => this.selectionModel.select(row));
    }

    private async dataPost(): Promise<void> {
        const url: string = `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.structure}`;
        const response: TableResponse = await this.archetypeService.postMapping<TableResponse>(url, {data: this.detailContent});
        this.initializeForm(response);
    }
}