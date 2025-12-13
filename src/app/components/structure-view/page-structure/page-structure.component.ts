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

@Component({
    selector: 'page-structure',
    standalone: true,
    imports: [CommonModule, MatTable, MatTableModule, PageTitleComponent, MatCheckbox, MatSort],
    templateUrl: './page-structure.component.html',
    styleUrl: './archetype-structure-app.component.css'
})
export class PageStructureComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSort) sort!: MatSort;

    public readonly obj: ApiResponse<any> = {data: ''};
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);
    private detailContent: unknown;
    public tableData: any[] = [];

    public readonly selection: SelectionModel<any> = new SelectionModel<any>(true, []); // true = multiple selection
    public readonly dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

    displayedColumns: string[] = ['id', 'name', 'type', 'length'];
    displayedColumnsWithSelect: string[] = ['select', ...this.displayedColumns];

    ngOnInit(): void {
        const {detailContent} = history.state ?? {};
        this.getDetail(detailContent);
    }

    ngAfterViewInit(): void {
        this.dataPost();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    public isAllElementSelected(): boolean {
        const numSelected: number = this.selection.selected.length;
        const numRows: number = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    public masterToggle(): void {
        this.isAllElementSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** Toggle a single row */
    public toggleRow(row: any): void {
        this.selection.toggle(row);
    }

    public getDetail(detail: unknown): string {
        return this.detailContent = detail as string;
    }

    private initializeForm(tables: TableResponse): void {
        this.tableData = tables.tables;
        this.dataSource.data = this.tableData[0].fields;
        this.dataSource.sort = this.sort;
    }

    private async dataPost(): Promise<void> {
        const url: string = `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.structure}`;
        const tables: TableResponse = await this.archetypeService.postMapping<TableResponse>(url, {data: this.detailContent});
        this.initializeForm(tables);
    }
}