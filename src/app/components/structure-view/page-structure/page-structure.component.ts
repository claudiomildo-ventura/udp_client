import {SelectionModel} from "@angular/cdk/collections";
import {CommonModule} from "@angular/common";
import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {ArchetypeService} from "src/app/core/services/archetype.service";
import {IndexedDbService} from "src/app/core/services/indexed-db.service";
import {MaterialModule} from "src/app/material.module";
import {Field} from "src/app/shared/interface/Field";
import {Table} from "src/app/shared/interface/Table";
import {TableResponse} from "src/app/shared/interface/TablesResponse";
import {TECHNICAL_LOGGER} from "src/config/technical-logger";
import {ENVIRONMENT} from "src/environments/environment";

@Component({
    selector: 'page-structure',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule
    ],
    templateUrl: './page-structure.component.html',
    styleUrl: './page-structure-app.component.css'
})
export class PageStructureComponent implements OnInit, AfterViewInit {
    private detailContent: unknown;
    public isPageLoading: boolean = true;
    public tables: any[] = [];
    public dtsTablesCols: string[] = ['fields'];
    public dtsTables: MatTableDataSource<any> = new MatTableDataSource<any>();
    public selectionModel: SelectionModel<Field> = new SelectionModel<Field>(true, []);

    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly router: Router = inject(Router);
    private readonly archetypeService: ArchetypeService = inject(ArchetypeService);
    private readonly indexedDbService: IndexedDbService = inject(IndexedDbService);

    @ViewChild(MatSort) sort!: MatSort;

    public frm: FormGroup = this.fb.group({});

    ngOnInit(): void {
        this.getDetailFromDashboardForm();
    }

    ngAfterViewInit(): void {
        this.progressBarInitialize();
        void this.clearData();
    }

    public submit(): void {
        if (this.frm.invalid || this.selectionModel.selected.length === 0) return;

        const tablesWithFields: Table[] = this.getAllTablesWithFieldsFromStructureForm()
        void this.saveData(tablesWithFields);
        this.navigateToPageParameter();
    }

    public toggleRow(row: any): void {
        this.selectionModel.toggle(row);
    }

    public toggleAll(table: Table): void {
        this.isAllSelected(table)
            ? table.fields.forEach((f: Field): boolean | void => this.selectionModel.deselect(f))
            : table.fields.forEach((f: Field): boolean | void => this.selectionModel.select(f));
    }

    public isAllSelected(table: any): boolean {
        const numSelected: number = this.selectionModel.selected.filter(f => table.fields.includes(f)).length;
        const numRows: any = table.fields.length;
        return numSelected === numRows;
    }

    public handleKeydown(event: KeyboardEvent, field: Field): void {
        // Stop propagation if the keypress is relevant to prevent it from affecting parent elements
        event.stopPropagation();

        // Example 1: Trigger toggleRow if the SPACE key is pressed
        if (event.key === ' ') {
            // Prevent the default action (which the checkbox usually handles anyway,
            // but this is good practice)
            event.preventDefault();

            // Call your existing selection logic
            this.toggleRow(field);
            console.log('Space bar pressed on checkbox.');
        }

        // Example 2: Do something else on the ENTER key
        if (event.key === 'Enter') {
            console.log('Enter key pressed on checkbox.');
            // Add your custom logic here
        }
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

    private progressBarInitialize(): void {
        setTimeout((): void => {
            void this.dataPost();
            this.isPageLoading = false;
        }, 1000);
    }

    private getAllTablesWithFieldsFromStructureForm(): Table[] {
        return this.dtsTables.data
            .map((table: Table) => ({
                ...table,
                fields: table.fields.filter((field: Field): boolean => this.selectionModel.isSelected(field))
            }))
            .filter(table => table.fields.length > 0);
    }

    private navigateToPageParameter(): void {
        this.router.navigate(['/page-parameter'], {}).then(success => TECHNICAL_LOGGER.info(`Navigation result: ${success}`));
    }

    private async dataPost(): Promise<void> {
        const response: TableResponse = await this.archetypeService.postMapping<TableResponse>(`${ENVIRONMENT.basePath}${ENVIRONMENT.endpoints.generate_structure}`,
            {data: this.detailContent}
        );

        this.formShow(response);
    }

    private async saveData(columns: any): Promise<void> {
        try {
            await this.indexedDbService.saveData(columns);
        } catch (err) {
            console.error(err);
        }
    }

    private async clearData(): Promise<void> {
        try {
            await this.indexedDbService.clearData();
        } catch (err) {
            console.error(err);
        }
    }
}