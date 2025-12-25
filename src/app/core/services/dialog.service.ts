import {inject, Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {firstValueFrom} from "rxjs";
import {SESSION_SERVICE} from "src/config/session-service";
import {MessageDialogComponent} from "../../components/message-dialog/message-dialog.component";
import {SessionService} from "./session-storage.service";

@Injectable({providedIn: 'root'})
export class DialogService {
    private readonly dialog: MatDialog = inject(MatDialog);
    private readonly sessionService: SessionService = inject(SessionService);

    public confirm<TResult = boolean>(statusCode: number, message: string, config?: MatDialogConfig): Promise<TResult | null> {
        return this.openDialog<TResult>(`[Status code: ${statusCode}] - [Message error: ${message}]`, config);
    }

    public alert<TResult = boolean>(message: string, config?: MatDialogConfig): Promise<TResult | null> {
        return this.openDialog<TResult>(`[Message error: ${message}]`, config);
    }

    public info<TResult = boolean>(message: string, config?: MatDialogConfig): Promise<TResult | null> {
        return this.openDialog<TResult>(message, config);
    }

    private openDialog<TResult>(message: string, config: MatDialogConfig = {}): Promise<TResult | null> {
        const ref = this.dialog.open(MessageDialogComponent, {
            autoFocus: true,
            restoreFocus: true,

            width: config.width ?? '800px',
            height: config.height ?? 'auto',
            maxWidth: config.maxWidth ?? '95vw',
            minWidth: config.minWidth ?? '320px',
            maxHeight: config.maxHeight ?? '85vh',

            ...config,

            data: {
                title: this.sessionService.getItem(SESSION_SERVICE.application_title),
                message,
                ...config.data
            }
        });

        return firstValueFrom(ref.afterClosed());
    }
}