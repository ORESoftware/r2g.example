'use strict';

import {Subject} from 'rxjs';

export const z = {
  async foo()  {
    return 'foo';
  }
};

export const r2gSmokeTest = async () => {
  // r2g command line app uses this exported function
  // must return boolean true to pass
  return Boolean(new Subject());
};


export const getDirName = ()=> {
  return __dirname;
};



