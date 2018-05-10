import 'reflect-metadata';

export function Service (num?): Function {
    return function(target: Function) {
        const data = Reflect.getMetadata('design:paramtypes', target)
        console.log(`Service ${num}`, target, data);
    };
}
