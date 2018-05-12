import * as Interfaces from '../interfaces';

import { Entity } from './entity.di';

type EntityKey = any;

export class Container {
    private store: Map<EntityKey, Entity> = new Map();

    public addEntity (entity: Interfaces.DI.Entity) {
    }

    public addInjector (injector: Interfaces.DI.Injector) {
    }

    /**
     * Returns the instance of the DI Entity.
     *
     * @return {type}
     */
    public get (): any {
    }
}
