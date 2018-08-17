'use strict';

//core
import * as cp from 'child_process';
import * as fs from 'fs';
import * as assert from 'assert';
import * as path from 'path';

//npm
import {Subject} from 'rxjs';


export const z = {
  async foo()  {
    return 'foo';
  }
};

export const r2gSmokeTest = async () : Promise<boolean> => {
  // r2g command line app uses this exported function
  // must return boolean true to pass
  return Boolean(new Subject());
};


export const getDirName = ()=> {
  return __dirname;
};


export type EVCb<T> = (err: any, val?: T) => void;

export const runZoom = (cb: EVCb<true>) => {
  
  const k = cp.spawn('bash');
  const sh = path.resolve(__dirname + '/../assets/zoom.sh');
  
  fs.createReadStream(sh)
  .pipe(k.stdin)
  .once('error', cb);
  
  let stdout = '';
  
  k.stdout.on('data', d => {
     stdout += String(d || '').trim();
  });
  
  k.once('exit', code => {
    
    try{
      assert.strictEqual(code, 0);
      assert.strictEqual(stdout,'this is the zoom');
      cb(null, true);
    }
    catch (e) {
      cb(e);
    }
  
  });
  
};


