// @flow

import BabelTypes, {
  binaryExpression,
  Identifier,
  isJSXExpressionContainer,
  isStringLiteral,
  jSXAttribute,
  JSXAttribute,
  jSXExpressionContainer,
  jSXIdentifier
} from '@babel/types';
import type {
  GetClassNameOptionsType
} from './types';
import conditionalClassMerge from './conditionalClassMerge';
import createObjectExpression from './createObjectExpression';
import optionsDefaults from './schemas/optionsDefaults';

export default (
  t: BabelTypes,
  // eslint-disable-next-line flowtype/no-weak-types
  path: Object,
  sourceAttribute: JSXAttribute,
  destinationName: string,
  importedHelperIndentifier: Identifier,
  styleModuleImportMapIdentifier: Identifier,
  options: GetClassNameOptionsType
): void => {
  const expressionContainerValue = sourceAttribute.value;
  const destinationAttribute = path.node.openingElement.attributes
    .find((attribute) => {
      return typeof attribute.name !== 'undefined' && attribute.name.name === destinationName;
    });

  // console.log('destinationName', destinationAttribute ? destinationAttribute.name.name : null, 'sourceAttribute', sourceAttribute.name.name)
  let isNotSameName = true;
  try {
    if (destinationAttribute && destinationAttribute.name.name === sourceAttribute.name.name) {
      isNotSameName = false;
    }
  } catch(err) {
    isNotSameName = true;
  }


  if (destinationAttribute) {
    if (isNotSameName) {
      path.node.openingElement.attributes.splice(path.node.openingElement.attributes.indexOf(destinationAttribute), 1);
    }
  }

  if (isNotSameName) {
    path.node.openingElement.attributes.splice(path.node.openingElement.attributes.indexOf(sourceAttribute), 1);
  }


  const args = [
    expressionContainerValue.expression,
    styleModuleImportMapIdentifier
  ];

  // Only provide options argument if the options are something other than default
  // This helps save a few bits in the generated user code
  if (options.handleMissingStyleName !== optionsDefaults.handleMissingStyleName ||
    options.autoResolveMultipleImports !== optionsDefaults.autoResolveMultipleImports) {
    args.push(createObjectExpression(t, options));
  }

  const styleNameExpression = t.callExpression(
    t.clone(importedHelperIndentifier),
    args
  );

  if (destinationAttribute) {
    if (isStringLiteral(destinationAttribute.value)) {
      const jSXExpression = isNotSameName
        ? binaryExpression(
          '+',
          t.stringLiteral(destinationAttribute.value.value + ' '),
          styleNameExpression
        )
        :  styleNameExpression;

      path.node.openingElement.attributes.push(jSXAttribute(
        jSXIdentifier(destinationName),
        jSXExpressionContainer(
          jSXExpression
        )
      ));

    } else if (isJSXExpressionContainer(destinationAttribute.value)) {
      const jSXExpression = isNotSameName
        ? conditionalClassMerge(
          destinationAttribute.value.expression,
          styleNameExpression
        )
        : styleNameExpression;

      path.node.openingElement.attributes.push(jSXAttribute(
        jSXIdentifier(destinationName),
        jSXExpressionContainer(
          jSXExpression
        )
      ));

    } else {
      throw new Error('Unexpected attribute value: ' + destinationAttribute.value);
    }
  } else {
    path.node.openingElement.attributes.push(jSXAttribute(
      jSXIdentifier(destinationName),
      jSXExpressionContainer(
        styleNameExpression
      )
    ));
  }
};
