import * as _ from 'lodash';

import * as Interfaces from '../interfaces';

import * as Consts from '../consts';

import * as Errors from '../errors';

export class Entity {
    public readonly className: string = 'DI:Entity';

    private reflect: typeof Reflect;

    /**
     * `active` status flag.
     *
     * @type {Map<string,Interfaces.DI.Injector>}
     */
    private fromEntity: boolean;

    /**
     * List of injectors.
     *
     * @type {Map<string,Interfaces.DI.Injector>}
     */
    private injectors: Map<string, Interfaces.DI.Injector>;

    /**
     * Entity options.
     *
     * @type {Interfaces.DI.EntityOptions}
     */
    public options: Interfaces.DI.EntityOptions;

    constructor (private target: any) {
        this.reflect = Reflect;
        this.fromEntity = false;
        this.options = _.cloneDeep(Consts.DI.defEntityOptions);
        this.injectors = new Map();
    }

    /**
     * Returns the params for the instance of the DI Entity.
     *
     * @return {type}
     */
    public getInstanceParams (): any {
        if (!this.fromEntity) {
            throw new Errors.DIError(`${this.className} - get: Entity is not registred!`);
        }

        const injectors = Array.from(this.injectors.values());
        const constructorInjectors = _.filter(injectors, (injector) => {
            return _.isUndefined(injector.propertyName) && _.isNumber(injector.index);
        });

        const listOfInstanceParams = this.getMethodParams('constructor', constructorInjectors);

        // TODO: Maybe unused.
        _.map(listOfInstanceParams, (param, index) => {
            if (param.injector) {
                return;
            }

            if (this.isNativeType(param.value)) {
                throw new Errors.DIError(`${this.className} - get: Param ${index} has \`native\` type!`);
            }
        });

        return listOfInstanceParams;
    }

    /**
     * Returns the params of the specific method of the DI Entity.
     *
     * @param  {string} methodName - name of the method of the DI Entity
     * @param  {Interfaces.DI.Injector[]} injectors - list of the param injectors
     * @return {Interfaces.DI.MethodParam[]}
     */
    public getMethodParams (methodName: string, injectors: Interfaces.DI.Injector[]): Interfaces.DI.MethodParam[] {
        const reflectMethodName = methodName === 'constructor' ? undefined : methodName;
        const reflectListOfParams: any[] = this.reflect
            .getMetadata('design:paramtypes', this.target, reflectMethodName);

        if (_.isNil(reflectListOfParams)) {
            throw new Errors.DIError(`${this.className} - get: Entity method is not registred!`);
        }

        const listOfMethodParams: Interfaces.DI.MethodParam[] = _.map(reflectListOfParams, (param) => ({
            injector: false,
            value: param,
        }));

        const numOfMethodParams = listOfMethodParams.length;
        _.map(injectors, (injector) => {
            if (numOfMethodParams <= injector.index) {
                throw new Errors.DIError(`${this.className} - get: Param ${injector.index} is not exist!`);
            }

            listOfMethodParams[injector.index] = {
                injector: true,
                value: injector,
            };
        });

        return listOfMethodParams;
    }

    /**
     * Activate the DI Entity. DI Entity will have to be activated if the
     * target has `Service` decorator.
     *
     * @param  {Interfaces.DI.EntityOptions} options
     * @return {void}
     */
    public acitvate (options: Interfaces.DI.EntityOptions): void {
        this.options = options;
        this.fromEntity = true;
    }

    /**
     * Return `active` status of the DI Entity.
     *
     * @return {boolean} - `active` status
     */
    public isActivated (): boolean {
        return this.fromEntity;
    }

    /**
     * Adds the injector to the DI Entity.
     *
     * @return {boolean} - `active` status
     */
    public addInjector (injector: Interfaces.DI.Injector) {
        const injectorKey: string = this.getInjectorKey(injector);

        if (this.injectors.has(injectorKey)) {
            throw new Errors.DIError(`${this.className} - addInjector: Injector already exist!`);
        }

        this.injectors.set(injectorKey, injector);
    }

    /**
     * HELPERs
     */

    /**
     * Calculates and returns the injector key.
     *
     * @param  {Interfaces.DI.Injector} injector - injector entity
     * @return {string} - injector key
     */
    private getInjectorKey (injector: Interfaces.DI.Injector): string {
        return `${injector.propertyName}:${injector.index}`;
    }

    /**
     * Checks the metatype. If metatype is a `native` type method will return `true'.
     *
     * @return {boolean}
     */
    private isNativeType (metatype: any): boolean {
        const types: any[] = [ String, Boolean, Number, Object ];
        const metatypeName: string = _.get(metatype, 'name', '');
        return _.includes(types, (type) => metatypeName === type.name);
    }
}
