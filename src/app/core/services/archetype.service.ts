import {HttpContext} from "@angular/common/http";
import {inject, Injectable} from '@angular/core';
import {firstValueFrom, throwError} from "rxjs";
import {catchError, timeout} from "rxjs/operators";
import {ApiResponse} from "../../shared/interface/ApiResponse";
import {DialogService} from "./dialog.service";
import {HttpclientService} from "./httpclient.service";

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
            return response.payload;

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

    public async postMapping<T>(url: string, payload: unknown, options?: { context?: HttpContext }): Promise<T> {
        try {
            return await firstValueFrom(
                this.httpclientService.postMapping$<T>(url, payload, options)
                    .pipe(
                        timeout(this.timeOut),
                        catchError(ex => throwError((): any => ex))
                    )
            );
        } catch (ex: any) {
            if (ex?.status === 500) {
                await this.dialogService.confirm(ex?.status, ex?.error?.message);
            }

            throw ex;
        }
    }
}