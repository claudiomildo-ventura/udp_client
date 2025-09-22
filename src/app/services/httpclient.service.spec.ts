import {TestBed} from '@angular/core/testing';
import {HttpclientService} from './httpclient.service';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';

describe('HttpclientService', (): void => {
    let service: HttpclientService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
        TestBed.configureTestingModule({
            providers: [
                HttpclientService,
                {provide: HttpClient, useValue: httpClientSpy}
            ]
        });
        service = TestBed.inject(HttpclientService);
    });

    it('should be created', (): void => {
        expect(service).toBeTruthy();
    });

    it('should call getData$ and return expected data', (): void => {
        const expectedData = {param: 'value'};
        httpClientSpy.get.and.returnValue(of(expectedData));
        service.getData$('test-url').subscribe(data => {
            // @ts-ignore
            expect(data).toEqual(expectedData);
        });
        expect(httpClientSpy.get).toHaveBeenCalledWith('test-url', service.httpOptions);
    });

    it('should call sendData$ and return expected response', (): void => {
        const postData = {key: 'val'};
        const expectedResponse = {success: true};
        httpClientSpy.post.and.returnValue(of(expectedResponse));
        service.sendData$('test-url', postData).subscribe(res => {
            expect(res).toEqual(expectedResponse);
        });
        expect(httpClientSpy.post).toHaveBeenCalledWith('test-url', postData, service.httpOptions);
    });

    it('should call getDataItems$ and return expected items', (): void => {
        const expectedItems = [{id: 1}, {id: 2}];
        httpClientSpy.get.and.returnValue(of(expectedItems));
        service.getDataItems$('test-url').subscribe(items => {
            // @ts-ignore
            expect(items).toEqual(expectedItems);
        });
        expect(httpClientSpy.get).toHaveBeenCalledWith('test-url', service.httpOptions);
    });
});
