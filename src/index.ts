'use strict';

export const z = {
  async foo()  {
    return 'foo';
  }
};

export const r2gSmokeTest = async () => {
  // r2g command line app uses this exported function
  return true;
};


export const getDirName = ()=> {
  return __dirname;
};



