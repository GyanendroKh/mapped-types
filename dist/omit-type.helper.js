"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmitType = void 0;
const type_helpers_utils_1 = require("./type-helpers.utils");
function OmitType(classRef, keys) {
    const isInheritedPredicate = (propertyKey) => !keys.includes(propertyKey);
    class OmitClassType {
        constructor() {
            type_helpers_utils_1.inheritPropertyInitializers(this, classRef, isInheritedPredicate);
        }
    }
    type_helpers_utils_1.inheritValidationMetadata(classRef, OmitClassType, isInheritedPredicate);
    type_helpers_utils_1.inheritTransformationMetadata(classRef, OmitClassType, isInheritedPredicate);
    return OmitClassType;
}
exports.OmitType = OmitType;
