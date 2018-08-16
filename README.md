
### r2g example project - how to use r2g for publishing NPM packages

--------------------
Watch this video first:


--------------------

Remember that there are 3 test phases, phaseZ/phaseS/phaseT. <br>
See: https://github.com/ORESoftware/r2g

<br>
This tutorial goes in order of the phases.

---------------------

Remember that r2g can catch 4 types of problems:

1. Failure to build/transpile project before publishing, because the built files are not tracked by source control.
2. Missing dependencies - when people install your package with the --production flag, your package might be missing deps.
3. Files that are missing in the NPM tarball: your .npmignore file or "files" property in package.json might be too aggressive/passive.
4. General/unknown problems that relate to using/running your package as a dependency, instead of directly.

---------------------

Basic steps:

1. Clone this repo: `$ git clone https://github.com/ORESoftware/r2g.example.git`

2. install r2g globally - ```$ npm i -g r2g ```

3. Run `$ r2g test` at the cloned project root

>
>  => The first problem is that it says it can't find our package ("r2g.example"). That is because we haven't created the files
>   in the dist/ folder yet. So we build/transpile with tsc. This is the first kind of problem r2g can catch.
>

 
4. Run `$ tsc --watch`, from the root of the project. `npm i -g typescript` if you don't have `tsc` installed. 

5. Run `$ r2g test`  # should pass

>
>  => You might notice "foobar test" in the output, during phase-Z.
>


6. Go into package.json and change "r2g.test" to "r2g.testnot". Now, r2g will default to the `$ npm test` script.

>
>  => In this case, `npm test` will run `node test/simple.js`
>

7. Run `$ r2g test`

>
>  => It will output: 
>  r2g: phase-Z: Directory path which contains the r2g.example index file: /home/oleg/.r2g/temp/copy/r2g.example/dist
>


8. Go into test/simple.js and switch to `require('r2g.example')` instead of `require('../dist')`, then run `$ r2g test`

>
>  => It will output:  
>  r2g: phase-Z: Directory path which contains the r2g.example index file: /home/oleg/.r2g/temp/project/node_modules/r2g.example/dist
>


9. The difference between 7 and 8 is important. 7 loads the regular unpacked version of your package, and 8 will load a
previously packed version of your package. Using 7 will `npm test` your package as usual. Using 8 will `npm test` your package
in a way that tests itself as a dependency of itself and having been previously packed with NPM pack.


10. Now, go into src/index.ts. Change r2gSmokeTest to r2gSmokeTestFoo. Run `$ r2g test`.

>
>  => It will output:  
>  r2g: phase-S: A module failed to export a function from "main" with key "r2gSmokeTest".
>  r2g: phase-S: The module/package missing this export has the following name:
>  r2g: phase-S: r2g.example
>

This means that your main (dist/index.js) failed to export a function with name r2gSmokeTest, because we changed it
to r2gSmokeTestFoo, lulz.

11. Change r2gSmokeTestFoo back to r2gSmokeTest, but return false from the function instead of true.

>
>  => It will output:  
>  r2g: phase-S: At least one exported "r2gSmokeTest" function failed.
>  r2g: phase-S: Error: [ { path: 'r2g.example', result: false } ]
>

12. Your r2gSmokeTest function must return true, and no other value is acceptable. To skip this test, use --skip=s or -s.

<br>

For example, you can try using this for your r2gSmokeTest:

```js
export const r2gSmokeTest = async () => {
  const z = exports.z;
  const v = await z.foo();
  return v === 'foo';
}
```




