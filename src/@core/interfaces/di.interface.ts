
export namespace DI {
    export interface InstanceParam {
        injector: boolean;
        value: any;
    }

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
