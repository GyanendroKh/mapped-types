"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inheritPropertyInitializers = exports.inheritTransformationMetadata = exports.inheritValidationMetadata = exports.applyIsOptionalDecorator = void 0;
require("reflect-metadata");
const class_validator_1 = require("class-validator");
const { defaultMetadataStorage } = require('class-transformer/cjs/storage.js');
function applyIsOptionalDecorator(targetClass, propertyKey) {
    if (!isClassValidatorAvailable()) {
        return;
    }
    const decoratorFactory = class_validator_1.IsOptional();
    decoratorFactory(targetClass.prototype, propertyKey);
}
exports.applyIsOptionalDecorator = applyIsOptionalDecorator;
function inheritValidationMetadata(parentClass, targetClass, isPropertyInherited) {
    if (!isClassValidatorAvailable()) {
        return;
    }
    try {
        const metadataStorage = class_validator_1.getMetadataStorage
            ? class_validator_1.getMetadataStorage()
            : class_validator_1.getFromContainer(class_validator_1.MetadataStorage);
        const getTargetValidationMetadatasArgs = [parentClass, null, false, false];
        const targetMetadata = metadataStorage.getTargetValidationMetadatas(...getTargetValidationMetadatasArgs);
        return targetMetadata
            .filter(({ propertyName }) => !isPropertyInherited || isPropertyInherited(propertyName))
            .map((value) => {
            const originalType = Reflect.getMetadata('design:type', parentClass.prototype, value.propertyName);
            if (originalType) {
                Reflect.defineMetadata('design:type', originalType, targetClass.prototype, value.propertyName);
            }
            metadataStorage.addValidationMetadata(Object.assign(Object.assign({}, value), { target: targetClass }));
            return value.propertyName;
        });
    }
    catch (err) {
        console.error(`Validation ("class-validator") metadata cannot be inherited for "${parentClass.name}" class.`);
        console.error(err);
    }
}
exports.inheritValidationMetadata = inheritValidationMetadata;
function inheritTransformationMetadata(parentClass, targetClass, isPropertyInherited) {
    if (!isClassTransformerAvailable()) {
        return;
    }
    try {
        const transformMetadataKeys = [
            '_excludeMetadatas',
            '_exposeMetadatas',
            '_transformMetadatas',
            '_typeMetadatas',
        ];
        transformMetadataKeys.forEach((key) => inheritTransformerMetadata(key, parentClass, targetClass, isPropertyInherited));
    }
    catch (err) {
        console.error(`Transformer ("class-transformer") metadata cannot be inherited for "${parentClass.name}" class.`);
        console.error(err);
    }
}
exports.inheritTransformationMetadata = inheritTransformationMetadata;
function inheritTransformerMetadata(key, parentClass, targetClass, isPropertyInherited) {
    const metadataStorage = defaultMetadataStorage;
    while (parentClass && parentClass !== Object) {
        if (metadataStorage[key].has(parentClass)) {
            const metadataMap = metadataStorage[key];
            const parentMetadata = metadataMap.get(parentClass);
            const targetMetadataEntries = Array.from(parentMetadata.entries())
                .filter(([key]) => !isPropertyInherited || isPropertyInherited(key))
                .map(([key, metadata]) => {
                if (Array.isArray(metadata)) {
                    const targetMetadata = metadata.map((item) => (Object.assign(Object.assign({}, item), { target: targetClass })));
                    return [key, targetMetadata];
                }
                return [key, Object.assign(Object.assign({}, metadata), { target: targetClass })];
            });
            if (metadataMap.has(targetClass)) {
                const existingRules = metadataMap.get(targetClass).entries();
                metadataMap.set(targetClass, new Map([...existingRules, ...targetMetadataEntries]));
            }
            else {
                metadataMap.set(targetClass, new Map(targetMetadataEntries));
            }
        }
        parentClass = Object.getPrototypeOf(parentClass);
    }
}
function isClassValidatorAvailable() {
    try {
        require('class-validator');
        return true;
    }
    catch (_a) {
        return false;
    }
}
function isClassTransformerAvailable() {
    try {
        require('class-transformer');
        return true;
    }
    catch (_a) {
        return false;
    }
}
function inheritPropertyInitializers(target, sourceClass, isPropertyInherited = (key) => true) {
    try {
        const tempInstance = new sourceClass();
        const propertyNames = Object.getOwnPropertyNames(tempInstance);
        propertyNames
            .filter((propertyName) => typeof tempInstance[propertyName] !== 'undefined' &&
            typeof target[propertyName] === 'undefined')
            .filter((propertyName) => isPropertyInherited(propertyName))
            .forEach((propertyName) => {
            target[propertyName] = tempInstance[propertyName];
        });
    }
    catch (_a) { }
}
exports.inheritPropertyInitializers = inheritPropertyInitializers;
