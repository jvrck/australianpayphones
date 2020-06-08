'use strict';
const request = require('request');
const async = require('async');
const geojsonMerge = require('@mapbox/geojson-merge');

function getPayphones() {
  return new Promise(function(resolve, reject){
    try {
      /**
             * Processing variables
             * process: whilst true, continues to loop to download data
             * counter: the request page number and counter used for download requests
             */
      let process = true;
      let counter = 1;

      /**
             * GeoJson variable used to construct the final merged geojson file
             * features: the concatenated feature collection
             * crs: crs information from the service contains epsg projection information
             * metadata: the service returns metadata service in each request that is identical.
             */
      let features = [];
      let crs = null;
      let metadata = null;

      // this is used for timing the execution.
      console.time('Download complete');

      async.whilst(
        function() { return process; },
        function(callback) {
          request(getUrl(counter), function(err, resposne, body) {
            if (err) {
              console.log(err);
              return null;
            }

            if (body){
              // data received
              let data = JSON.parse(body);
              console.log(`Page ${counter} has returned ${data.features.length} features`);

              // extract feature collection
              features = features.concat(data.features);

              // set metadata for merging features
              if (data.Metadata && !metadata){
                metadata = data.Metadata;
              }

              // set crs block for merging features
              if (data.crs && !crs){
                crs = data.crs;
              }

              counter++;

              // // Used to test only 2 itterations
              // if (counter > 2){
              //   reject('This is a mess');
              //   process = false;
              // }

              // check if process needs to continue
              if (data.features.length === 0 || data.features.length < 1000){
                process = false;
              }

              callback(null, counter);
            }
          });
        },
        function(err, n) {
          console.log('Total Features ', features.length);
          // merge feature collection from all downloaded files
          let mergedFeatures = geojsonMerge.merge(features);
          // calculate bbox from merged feature collection
          let mergedBBox = require('@turf/bbox').default(mergedFeatures);

          // add bbox meta and crs to merged features before creating merged files
          mergedFeatures.bbox = mergedBBox;
          mergedFeatures.Metadata = metadata;
          mergedFeatures.crs = crs;

          console.log('Merged features');
          console.log('Complete..');

          if (!err){
            resolve(mergedFeatures);
          }
        });
    } catch (e) {
      reject(e);
    }
  });
}

function getUrl(pageNumber){
  return `https://ppol.pbspectrum.com.au/connect/analyst/controller/connectProxy/rest/Spatial/FeatureService?url=tables/features.json?q=SELECT%20*%20FROM%20%22/Telstra%20PPOL%20Data/Payphones/TLS_All_Payphones%22%20WHERE%20MI_Intersects(obj,MI_Box(112.91944420700005,-54.75042083099999,159.10645592500006,-9.240166924999869,%27EPSG:4283%27))%26page=${pageNumber}%26pageLength=1000`;
}

module.exports = {
  getPayphones,
};
