
export namespace DI {
    export interface Entity {
        target: any;
        options: EntityOptions;
    }
    export interface EntityOptions {
        global: boolean;
    }

    export interface Injector {
        target: any;
        propertyName: string;
        index: number;
        key: string;
    }
}
