// @flow

import type {
  StyleModuleMapType,
  StyleModuleImportMapType,
  HandleMissingStyleNameOptionType,
  GetClassNameOptionsType
} from './types';
import optionsDefaults from './schemas/optionsDefaults';

const isNamespacedStyleName = (styleName: string): boolean => {
  return styleName.indexOf('.') !== -1;
};

const handleError = (message: string, handleMissingStyleName: HandleMissingStyleNameOptionType): null => {
  if (handleMissingStyleName === 'throw') {
    throw new Error(message);
  } else if (handleMissingStyleName === 'warn') {
    // eslint-disable-next-line no-console
    console.warn(message);
  }

  return null;
};

const handleErrorPreserve = (msg: string, handleMissingStyleName: HandleMissingStyleNameOptionType, styleName: string, removeUnknownClassName: Boolean) => {
  let ret = handleError(msg, handleMissingStyleName);
  if (!removeUnknownClassName) {
    // eslint-disable-next-line no-console
    console.log('preserve className', styleName);
    ret = styleName;
  }
  return ret;
}

const getClassNameForNamespacedStyleName = (
  styleName: string,
  styleModuleImportMap: StyleModuleImportMapType,
  handleMissingStyleNameOption?: HandleMissingStyleNameOptionType,
  removeUnknownClassName?: Boolean
): ?string => {
  // Note:
  // Do not use the desctructing syntax with Babel.
  // Desctructing adds _slicedToArray helper.
  const styleNameParts = styleName.split('.');
  const importName = styleNameParts[0];
  const moduleName = styleNameParts[1];
  const handleMissingStyleName = handleMissingStyleNameOption ||
    optionsDefaults.handleMissingStyleName;

  if (!moduleName) {
    return handleErrorPreserve('Invalid style name: ' + styleName, handleMissingStyleName, styleName, removeUnknownClassName);
  }

  if (!styleModuleImportMap[importName]) {
    return handleErrorPreserve('CSS module import does not exist: ' + importName, handleMissingStyleName, styleName, removeUnknownClassName);
  }

  if (!styleModuleImportMap[importName][moduleName]) {
    return handleErrorPreserve('CSS module does not exist: ' + moduleName, handleMissingStyleName, styleName, removeUnknownClassName);
  }

  return styleModuleImportMap[importName][moduleName];
};

const getClassNameFromMultipleImports = (
  styleName: string,
  styleModuleImportMap: StyleModuleImportMapType,
  handleMissingStyleNameOption?: HandleMissingStyleNameOptionType,
  removeUnknownClassName?: Boolean
): ?string => {
  const handleMissingStyleName = handleMissingStyleNameOption ||
    optionsDefaults.handleMissingStyleName;

  const importKeysWithMatches = Object.keys(styleModuleImportMap)
    .map((importKey) => {
      return styleModuleImportMap[importKey][styleName] && importKey;
    })
    .filter((importKey) => {
      return importKey;
    });

  if (importKeysWithMatches.length > 1) {
    throw new Error('Cannot resolve styleName "' + styleName + '" because it is present in multiple imports:' +
      '\n\n\t' + importKeysWithMatches.join('\n\t') +
      '\n\nYou can resolve this by using a named import, e.g:' +
      '\n\n\timport foo from "' + importKeysWithMatches[0] + '";' +
      '\n\t<div styleName="foo.' + styleName + '" />' +
      '\n\n');
  }

  if (importKeysWithMatches.length === 0) {
    return handleErrorPreserve('Could not resolve the styleName \'' + styleName + '\'.', handleMissingStyleName, styleName, removeUnknownClassName);
  }

  return styleModuleImportMap[importKeysWithMatches[0]][styleName];
};

export default (styleNameValue: string, styleModuleImportMap: StyleModuleImportMapType, options?: GetClassNameOptionsType): string => {
  const styleModuleImportMapKeys = Object.keys(styleModuleImportMap);

  const {
    handleMissingStyleName = optionsDefaults.handleMissingStyleName,
    autoResolveMultipleImports = optionsDefaults.autoResolveMultipleImports,
    removeUnknownClassName,
  } = options || {};

  if (!styleNameValue) {
    return '';
  }

  return styleNameValue
    .split(' ')
    .filter((styleName) => {
      return styleName;
    })
    .map((styleName) => {
      if (isNamespacedStyleName(styleName)) {
        return getClassNameForNamespacedStyleName(styleName, styleModuleImportMap, handleMissingStyleName, removeUnknownClassName);
      }
      // console.log('styleModuleImportMapKeys', styleModuleImportMapKeys)
      if (styleModuleImportMapKeys.length === 0) {
        const { include, exclude  } = options
        const errMsg = 'Cannot use styleName attribute for style name \'' + styleName +
        '\' without importing at least one stylesheet.';
        if (include || exclude) {
          return console.warn(errMsg);
        }

        throw new Error(errMsg);
      }

      if (styleModuleImportMapKeys.length > 1) {
        if (!autoResolveMultipleImports) {
          throw new Error('Cannot use anonymous style name \'' + styleName +
            '\' with more than one stylesheet import without setting \'autoResolveMultipleImports\' to true.');
        }

        return getClassNameFromMultipleImports(styleName, styleModuleImportMap, handleMissingStyleName, removeUnknownClassName);
      }

      const styleModuleMap: StyleModuleMapType = styleModuleImportMap[styleModuleImportMapKeys[0]];

      if (!styleModuleMap[styleName]) {
        return handleErrorPreserve('Could not resolve the styleName \'' + styleName + '\'.', handleMissingStyleName, styleName, removeUnknownClassName);
      }

      return styleModuleMap[styleName];
    })
    .filter((className) => {
      // Remove any styles which could not be found (if handleMissingStyleName === 'ignore')
      return className;
    })
    .join(' ');
};
