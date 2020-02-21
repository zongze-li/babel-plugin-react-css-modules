// @flow

import {
  isJSXExpressionContainer,
  isStringLiteral,
  JSXAttribute,
  stringLiteral
} from '@babel/types';
import conditionalClassMerge from './conditionalClassMerge';
import getClassName from './getClassName';
import type {
  StyleModuleImportMapType,
  GetClassNameOptionsType
} from './types';

/**
 * Updates the className value of a JSX element using a provided styleName attribute.
 */
export default (
  path: *,
  styleModuleImportMap: StyleModuleImportMapType,
  sourceAttribute: JSXAttribute,
  destinationName: string,
  options: GetClassNameOptionsType
): void => {
  const resolvedStyleName = getClassName(sourceAttribute.value.value, styleModuleImportMap, options);

  const destinationAttribute = path.node.openingElement.attributes
    .find((attribute) => {
      return typeof attribute.name !== 'undefined' && attribute.name.name === destinationName;
    });

  // console.log('destinationName', destinationName && destinationName.name, 'sourceAttribute', sourceAttribute.name.name)
  let isNotSameName = true;
  try {
    if (destinationAttribute && sourceAttribute && destinationAttribute.name.name === sourceAttribute.name.name) {
      isNotSameName = false;
    }
  } catch (err) {
      isNotSameName = true;
  }

  if (destinationAttribute) {
    if (resolvedStyleName) {
      if (isStringLiteral(destinationAttribute.value)) {
        if (isNotSameName) {
          destinationAttribute.value.value += ' ' + resolvedStyleName;
        } else {
          destinationAttribute.value.value = resolvedStyleName;
        }
      } else if (isJSXExpressionContainer(destinationAttribute.value)) {
        if (isNotSameName) {
          destinationAttribute.value.expression = conditionalClassMerge(
            destinationAttribute.value.expression,
            stringLiteral(resolvedStyleName)
          );
        } else {
          destinationAttribute.value.expression = stringLiteral(resolvedStyleName);
        }

      } else {
        throw new Error('Unexpected attribute value:' + destinationAttribute.value);
      }
    }

    if (isNotSameName) {
      path.node.openingElement.attributes.splice(path.node.openingElement.attributes.indexOf(sourceAttribute), 1);
    }
  } else {
    if (destinationName) {
      sourceAttribute.name.name = destinationName;
    }
    if (resolvedStyleName) {
      sourceAttribute.value.value = resolvedStyleName;
    }
  }
};
