import {Table} from "src/app/shared/interface/Table";

export interface ArchetypeGenerate {
    architecture: number
    databasePlatform: number
    databaseEngineer: number
    engineeringPlatform: number
    template: number
    projectTemplate: number
    tables: Table[]
}