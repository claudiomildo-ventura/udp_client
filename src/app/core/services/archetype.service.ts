import {inject, Injectable} from '@angular/core';
import {HttpclientService} from "./httpclient.service";
import {catchError, timeout} from "rxjs/operators";
import {firstValueFrom, throwError} from "rxjs";
import {ApiResponse} from "../../shared/interface/ApiResponse";
import {HttpContext} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class ArchetypeService {

    private readonly timeOut: number = 15000;
    private readonly httpclientService: HttpclientService = inject(HttpclientService);

    public async getMapping<T>(url: string): Promise<T> {
        try {
            const response: ApiResponse<T> = await firstValueFrom(
                this.httpclientService.getMapping$<ApiResponse<T>>(url).pipe(
                    timeout(this.timeOut),
                    catchError(ex => {
                        return throwError(() => new Error(`getMapping failed: ${ex?.message ?? ex}`));
                    })
                )
            );
            return response.data;
        } catch (ex) {
            throw ex;
        }
    }

    public async postMapping<T>(url: string, body: unknown, options?: { context?: HttpContext }): Promise<T> {
        try {
            const response: ApiResponse<T> = await firstValueFrom(
                this.httpclientService.postMapping$<ApiResponse<T>>(url, body, options).pipe(
                    timeout(this.timeOut),
                    catchError(ex => {
                        return throwError(() => new Error(`postMapping failed: ${ex?.message ?? ex}`));
                    })
                )
            );
            return response.data;
        } catch (ex) {
            throw ex;
        }
    }
}