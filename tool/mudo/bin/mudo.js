#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mudo_1 = require("../../mudo");
var minimist = require("minimist");
var argv = minimist(process.argv.slice(2));
var mudoSpec = {
    client: argv.client || 'client.js',
    server: argv.server || 'server.js',
};

function string_of_enum(enum_dict,value) 
{
  for (var k in enum_dict) if (enum_dict[k] == value) return k;
  return false;
}

function string_to_enum(enum_dict) 
{
  const temp_dict = {};
  for (var k in enum_dict) {temp_dict.join({k:enum_dict[k]})};
  throw new Error(temp_dict)
  throw new Error(JSON.stringify(temp_dict))
  return temp_dict;
}

if ('socket' in argv) {
    var socketType = argv.socket.toUpperCase();
    if (!(string_of_enum(mudo_1.MUDO_SOCKET_TYPES,socketType))) {
        throw new Error("unknown socket type.  must be one of " + Object.keys(JSON.stringify(string_to_enum(mudo_1.MUDO_SOCKET_TYPES))).join());
    }
    mudoSpec.socket = mudo_1.MUDO_SOCKET_TYPES[socketType];
}
if ('port' in argv) {
    mudoSpec.port = argv.port | 0;
}
if ('host' in argv) {
    mudoSpec.host = argv.host;
}
if ('cors' in argv) {
    mudoSpec.cors = !!argv.cors;
}
if ('ssl' in argv) {
    mudoSpec.ssl = !!argv.ssl;
}
if ('cert' in argv) {
    mudoSpec.cert = argv.cert;
}
if ('open' in argv) {
    mudoSpec.open = argv.open;
}
if ('bundle' in argv) {
    mudoSpec.serve = argv.bundle;
}
mudo_1.createMudo(mudoSpec);
//# sourceMappingURL=mudo.js.map