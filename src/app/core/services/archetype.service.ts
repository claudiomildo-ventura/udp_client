import {inject, Injectable} from '@angular/core';
import {HttpclientService} from "./httpclient.service";
import {catchError, timeout} from "rxjs/operators";
import {firstValueFrom, throwError} from "rxjs";
import {ApiResponse} from "../../shared/interface/ApiResponse";
import {HttpContext} from "@angular/common/http";
import {DialogService} from "./dialog.service";

@Injectable({providedIn: 'root'})
export class ArchetypeService {

    private readonly timeOut: number = 15000;
    private readonly dialogService: DialogService = inject(DialogService);
    private readonly httpclientService: HttpclientService = inject(HttpclientService);

    public async getMapping<T>(url: string): Promise<T> {
        try {
            const response = await firstValueFrom(
                this.httpclientService
                    .getMapping$<ApiResponse<T>>(url)
                    .pipe(
                        timeout(this.timeOut),
                        catchError(ex => throwError((): any => ex))
                    )
            );
            return response.data;

        } catch (ex) {
            throw ex;
        }
    }

    public async getMappingList<T>(url: string): Promise<T> {
        try {
            return await firstValueFrom(
                this.httpclientService
                    .getMapping$<T>(url)
                    .pipe(
                        timeout(this.timeOut),
                        catchError(ex => throwError((): any => ex))
                    )
            );
        } catch (ex) {
            throw ex;
        }
    }

    public async postMapping<TableResponse>(url: string, payload: unknown, options?: { context?: HttpContext }): Promise<TableResponse> {
        try {
            const response: TableResponse = await firstValueFrom(this.httpclientService.postMapping$<TableResponse>(url, payload, options)
                .pipe(timeout(this.timeOut), catchError(ex => throwError((): any => ex))));
            return response;

        } catch (ex: any) {
            if (ex?.status === 500) {
                await this.dialogService.confirm(ex?.status, ex?.error?.message);
            }

            throw ex;
        }
    }
}