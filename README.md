
### r2g example project - how to use r2g for publishing NPM packages

--------------------

This readme file accompanies the following video:


--------------------

Remember that there are 3 test phases, phaseZ/phaseS/phaseT. <br>
See: https://github.com/ORESoftware/r2g

---------------------

Remember that r2g can catch 4 types of problems:

1. Failure to build/transpile project before publishing, because the built files are not tracked by source control.
2. Missing dependencies - when people install your package with the --production flag, your package might be missing deps.
3. Files that are missing in the NPM tarball: your .npmignore file or "files" property in package.json might be too aggressive/passive.
4. General/unknown problems that relate to using/running your package as a dependency, instead of directly.

---------------------

## To learn how r2g works, do these steps in order:

<br>

1. Clone this repo: ```$ git clone https://github.com/ORESoftware/r2g.example.git```

<br>

2. install r2g globally: ```$ npm i -g r2g```

<br>

3. Run ```$ r2g test``` at the cloned project root

>
>  => The first problem is that it says it can't find our package "r2g.example". That is because we haven't created the files
>   in the dist folder yet. So we build/transpile with tsc. This is the first kind of problem r2g can catch.
>

<br>
 
4. Run ```$ tsc --watch```, from the root of the project. ```npm i -g typescript``` if you don't have ```tsc``` installed. 

<br>

5. Run ```$ r2g test```  # should pass

>
>  => You might notice "foobar test" in the output, during phase-Z.
>

<br>

6. Go into package.json and change "r2g.test" to "r2g.testnot". Now, r2g will default to the ```$ npm test``` script.

>
>  => In this case, ```npm test``` will run ```node test/simple.js```
>

<br>

7. Run ```$ r2g test```

>
>  <b> It will output: </b>  
>
>  r2g: phase-Z: Directory path which contains the r2g.example index file: /home/you/.r2g/temp/copy/r2g.example/dist
>

<br>

8. Go into test/simple.js and switch to ```require('r2g.example')``` instead of ```require('../dist')```, then run ```$ r2g test```

>
>  <b> It will output: </b>  
>
>  r2g: phase-Z: Directory path which contains the r2g.example index file: /home/you/.r2g/temp/project/node_modules/r2g.example/dist
>

<br>

9. The difference between 7 and 8 is important. 7 loads the regular unpacked version of your package, and 8 will load a
previously packed version of your package. Using 7 will ```npm test``` your package as usual. Using 8 will ```npm test``` your package
in a way that tests itself as a dependency of itself and having been previously packed with NPM pack.

<br>

10. Now, go into src/index.ts. Change `r2gSmokeTest` to `r2gSmokeTestFoo`. Run ```$ r2g test```.

>
>  <b> It will output: </b>   
>
>  r2g: phase-S: A module failed to export a function from "main" with key "r2gSmokeTest".
>  r2g: phase-S: The module/package missing this export has the following name:
>  r2g: phase-S: r2g.example
>

This means that your main (dist/index.js) failed to export a function with name `r2gSmokeTest`, because we changed it
to `r2gSmokeTestFoo`, lulz.

<br>

11. Change `r2gSmokeTestFoo` back to `r2gSmokeTest`, but return false from the function instead of true.

>
>  <b> It will output: </b>
>   
>  r2g: phase-S: At least one exported "r2gSmokeTest" function failed.
>  r2g: phase-S: Error: [ { path: 'r2g.example', result: false } ]
>

<br>

12. Your r2gSmokeTest function must return `true`, and no other value is acceptable. To skip phase-S, use `--skip=s` or `-s`.

<br>

As an example, you can try using this for your `r2gSmokeTest`:

```js
export const r2gSmokeTest = async () => {
  const z = exports.z;
  const v = await z.foo();
  return v === 'foo';
}
```

Ultimately, the purpose of r2gSmokeTest is if you don't want to use ".r2g/tests" in your project. Next we will
create a directory in your project called .r2g which will house tests used for specifcally before publishing.

<br>

13. Run ```r2g init``` in your project root. You will get this new dir with this structure:

```
.r2g/
  fixtures/
  tests/
  config.js
  readme.md
```

14. The tests in the .r2g/tests folder are tests that will be copied like so:

```
project/
 node_modules/
  r2g.example/
    .r2g/
      fixtures/
      tests/
```

to:

```
project/
 fixtures/    # copied here
 tests/       # copied here
 node_modules/
  r2g.example/
    .r2g/
      fixtures/
      tests/
```

Where project is a temp directory that will load your package a dependency and run tests against it.

15. In `````.r2g/tests/smoke-test.1.js```, you will see something like this:

```js
#!/usr/bin/env node
'use strict';

const assert = require('assert');
const path = require('path');
const cp = require('child_process');
const os = require('os');
const fs = require('fs');
const EE = require('events');

process.on('unhandledRejection', (reason, p) => {
  // note: unless we force process to exit with 1, process may exit with 0 upon an unhandledRejection
  console.error(reason);
  process.exit(1);
});

// your test goes here

```

Add these lines at the end:

```js
console.error('whoops');
process.exit(1);

```

Now run ```r2g test```. You will see:

>
> r2g: About to run tests in your .r2g/tests dir.
> r2g: phase-T: Now we are in phase-T...
> r2g: phase-T: whoops
> r2g: [r2g/error] an r2g test failed => a script in this dir failed to exit with code 0: /home/you/.r2g/temp/project/tests
>

To fix this, simply change ```process.exit(1)``` to ```process.exit(0)```. You can put any tests you want in `````.r2g/tests`

__________________________________________________________________


You have now see how the basic three phases work, S,Z,T. They just have random character names.
They should have been in alphabetical order, but S,Z,T is the order in which they are currently run.

To learn more about the  --pack / --full  options, we will save those for another day.


