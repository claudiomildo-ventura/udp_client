import {Metadata} from './metadata';

describe('Metadata', (): void => {
    it('should create an instance', (): void => {
        expect(new Metadata(0, "")).toBeTruthy();
    });

    it('should set id and data correctly', (): void => {
        const metadata = new Metadata(42, "test-data");
        expect(metadata.id).toBe(42);
        expect(metadata.data).toBe("test-data");
    });

    it('should create another instance with different values', (): void => {
        const metadata = new Metadata(7, "another-data");
        expect(metadata.id).toBe(7);
        expect(metadata.data).toBe("another-data");
    });
});
