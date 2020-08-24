// import runner from '@babel/helper-plugin-test-runner';
// runner(__dirname);

import testRunner from "@babel/helper-transform-fixture-test-runner";
import path from "path";

function runner (loc) {
  const name = path.basename(path.dirname(loc));
  testRunner(loc + "/fixtures", name);
}

runner(__dirname)
