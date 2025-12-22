import {Injectable} from '@angular/core';
import {DATABASE_SERVICE} from "../../../config/database-service";

@Injectable({providedIn: 'root'})
export class IndexedDbService {
    private dbPromise!: Promise<IDBDatabase>;

    constructor() {
        this.initializeDatabase();
    }

    private openDatabase(): Promise<IDBDatabase> {
        return new Promise((resolve, reject): void => {
            const request: IDBOpenDBRequest = indexedDB.open(DATABASE_SERVICE.name, DATABASE_SERVICE.version);

            request.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
                const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;

                if (!db.objectStoreNames.contains(DATABASE_SERVICE.storeName)) {
                    // Use unique uid as key
                    const store: IDBObjectStore = db.createObjectStore(DATABASE_SERVICE.storeName, {keyPath: 'uid'});
                    store.createIndex('tableRelationId_idx', 'tableRelationId');
                }
            };

            request.onsuccess = (): void => resolve(request.result);
            request.onerror = (): void => reject(request.error);
        });
    }

    private initializeDatabase(): void {
        this.dbPromise = this.openDatabase();
    }

    public async addColumns(columns: any[]): Promise<void> {
        const database: IDBDatabase = await this.dbPromise;
        const transac: IDBTransaction = database.transaction(DATABASE_SERVICE.storeName, 'readwrite');
        const store: IDBObjectStore = transac.objectStore(DATABASE_SERVICE.storeName);

        // Assign unique keys
        columns.forEach(col => col.uid = `idx_${col.id}`);
        columns.forEach(col => store.put(col));

        return new Promise((resolve, reject): void => {
            transac.oncomplete = (): void => resolve();
            transac.onerror = (): void => reject(transac.error);
        });
    }

    public async getColumns(): Promise<any[]> {
        const database: IDBDatabase = await this.dbPromise;
        const transac: IDBTransaction = database.transaction(DATABASE_SERVICE.storeName, 'readonly');
        const store: IDBObjectStore = transac.objectStore(DATABASE_SERVICE.storeName);
        const request: IDBRequest<any> = store.getAll();

        return new Promise((resolve, reject): void => {
            request.onsuccess = (): void => resolve(request.result);
            request.onerror = (): void => reject(request.error);
        });
    }
}