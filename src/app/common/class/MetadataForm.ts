export class MetadataForm {
    constructor(public title: string = "",
                public description: string = "",
                public architecture: number = 0,
                public database: number = 0,
                public databaseEngineer: number = 0,
                public developmentEnvironment: number = 0,
                public form: number = 0,
                public data: File
    ) {
    }
}
