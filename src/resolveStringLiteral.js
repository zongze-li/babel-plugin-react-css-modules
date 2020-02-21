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
  let sourceValue = !isJSXExpressionContainer(sourceAttribute.value)
    ? sourceAttribute.value.value
    : sourceAttribute.value.expression.value;

  const resolvedStyleName = getClassName(sourceValue, styleModuleImportMap, options);

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
    // N,B: 为了兼容小程序传给全局组件的全局类名，这里空值不舍弃属性
    // TODO: 做成配置项
    // FIXME: 但是如果是表达式的话，会不会有问题呢？因为表达式是被强行转了一下的 => 暂不支持全局表达式

    if (resolvedStyleName || options.removeUnknownClassName) {
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
