'use strict';
const data = require('./src/payphones');

data.getPayphones()
  .then(payphoneData => {
    // console.log(payphoneData);
  })
  .catch(payphoneDataError => {
    // error getting file
    console.log('Get payphone error');
    console.log(payphoneDataError);
  });
