import {Table} from "src/app/shared/interface/Table";

export interface ArchetypeGenerate {
    architecture: number
    database: number
    databaseEngineer: number
    environment: number
    template: number
    scaffold: number
    table: Table[]
}