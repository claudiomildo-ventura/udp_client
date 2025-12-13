import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
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
    imports: [CommonModule, MatTable, MatTableModule, PageTitleComponent, MatCheckbox],
    templateUrl: './page-structure.component.html',
    styleUrl: './archetype-structure-app.component.css'
})
export class PageStructureComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSort) sort!: MatSort;

    public readonly obj: ApiResponse<any> = {data: ''};
    private readonly router: Router = inject(Router);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);
    private detailContent: unknown;
    public tableData: any[] = [];
    public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns: string[] = ['id', 'name', 'type', 'length'];
    displayedColumnsWithSelect: string[] = ['select', ...this.displayedColumns];

    selection = new SelectionModel<any>(true, []); // true = multiple selection

    ngOnInit(): void {
        const {detailContent} = history.state ?? {};
        this.detailContent = detailContent;
    }

    ngAfterViewInit(): void {
        this.dataPost(this.detailContent as string);
        //this.dataSource.sort = this.sort;
    }

    /** Whether the number of selected elements matches the total number of rows. */
    public isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    public masterToggle() {
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** Toggle a single row */
    public toggleRow(row: any) {
        this.selection.toggle(row);
    }


    private async dataPost(data: string): Promise<void> {
        const metadata = {data: data};
        const url: string = `${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.structure}`;

        const tableResponse: TableResponse = await this.archetypeService.postMapping<TableResponse>(url, metadata);

        this.tableData = tableResponse.tables;
        this.dataSource.data = this.tableData[0].fields;
    }
}