const K8 = require('k8mvc');
const fs = require('fs');

const guardRegisterd = (hostname, reply) =>{
  //guard site registered.
  if(!fs.existsSync(`${K8.EXE_PATH}/../sites/${hostname}`)){
    reply.code(404);
    return true;
  }
  return false;
};

const resolve = async(Controller, request, reply) => {
  try{
    const {benchmarkReset, benchmark, getBenchmarkRecords} = K8.require('DevUtils');
    benchmarkReset();
    benchmark('start');

    //import controller
    const c = new Controller(request, reply);

    benchmark('init Controller');

    await c.execute();

    benchmark('exec Controller');

    let debugText = `cache-exports:${K8.config.cache.exports}<br>`+`cache-database:${K8.config.cache.database}<br>`+`cache-view:${K8.config.cache.view}<br>`+JSON.stringify(getBenchmarkRecords().map(x => ({label: x.label, ms: x.delta})))+'<hr/>';

    debugText += '<br>' + JSON.stringify(K8.configPath) + '<hr>';

    for(let name in K8.classPath){
      debugText += `<br>${name} : ${K8.classPath[name]}`;
    }

    K8.clearCache();
    if(!K8.config.cache.view){
      K8.require('View').clearCache();
    }

    return c.output + '<div style="background-color: #000; color: #AAA; font-family: monospace; font-size: 12px; padding: 1em;">' + debugText + '</div>';
  }catch(err){
    K8.clearCache();
    if(!K8.config.cache.view){
      K8.require('View').clearCache();
    }

    throw err;
  }
};

module.exports = {
  resolveRoute : resolve
};