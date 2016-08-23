const path = require('path'),
    protobuf = require('protobufjs');

const builder = protobuf.newBuilder();
const textFile = `
syntax = "proto3";
package POGOProtos;

import public "POGOProtos.Data.proto";
import public "POGOProtos.Data.Battle.proto";
import public "POGOProtos.Data.Capture.proto";
import public "POGOProtos.Data.Gym.proto";
import public "POGOProtos.Data.Logs.proto";
import public "POGOProtos.Data.Player.proto";
import public "POGOProtos.Enums.proto";
import public "POGOProtos.Inventory.proto";
import public "POGOProtos.Inventory.Item.proto";
import public "POGOProtos.Map.proto";
import public "POGOProtos.Map.Fort.proto";
import public "POGOProtos.Map.Pokemon.proto";
import public "POGOProtos.Networking.Envelopes.proto";
import public "POGOProtos.Networking.Requests.proto";
import public "POGOProtos.Networking.Requests.Messages.proto";
import public "POGOProtos.Networking.Responses.proto";
import public "POGOProtos.Settings.proto";
import public "POGOProtos.Settings.Master.proto";
import public "POGOProtos.Settings.Master.Item.proto";
import public "POGOProtos.Settings.Master.Pokemon.proto";
`
const filename = path.join(__dirname, 'proto', 'POGOProtos.proto')

protobuf.loadProto(textFile, builder, filename);

// Recursively add the packed=true option to all packable repeated fields.
// Repeated fields are packed by default in proto3 but protobuf.js incorrectly does not set the option.
// See also: https://github.com/dcodeIO/protobuf.js/issues/432
function addPackedOption(ns) {
    if (ns instanceof protobuf.Reflect.Message) {
        ns.getChildren(protobuf.Reflect.Field).forEach(field => {
            if (field.repeated && protobuf.PACKABLE_WIRE_TYPES.indexOf(field.type.wireType) != -1) {
                field.options.packed = true;
            }
        });
    } else if (ns instanceof protobuf.Reflect.Namespace) {
        ns.children.forEach(addPackedOption);
    }
}
addPackedOption(builder.lookup('POGOProtos'));

module.exports = builder.build("POGOProtos");
