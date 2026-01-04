import {Table} from "src/app/shared/interface/Table";

export interface ArchetypeGenerate {
    architectures: number
    databasePlatforms: number
    databaseEngineers: number
    engineeringPlatforms: number
    templates: number
    projectTemplates: number
    tables: Table[]
}