import {Table} from "src/app/shared/interface/Table";

export interface ArchetypeGenerate {
    architecture: number
    dbPlatform: number
    dbEngineer: number
    engPlatform: number
    template: number
    scaffold: number
    tables: Table[]
}