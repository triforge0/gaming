/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const com = $root.com = (() => {

    /**
     * Namespace com.
     * @exports com
     * @namespace
     */
    const com = {};

    com.triforge = (function() {

        /**
         * Namespace triforge.
         * @memberof com
         * @namespace
         */
        const triforge = {};

        triforge.protocol = (function() {

            /**
             * Namespace protocol.
             * @memberof com.triforge
             * @namespace
             */
            const protocol = {};

            protocol.proto = (function() {

                /**
                 * Namespace proto.
                 * @memberof com.triforge.protocol
                 * @namespace
                 */
                const proto = {};

                proto.MessageEnvelope = (function() {

                    /**
                     * Properties of a MessageEnvelope.
                     * @memberof com.triforge.protocol.proto
                     * @interface IMessageEnvelope
                     * @property {string|null} [roomId] MessageEnvelope roomId
                     * @property {number|Long|null} [tick] MessageEnvelope tick
                     * @property {number|Long|null} [msgId] MessageEnvelope msgId
                     * @property {number|Long|null} [clientSeq] MessageEnvelope clientSeq
                     * @property {number|Long|null} [serverSeq] MessageEnvelope serverSeq
                     * @property {string|null} [schemaVersion] MessageEnvelope schemaVersion
                     * @property {Uint8Array|null} [payload] MessageEnvelope payload
                     */

                    /**
                     * Constructs a new MessageEnvelope.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a MessageEnvelope.
                     * @implements IMessageEnvelope
                     * @constructor
                     * @param {com.triforge.protocol.proto.IMessageEnvelope=} [properties] Properties to set
                     */
                    function MessageEnvelope(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * MessageEnvelope roomId.
                     * @member {string} roomId
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @instance
                     */
                    MessageEnvelope.prototype.roomId = "";

                    /**
                     * MessageEnvelope tick.
                     * @member {number|Long} tick
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @instance
                     */
                    MessageEnvelope.prototype.tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * MessageEnvelope msgId.
                     * @member {number|Long} msgId
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @instance
                     */
                    MessageEnvelope.prototype.msgId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * MessageEnvelope clientSeq.
                     * @member {number|Long} clientSeq
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @instance
                     */
                    MessageEnvelope.prototype.clientSeq = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * MessageEnvelope serverSeq.
                     * @member {number|Long} serverSeq
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @instance
                     */
                    MessageEnvelope.prototype.serverSeq = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * MessageEnvelope schemaVersion.
                     * @member {string} schemaVersion
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @instance
                     */
                    MessageEnvelope.prototype.schemaVersion = "";

                    /**
                     * MessageEnvelope payload.
                     * @member {Uint8Array} payload
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @instance
                     */
                    MessageEnvelope.prototype.payload = $util.newBuffer([]);

                    /**
                     * Creates a new MessageEnvelope instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @static
                     * @param {com.triforge.protocol.proto.IMessageEnvelope=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.MessageEnvelope} MessageEnvelope instance
                     */
                    MessageEnvelope.create = function create(properties) {
                        return new MessageEnvelope(properties);
                    };

                    /**
                     * Encodes the specified MessageEnvelope message. Does not implicitly {@link com.triforge.protocol.proto.MessageEnvelope.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @static
                     * @param {com.triforge.protocol.proto.IMessageEnvelope} message MessageEnvelope message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MessageEnvelope.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
                        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.tick);
                        if (message.msgId != null && Object.hasOwnProperty.call(message, "msgId"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.msgId);
                        if (message.clientSeq != null && Object.hasOwnProperty.call(message, "clientSeq"))
                            writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.clientSeq);
                        if (message.serverSeq != null && Object.hasOwnProperty.call(message, "serverSeq"))
                            writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.serverSeq);
                        if (message.schemaVersion != null && Object.hasOwnProperty.call(message, "schemaVersion"))
                            writer.uint32(/* id 6, wireType 2 =*/50).string(message.schemaVersion);
                        if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
                            writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.payload);
                        return writer;
                    };

                    /**
                     * Encodes the specified MessageEnvelope message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.MessageEnvelope.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @static
                     * @param {com.triforge.protocol.proto.IMessageEnvelope} message MessageEnvelope message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MessageEnvelope.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a MessageEnvelope message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.MessageEnvelope} MessageEnvelope
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MessageEnvelope.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.MessageEnvelope();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.roomId = reader.string();
                                    break;
                                }
                            case 2: {
                                    message.tick = reader.uint64();
                                    break;
                                }
                            case 3: {
                                    message.msgId = reader.uint64();
                                    break;
                                }
                            case 4: {
                                    message.clientSeq = reader.uint64();
                                    break;
                                }
                            case 5: {
                                    message.serverSeq = reader.uint64();
                                    break;
                                }
                            case 6: {
                                    message.schemaVersion = reader.string();
                                    break;
                                }
                            case 7: {
                                    message.payload = reader.bytes();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MessageEnvelope message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.MessageEnvelope} MessageEnvelope
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MessageEnvelope.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MessageEnvelope message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MessageEnvelope.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                            if (!$util.isString(message.roomId))
                                return "roomId: string expected";
                        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                            if (!$util.isInteger(message.tick) && !(message.tick && $util.isInteger(message.tick.low) && $util.isInteger(message.tick.high)))
                                return "tick: integer|Long expected";
                        if (message.msgId != null && Object.hasOwnProperty.call(message, "msgId"))
                            if (!$util.isInteger(message.msgId) && !(message.msgId && $util.isInteger(message.msgId.low) && $util.isInteger(message.msgId.high)))
                                return "msgId: integer|Long expected";
                        if (message.clientSeq != null && Object.hasOwnProperty.call(message, "clientSeq"))
                            if (!$util.isInteger(message.clientSeq) && !(message.clientSeq && $util.isInteger(message.clientSeq.low) && $util.isInteger(message.clientSeq.high)))
                                return "clientSeq: integer|Long expected";
                        if (message.serverSeq != null && Object.hasOwnProperty.call(message, "serverSeq"))
                            if (!$util.isInteger(message.serverSeq) && !(message.serverSeq && $util.isInteger(message.serverSeq.low) && $util.isInteger(message.serverSeq.high)))
                                return "serverSeq: integer|Long expected";
                        if (message.schemaVersion != null && Object.hasOwnProperty.call(message, "schemaVersion"))
                            if (!$util.isString(message.schemaVersion))
                                return "schemaVersion: string expected";
                        if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
                            if (!(message.payload && typeof message.payload.length === "number" || $util.isString(message.payload)))
                                return "payload: buffer expected";
                        return null;
                    };

                    /**
                     * Creates a MessageEnvelope message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.MessageEnvelope} MessageEnvelope
                     */
                    MessageEnvelope.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.MessageEnvelope)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.MessageEnvelope: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.MessageEnvelope();
                        if (object.roomId != null)
                            message.roomId = String(object.roomId);
                        if (object.tick != null)
                            if ($util.Long)
                                message.tick = $util.Long.fromValue(object.tick, true);
                            else if (typeof object.tick === "string")
                                message.tick = parseInt(object.tick, 10);
                            else if (typeof object.tick === "number")
                                message.tick = object.tick;
                            else if (typeof object.tick === "object")
                                message.tick = new $util.LongBits(object.tick.low >>> 0, object.tick.high >>> 0).toNumber(true);
                        if (object.msgId != null)
                            if ($util.Long)
                                message.msgId = $util.Long.fromValue(object.msgId, true);
                            else if (typeof object.msgId === "string")
                                message.msgId = parseInt(object.msgId, 10);
                            else if (typeof object.msgId === "number")
                                message.msgId = object.msgId;
                            else if (typeof object.msgId === "object")
                                message.msgId = new $util.LongBits(object.msgId.low >>> 0, object.msgId.high >>> 0).toNumber(true);
                        if (object.clientSeq != null)
                            if ($util.Long)
                                message.clientSeq = $util.Long.fromValue(object.clientSeq, true);
                            else if (typeof object.clientSeq === "string")
                                message.clientSeq = parseInt(object.clientSeq, 10);
                            else if (typeof object.clientSeq === "number")
                                message.clientSeq = object.clientSeq;
                            else if (typeof object.clientSeq === "object")
                                message.clientSeq = new $util.LongBits(object.clientSeq.low >>> 0, object.clientSeq.high >>> 0).toNumber(true);
                        if (object.serverSeq != null)
                            if ($util.Long)
                                message.serverSeq = $util.Long.fromValue(object.serverSeq, true);
                            else if (typeof object.serverSeq === "string")
                                message.serverSeq = parseInt(object.serverSeq, 10);
                            else if (typeof object.serverSeq === "number")
                                message.serverSeq = object.serverSeq;
                            else if (typeof object.serverSeq === "object")
                                message.serverSeq = new $util.LongBits(object.serverSeq.low >>> 0, object.serverSeq.high >>> 0).toNumber(true);
                        if (object.schemaVersion != null)
                            message.schemaVersion = String(object.schemaVersion);
                        if (object.payload != null)
                            if (typeof object.payload === "string")
                                $util.base64.decode(object.payload, message.payload = $util.newBuffer($util.base64.length(object.payload)), 0);
                            else if (object.payload.length >= 0)
                                message.payload = object.payload;
                        return message;
                    };

                    /**
                     * Creates a plain object from a MessageEnvelope message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @static
                     * @param {com.triforge.protocol.proto.MessageEnvelope} message MessageEnvelope
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MessageEnvelope.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            object.roomId = "";
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.tick = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.tick = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.msgId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.msgId = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.clientSeq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.clientSeq = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.serverSeq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.serverSeq = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            object.schemaVersion = "";
                            if (options.bytes === String)
                                object.payload = "";
                            else {
                                object.payload = [];
                                if (options.bytes !== Array)
                                    object.payload = $util.newBuffer(object.payload);
                            }
                        }
                        if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                            object.roomId = message.roomId;
                        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.tick = typeof message.tick === "number" ? BigInt(message.tick) : $util.Long.fromBits(message.tick.low >>> 0, message.tick.high >>> 0, true).toBigInt();
                            else if (typeof message.tick === "number")
                                object.tick = options.longs === String ? String(message.tick) : message.tick;
                            else
                                object.tick = options.longs === String ? $util.Long.prototype.toString.call(message.tick) : options.longs === Number ? new $util.LongBits(message.tick.low >>> 0, message.tick.high >>> 0).toNumber(true) : message.tick;
                        if (message.msgId != null && Object.hasOwnProperty.call(message, "msgId"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.msgId = typeof message.msgId === "number" ? BigInt(message.msgId) : $util.Long.fromBits(message.msgId.low >>> 0, message.msgId.high >>> 0, true).toBigInt();
                            else if (typeof message.msgId === "number")
                                object.msgId = options.longs === String ? String(message.msgId) : message.msgId;
                            else
                                object.msgId = options.longs === String ? $util.Long.prototype.toString.call(message.msgId) : options.longs === Number ? new $util.LongBits(message.msgId.low >>> 0, message.msgId.high >>> 0).toNumber(true) : message.msgId;
                        if (message.clientSeq != null && Object.hasOwnProperty.call(message, "clientSeq"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.clientSeq = typeof message.clientSeq === "number" ? BigInt(message.clientSeq) : $util.Long.fromBits(message.clientSeq.low >>> 0, message.clientSeq.high >>> 0, true).toBigInt();
                            else if (typeof message.clientSeq === "number")
                                object.clientSeq = options.longs === String ? String(message.clientSeq) : message.clientSeq;
                            else
                                object.clientSeq = options.longs === String ? $util.Long.prototype.toString.call(message.clientSeq) : options.longs === Number ? new $util.LongBits(message.clientSeq.low >>> 0, message.clientSeq.high >>> 0).toNumber(true) : message.clientSeq;
                        if (message.serverSeq != null && Object.hasOwnProperty.call(message, "serverSeq"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.serverSeq = typeof message.serverSeq === "number" ? BigInt(message.serverSeq) : $util.Long.fromBits(message.serverSeq.low >>> 0, message.serverSeq.high >>> 0, true).toBigInt();
                            else if (typeof message.serverSeq === "number")
                                object.serverSeq = options.longs === String ? String(message.serverSeq) : message.serverSeq;
                            else
                                object.serverSeq = options.longs === String ? $util.Long.prototype.toString.call(message.serverSeq) : options.longs === Number ? new $util.LongBits(message.serverSeq.low >>> 0, message.serverSeq.high >>> 0).toNumber(true) : message.serverSeq;
                        if (message.schemaVersion != null && Object.hasOwnProperty.call(message, "schemaVersion"))
                            object.schemaVersion = message.schemaVersion;
                        if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
                            object.payload = options.bytes === String ? $util.base64.encode(message.payload, 0, message.payload.length) : options.bytes === Array ? Array.prototype.slice.call(message.payload) : message.payload;
                        return object;
                    };

                    /**
                     * Converts this MessageEnvelope to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MessageEnvelope.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for MessageEnvelope
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.MessageEnvelope
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    MessageEnvelope.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.MessageEnvelope";
                    };

                    return MessageEnvelope;
                })();

                proto.GameMessage = (function() {

                    /**
                     * Properties of a GameMessage.
                     * @memberof com.triforge.protocol.proto
                     * @interface IGameMessage
                     * @property {com.triforge.protocol.proto.IJoinRequest|null} [joinRequest] GameMessage joinRequest
                     * @property {com.triforge.protocol.proto.IJoinResponse|null} [joinResponse] GameMessage joinResponse
                     * @property {com.triforge.protocol.proto.IFullSnapshot|null} [fullSnapshot] GameMessage fullSnapshot
                     * @property {com.triforge.protocol.proto.IDeltaSnapshot|null} [deltaSnapshot] GameMessage deltaSnapshot
                     * @property {com.triforge.protocol.proto.IInputCommand|null} [inputCommand] GameMessage inputCommand
                     * @property {com.triforge.protocol.proto.IGameEvent|null} [gameEvent] GameMessage gameEvent
                     * @property {com.triforge.protocol.proto.ILobbyCommand|null} [lobbyCommand] GameMessage lobbyCommand
                     * @property {com.triforge.protocol.proto.IRoomLobbySnapshot|null} [roomLobbySnapshot] GameMessage roomLobbySnapshot
                     * @property {com.triforge.protocol.proto.IMatchPhaseUpdate|null} [matchPhaseUpdate] GameMessage matchPhaseUpdate
                     * @property {com.triforge.protocol.proto.IMatchResult|null} [matchResult] GameMessage matchResult
                     * @property {com.triforge.protocol.proto.IMapSnapshot|null} [mapSnapshot] GameMessage mapSnapshot
                     */

                    /**
                     * Constructs a new GameMessage.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a GameMessage.
                     * @implements IGameMessage
                     * @constructor
                     * @param {com.triforge.protocol.proto.IGameMessage=} [properties] Properties to set
                     */
                    function GameMessage(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * GameMessage joinRequest.
                     * @member {com.triforge.protocol.proto.IJoinRequest|null|undefined} joinRequest
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @instance
                     */
                    GameMessage.prototype.joinRequest = null;

                    /**
                     * GameMessage joinResponse.
                     * @member {com.triforge.protocol.proto.IJoinResponse|null|undefined} joinResponse
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @instance
                     */
                    GameMessage.prototype.joinResponse = null;

                    /**
                     * GameMessage fullSnapshot.
                     * @member {com.triforge.protocol.proto.IFullSnapshot|null|undefined} fullSnapshot
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @instance
                     */
                    GameMessage.prototype.fullSnapshot = null;

                    /**
                     * GameMessage deltaSnapshot.
                     * @member {com.triforge.protocol.proto.IDeltaSnapshot|null|undefined} deltaSnapshot
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @instance
                     */
                    GameMessage.prototype.deltaSnapshot = null;

                    /**
                     * GameMessage inputCommand.
                     * @member {com.triforge.protocol.proto.IInputCommand|null|undefined} inputCommand
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @instance
                     */
                    GameMessage.prototype.inputCommand = null;

                    /**
                     * GameMessage gameEvent.
                     * @member {com.triforge.protocol.proto.IGameEvent|null|undefined} gameEvent
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @instance
                     */
                    GameMessage.prototype.gameEvent = null;

                    /**
                     * GameMessage lobbyCommand.
                     * @member {com.triforge.protocol.proto.ILobbyCommand|null|undefined} lobbyCommand
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @instance
                     */
                    GameMessage.prototype.lobbyCommand = null;

                    /**
                     * GameMessage roomLobbySnapshot.
                     * @member {com.triforge.protocol.proto.IRoomLobbySnapshot|null|undefined} roomLobbySnapshot
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @instance
                     */
                    GameMessage.prototype.roomLobbySnapshot = null;

                    /**
                     * GameMessage matchPhaseUpdate.
                     * @member {com.triforge.protocol.proto.IMatchPhaseUpdate|null|undefined} matchPhaseUpdate
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @instance
                     */
                    GameMessage.prototype.matchPhaseUpdate = null;

                    /**
                     * GameMessage matchResult.
                     * @member {com.triforge.protocol.proto.IMatchResult|null|undefined} matchResult
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @instance
                     */
                    GameMessage.prototype.matchResult = null;

                    /**
                     * GameMessage mapSnapshot.
                     * @member {com.triforge.protocol.proto.IMapSnapshot|null|undefined} mapSnapshot
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @instance
                     */
                    GameMessage.prototype.mapSnapshot = null;

                    // OneOf field names bound to virtual getters and setters
                    let $oneOfFields;

                    /**
                     * GameMessage content.
                     * @member {"joinRequest"|"joinResponse"|"fullSnapshot"|"deltaSnapshot"|"inputCommand"|"gameEvent"|"lobbyCommand"|"roomLobbySnapshot"|"matchPhaseUpdate"|"matchResult"|"mapSnapshot"|undefined} content
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @instance
                     */
                    Object.defineProperty(GameMessage.prototype, "content", {
                        get: $util.oneOfGetter($oneOfFields = ["joinRequest", "joinResponse", "fullSnapshot", "deltaSnapshot", "inputCommand", "gameEvent", "lobbyCommand", "roomLobbySnapshot", "matchPhaseUpdate", "matchResult", "mapSnapshot"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    /**
                     * Creates a new GameMessage instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @static
                     * @param {com.triforge.protocol.proto.IGameMessage=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.GameMessage} GameMessage instance
                     */
                    GameMessage.create = function create(properties) {
                        return new GameMessage(properties);
                    };

                    /**
                     * Encodes the specified GameMessage message. Does not implicitly {@link com.triforge.protocol.proto.GameMessage.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @static
                     * @param {com.triforge.protocol.proto.IGameMessage} message GameMessage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    GameMessage.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.joinRequest != null && Object.hasOwnProperty.call(message, "joinRequest"))
                            $root.com.triforge.protocol.proto.JoinRequest.encode(message.joinRequest, writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
                        if (message.joinResponse != null && Object.hasOwnProperty.call(message, "joinResponse"))
                            $root.com.triforge.protocol.proto.JoinResponse.encode(message.joinResponse, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                        if (message.fullSnapshot != null && Object.hasOwnProperty.call(message, "fullSnapshot"))
                            $root.com.triforge.protocol.proto.FullSnapshot.encode(message.fullSnapshot, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
                        if (message.deltaSnapshot != null && Object.hasOwnProperty.call(message, "deltaSnapshot"))
                            $root.com.triforge.protocol.proto.DeltaSnapshot.encode(message.deltaSnapshot, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
                        if (message.inputCommand != null && Object.hasOwnProperty.call(message, "inputCommand"))
                            $root.com.triforge.protocol.proto.InputCommand.encode(message.inputCommand, writer.uint32(/* id 5, wireType 2 =*/42).fork(), q + 1).ldelim();
                        if (message.gameEvent != null && Object.hasOwnProperty.call(message, "gameEvent"))
                            $root.com.triforge.protocol.proto.GameEvent.encode(message.gameEvent, writer.uint32(/* id 6, wireType 2 =*/50).fork(), q + 1).ldelim();
                        if (message.lobbyCommand != null && Object.hasOwnProperty.call(message, "lobbyCommand"))
                            $root.com.triforge.protocol.proto.LobbyCommand.encode(message.lobbyCommand, writer.uint32(/* id 7, wireType 2 =*/58).fork(), q + 1).ldelim();
                        if (message.roomLobbySnapshot != null && Object.hasOwnProperty.call(message, "roomLobbySnapshot"))
                            $root.com.triforge.protocol.proto.RoomLobbySnapshot.encode(message.roomLobbySnapshot, writer.uint32(/* id 8, wireType 2 =*/66).fork(), q + 1).ldelim();
                        if (message.matchPhaseUpdate != null && Object.hasOwnProperty.call(message, "matchPhaseUpdate"))
                            $root.com.triforge.protocol.proto.MatchPhaseUpdate.encode(message.matchPhaseUpdate, writer.uint32(/* id 9, wireType 2 =*/74).fork(), q + 1).ldelim();
                        if (message.matchResult != null && Object.hasOwnProperty.call(message, "matchResult"))
                            $root.com.triforge.protocol.proto.MatchResult.encode(message.matchResult, writer.uint32(/* id 10, wireType 2 =*/82).fork(), q + 1).ldelim();
                        if (message.mapSnapshot != null && Object.hasOwnProperty.call(message, "mapSnapshot"))
                            $root.com.triforge.protocol.proto.MapSnapshot.encode(message.mapSnapshot, writer.uint32(/* id 11, wireType 2 =*/90).fork(), q + 1).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified GameMessage message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.GameMessage.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @static
                     * @param {com.triforge.protocol.proto.IGameMessage} message GameMessage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    GameMessage.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a GameMessage message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.GameMessage} GameMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    GameMessage.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.GameMessage();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.joinRequest = $root.com.triforge.protocol.proto.JoinRequest.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 2: {
                                    message.joinResponse = $root.com.triforge.protocol.proto.JoinResponse.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 3: {
                                    message.fullSnapshot = $root.com.triforge.protocol.proto.FullSnapshot.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 4: {
                                    message.deltaSnapshot = $root.com.triforge.protocol.proto.DeltaSnapshot.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 5: {
                                    message.inputCommand = $root.com.triforge.protocol.proto.InputCommand.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 6: {
                                    message.gameEvent = $root.com.triforge.protocol.proto.GameEvent.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 7: {
                                    message.lobbyCommand = $root.com.triforge.protocol.proto.LobbyCommand.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 8: {
                                    message.roomLobbySnapshot = $root.com.triforge.protocol.proto.RoomLobbySnapshot.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 9: {
                                    message.matchPhaseUpdate = $root.com.triforge.protocol.proto.MatchPhaseUpdate.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 10: {
                                    message.matchResult = $root.com.triforge.protocol.proto.MatchResult.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 11: {
                                    message.mapSnapshot = $root.com.triforge.protocol.proto.MapSnapshot.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a GameMessage message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.GameMessage} GameMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    GameMessage.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a GameMessage message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    GameMessage.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        let properties = {};
                        if (message.joinRequest != null && Object.hasOwnProperty.call(message, "joinRequest")) {
                            properties.content = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.JoinRequest.verify(message.joinRequest, long + 1);
                                if (error)
                                    return "joinRequest." + error;
                            }
                        }
                        if (message.joinResponse != null && Object.hasOwnProperty.call(message, "joinResponse")) {
                            if (properties.content === 1)
                                return "content: multiple values";
                            properties.content = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.JoinResponse.verify(message.joinResponse, long + 1);
                                if (error)
                                    return "joinResponse." + error;
                            }
                        }
                        if (message.fullSnapshot != null && Object.hasOwnProperty.call(message, "fullSnapshot")) {
                            if (properties.content === 1)
                                return "content: multiple values";
                            properties.content = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.FullSnapshot.verify(message.fullSnapshot, long + 1);
                                if (error)
                                    return "fullSnapshot." + error;
                            }
                        }
                        if (message.deltaSnapshot != null && Object.hasOwnProperty.call(message, "deltaSnapshot")) {
                            if (properties.content === 1)
                                return "content: multiple values";
                            properties.content = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.DeltaSnapshot.verify(message.deltaSnapshot, long + 1);
                                if (error)
                                    return "deltaSnapshot." + error;
                            }
                        }
                        if (message.inputCommand != null && Object.hasOwnProperty.call(message, "inputCommand")) {
                            if (properties.content === 1)
                                return "content: multiple values";
                            properties.content = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.InputCommand.verify(message.inputCommand, long + 1);
                                if (error)
                                    return "inputCommand." + error;
                            }
                        }
                        if (message.gameEvent != null && Object.hasOwnProperty.call(message, "gameEvent")) {
                            if (properties.content === 1)
                                return "content: multiple values";
                            properties.content = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.GameEvent.verify(message.gameEvent, long + 1);
                                if (error)
                                    return "gameEvent." + error;
                            }
                        }
                        if (message.lobbyCommand != null && Object.hasOwnProperty.call(message, "lobbyCommand")) {
                            if (properties.content === 1)
                                return "content: multiple values";
                            properties.content = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.LobbyCommand.verify(message.lobbyCommand, long + 1);
                                if (error)
                                    return "lobbyCommand." + error;
                            }
                        }
                        if (message.roomLobbySnapshot != null && Object.hasOwnProperty.call(message, "roomLobbySnapshot")) {
                            if (properties.content === 1)
                                return "content: multiple values";
                            properties.content = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.RoomLobbySnapshot.verify(message.roomLobbySnapshot, long + 1);
                                if (error)
                                    return "roomLobbySnapshot." + error;
                            }
                        }
                        if (message.matchPhaseUpdate != null && Object.hasOwnProperty.call(message, "matchPhaseUpdate")) {
                            if (properties.content === 1)
                                return "content: multiple values";
                            properties.content = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.MatchPhaseUpdate.verify(message.matchPhaseUpdate, long + 1);
                                if (error)
                                    return "matchPhaseUpdate." + error;
                            }
                        }
                        if (message.matchResult != null && Object.hasOwnProperty.call(message, "matchResult")) {
                            if (properties.content === 1)
                                return "content: multiple values";
                            properties.content = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.MatchResult.verify(message.matchResult, long + 1);
                                if (error)
                                    return "matchResult." + error;
                            }
                        }
                        if (message.mapSnapshot != null && Object.hasOwnProperty.call(message, "mapSnapshot")) {
                            if (properties.content === 1)
                                return "content: multiple values";
                            properties.content = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.MapSnapshot.verify(message.mapSnapshot, long + 1);
                                if (error)
                                    return "mapSnapshot." + error;
                            }
                        }
                        return null;
                    };

                    /**
                     * Creates a GameMessage message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.GameMessage} GameMessage
                     */
                    GameMessage.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.GameMessage)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.GameMessage: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.GameMessage();
                        if (object.joinRequest != null) {
                            if (!$util.isObject(object.joinRequest))
                                throw TypeError(".com.triforge.protocol.proto.GameMessage.joinRequest: object expected");
                            message.joinRequest = $root.com.triforge.protocol.proto.JoinRequest.fromObject(object.joinRequest, long + 1);
                        }
                        if (object.joinResponse != null) {
                            if (!$util.isObject(object.joinResponse))
                                throw TypeError(".com.triforge.protocol.proto.GameMessage.joinResponse: object expected");
                            message.joinResponse = $root.com.triforge.protocol.proto.JoinResponse.fromObject(object.joinResponse, long + 1);
                        }
                        if (object.fullSnapshot != null) {
                            if (!$util.isObject(object.fullSnapshot))
                                throw TypeError(".com.triforge.protocol.proto.GameMessage.fullSnapshot: object expected");
                            message.fullSnapshot = $root.com.triforge.protocol.proto.FullSnapshot.fromObject(object.fullSnapshot, long + 1);
                        }
                        if (object.deltaSnapshot != null) {
                            if (!$util.isObject(object.deltaSnapshot))
                                throw TypeError(".com.triforge.protocol.proto.GameMessage.deltaSnapshot: object expected");
                            message.deltaSnapshot = $root.com.triforge.protocol.proto.DeltaSnapshot.fromObject(object.deltaSnapshot, long + 1);
                        }
                        if (object.inputCommand != null) {
                            if (!$util.isObject(object.inputCommand))
                                throw TypeError(".com.triforge.protocol.proto.GameMessage.inputCommand: object expected");
                            message.inputCommand = $root.com.triforge.protocol.proto.InputCommand.fromObject(object.inputCommand, long + 1);
                        }
                        if (object.gameEvent != null) {
                            if (!$util.isObject(object.gameEvent))
                                throw TypeError(".com.triforge.protocol.proto.GameMessage.gameEvent: object expected");
                            message.gameEvent = $root.com.triforge.protocol.proto.GameEvent.fromObject(object.gameEvent, long + 1);
                        }
                        if (object.lobbyCommand != null) {
                            if (!$util.isObject(object.lobbyCommand))
                                throw TypeError(".com.triforge.protocol.proto.GameMessage.lobbyCommand: object expected");
                            message.lobbyCommand = $root.com.triforge.protocol.proto.LobbyCommand.fromObject(object.lobbyCommand, long + 1);
                        }
                        if (object.roomLobbySnapshot != null) {
                            if (!$util.isObject(object.roomLobbySnapshot))
                                throw TypeError(".com.triforge.protocol.proto.GameMessage.roomLobbySnapshot: object expected");
                            message.roomLobbySnapshot = $root.com.triforge.protocol.proto.RoomLobbySnapshot.fromObject(object.roomLobbySnapshot, long + 1);
                        }
                        if (object.matchPhaseUpdate != null) {
                            if (!$util.isObject(object.matchPhaseUpdate))
                                throw TypeError(".com.triforge.protocol.proto.GameMessage.matchPhaseUpdate: object expected");
                            message.matchPhaseUpdate = $root.com.triforge.protocol.proto.MatchPhaseUpdate.fromObject(object.matchPhaseUpdate, long + 1);
                        }
                        if (object.matchResult != null) {
                            if (!$util.isObject(object.matchResult))
                                throw TypeError(".com.triforge.protocol.proto.GameMessage.matchResult: object expected");
                            message.matchResult = $root.com.triforge.protocol.proto.MatchResult.fromObject(object.matchResult, long + 1);
                        }
                        if (object.mapSnapshot != null) {
                            if (!$util.isObject(object.mapSnapshot))
                                throw TypeError(".com.triforge.protocol.proto.GameMessage.mapSnapshot: object expected");
                            message.mapSnapshot = $root.com.triforge.protocol.proto.MapSnapshot.fromObject(object.mapSnapshot, long + 1);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a GameMessage message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @static
                     * @param {com.triforge.protocol.proto.GameMessage} message GameMessage
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    GameMessage.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (message.joinRequest != null && Object.hasOwnProperty.call(message, "joinRequest")) {
                            object.joinRequest = $root.com.triforge.protocol.proto.JoinRequest.toObject(message.joinRequest, options, q + 1);
                            if (options.oneofs)
                                object.content = "joinRequest";
                        }
                        if (message.joinResponse != null && Object.hasOwnProperty.call(message, "joinResponse")) {
                            object.joinResponse = $root.com.triforge.protocol.proto.JoinResponse.toObject(message.joinResponse, options, q + 1);
                            if (options.oneofs)
                                object.content = "joinResponse";
                        }
                        if (message.fullSnapshot != null && Object.hasOwnProperty.call(message, "fullSnapshot")) {
                            object.fullSnapshot = $root.com.triforge.protocol.proto.FullSnapshot.toObject(message.fullSnapshot, options, q + 1);
                            if (options.oneofs)
                                object.content = "fullSnapshot";
                        }
                        if (message.deltaSnapshot != null && Object.hasOwnProperty.call(message, "deltaSnapshot")) {
                            object.deltaSnapshot = $root.com.triforge.protocol.proto.DeltaSnapshot.toObject(message.deltaSnapshot, options, q + 1);
                            if (options.oneofs)
                                object.content = "deltaSnapshot";
                        }
                        if (message.inputCommand != null && Object.hasOwnProperty.call(message, "inputCommand")) {
                            object.inputCommand = $root.com.triforge.protocol.proto.InputCommand.toObject(message.inputCommand, options, q + 1);
                            if (options.oneofs)
                                object.content = "inputCommand";
                        }
                        if (message.gameEvent != null && Object.hasOwnProperty.call(message, "gameEvent")) {
                            object.gameEvent = $root.com.triforge.protocol.proto.GameEvent.toObject(message.gameEvent, options, q + 1);
                            if (options.oneofs)
                                object.content = "gameEvent";
                        }
                        if (message.lobbyCommand != null && Object.hasOwnProperty.call(message, "lobbyCommand")) {
                            object.lobbyCommand = $root.com.triforge.protocol.proto.LobbyCommand.toObject(message.lobbyCommand, options, q + 1);
                            if (options.oneofs)
                                object.content = "lobbyCommand";
                        }
                        if (message.roomLobbySnapshot != null && Object.hasOwnProperty.call(message, "roomLobbySnapshot")) {
                            object.roomLobbySnapshot = $root.com.triforge.protocol.proto.RoomLobbySnapshot.toObject(message.roomLobbySnapshot, options, q + 1);
                            if (options.oneofs)
                                object.content = "roomLobbySnapshot";
                        }
                        if (message.matchPhaseUpdate != null && Object.hasOwnProperty.call(message, "matchPhaseUpdate")) {
                            object.matchPhaseUpdate = $root.com.triforge.protocol.proto.MatchPhaseUpdate.toObject(message.matchPhaseUpdate, options, q + 1);
                            if (options.oneofs)
                                object.content = "matchPhaseUpdate";
                        }
                        if (message.matchResult != null && Object.hasOwnProperty.call(message, "matchResult")) {
                            object.matchResult = $root.com.triforge.protocol.proto.MatchResult.toObject(message.matchResult, options, q + 1);
                            if (options.oneofs)
                                object.content = "matchResult";
                        }
                        if (message.mapSnapshot != null && Object.hasOwnProperty.call(message, "mapSnapshot")) {
                            object.mapSnapshot = $root.com.triforge.protocol.proto.MapSnapshot.toObject(message.mapSnapshot, options, q + 1);
                            if (options.oneofs)
                                object.content = "mapSnapshot";
                        }
                        return object;
                    };

                    /**
                     * Converts this GameMessage to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    GameMessage.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for GameMessage
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.GameMessage
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    GameMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.GameMessage";
                    };

                    return GameMessage;
                })();

                proto.JoinRequest = (function() {

                    /**
                     * Properties of a JoinRequest.
                     * @memberof com.triforge.protocol.proto
                     * @interface IJoinRequest
                     * @property {string|null} [playerName] JoinRequest playerName
                     */

                    /**
                     * Constructs a new JoinRequest.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a JoinRequest.
                     * @implements IJoinRequest
                     * @constructor
                     * @param {com.triforge.protocol.proto.IJoinRequest=} [properties] Properties to set
                     */
                    function JoinRequest(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * JoinRequest playerName.
                     * @member {string} playerName
                     * @memberof com.triforge.protocol.proto.JoinRequest
                     * @instance
                     */
                    JoinRequest.prototype.playerName = "";

                    /**
                     * Creates a new JoinRequest instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.JoinRequest
                     * @static
                     * @param {com.triforge.protocol.proto.IJoinRequest=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.JoinRequest} JoinRequest instance
                     */
                    JoinRequest.create = function create(properties) {
                        return new JoinRequest(properties);
                    };

                    /**
                     * Encodes the specified JoinRequest message. Does not implicitly {@link com.triforge.protocol.proto.JoinRequest.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.JoinRequest
                     * @static
                     * @param {com.triforge.protocol.proto.IJoinRequest} message JoinRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    JoinRequest.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.playerName != null && Object.hasOwnProperty.call(message, "playerName"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.playerName);
                        return writer;
                    };

                    /**
                     * Encodes the specified JoinRequest message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.JoinRequest.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.JoinRequest
                     * @static
                     * @param {com.triforge.protocol.proto.IJoinRequest} message JoinRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    JoinRequest.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a JoinRequest message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.JoinRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.JoinRequest} JoinRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    JoinRequest.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.JoinRequest();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.playerName = reader.string();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a JoinRequest message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.JoinRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.JoinRequest} JoinRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    JoinRequest.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a JoinRequest message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.JoinRequest
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    JoinRequest.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.playerName != null && Object.hasOwnProperty.call(message, "playerName"))
                            if (!$util.isString(message.playerName))
                                return "playerName: string expected";
                        return null;
                    };

                    /**
                     * Creates a JoinRequest message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.JoinRequest
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.JoinRequest} JoinRequest
                     */
                    JoinRequest.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.JoinRequest)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.JoinRequest: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.JoinRequest();
                        if (object.playerName != null)
                            message.playerName = String(object.playerName);
                        return message;
                    };

                    /**
                     * Creates a plain object from a JoinRequest message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.JoinRequest
                     * @static
                     * @param {com.triforge.protocol.proto.JoinRequest} message JoinRequest
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    JoinRequest.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults)
                            object.playerName = "";
                        if (message.playerName != null && Object.hasOwnProperty.call(message, "playerName"))
                            object.playerName = message.playerName;
                        return object;
                    };

                    /**
                     * Converts this JoinRequest to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.JoinRequest
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    JoinRequest.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for JoinRequest
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.JoinRequest
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    JoinRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.JoinRequest";
                    };

                    return JoinRequest;
                })();

                proto.JoinResponse = (function() {

                    /**
                     * Properties of a JoinResponse.
                     * @memberof com.triforge.protocol.proto
                     * @interface IJoinResponse
                     * @property {number|Long|null} [playerId] JoinResponse playerId
                     * @property {number|Long|null} [entityId] JoinResponse entityId
                     * @property {com.triforge.protocol.proto.IFullSnapshot|null} [initialSnapshot] JoinResponse initialSnapshot
                     * @property {com.triforge.protocol.proto.IMapSnapshot|null} [map] JoinResponse map
                     * @property {com.triforge.protocol.proto.IRoomLobbySnapshot|null} [lobby] JoinResponse lobby
                     */

                    /**
                     * Constructs a new JoinResponse.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a JoinResponse.
                     * @implements IJoinResponse
                     * @constructor
                     * @param {com.triforge.protocol.proto.IJoinResponse=} [properties] Properties to set
                     */
                    function JoinResponse(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * JoinResponse playerId.
                     * @member {number|Long} playerId
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @instance
                     */
                    JoinResponse.prototype.playerId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * JoinResponse entityId.
                     * @member {number|Long} entityId
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @instance
                     */
                    JoinResponse.prototype.entityId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * JoinResponse initialSnapshot.
                     * @member {com.triforge.protocol.proto.IFullSnapshot|null|undefined} initialSnapshot
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @instance
                     */
                    JoinResponse.prototype.initialSnapshot = null;

                    /**
                     * JoinResponse map.
                     * @member {com.triforge.protocol.proto.IMapSnapshot|null|undefined} map
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @instance
                     */
                    JoinResponse.prototype.map = null;

                    /**
                     * JoinResponse lobby.
                     * @member {com.triforge.protocol.proto.IRoomLobbySnapshot|null|undefined} lobby
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @instance
                     */
                    JoinResponse.prototype.lobby = null;

                    /**
                     * Creates a new JoinResponse instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @static
                     * @param {com.triforge.protocol.proto.IJoinResponse=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.JoinResponse} JoinResponse instance
                     */
                    JoinResponse.create = function create(properties) {
                        return new JoinResponse(properties);
                    };

                    /**
                     * Encodes the specified JoinResponse message. Does not implicitly {@link com.triforge.protocol.proto.JoinResponse.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @static
                     * @param {com.triforge.protocol.proto.IJoinResponse} message JoinResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    JoinResponse.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.playerId);
                        if (message.entityId != null && Object.hasOwnProperty.call(message, "entityId"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.entityId);
                        if (message.initialSnapshot != null && Object.hasOwnProperty.call(message, "initialSnapshot"))
                            $root.com.triforge.protocol.proto.FullSnapshot.encode(message.initialSnapshot, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
                        if (message.map != null && Object.hasOwnProperty.call(message, "map"))
                            $root.com.triforge.protocol.proto.MapSnapshot.encode(message.map, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
                        if (message.lobby != null && Object.hasOwnProperty.call(message, "lobby"))
                            $root.com.triforge.protocol.proto.RoomLobbySnapshot.encode(message.lobby, writer.uint32(/* id 5, wireType 2 =*/42).fork(), q + 1).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified JoinResponse message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.JoinResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @static
                     * @param {com.triforge.protocol.proto.IJoinResponse} message JoinResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    JoinResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a JoinResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.JoinResponse} JoinResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    JoinResponse.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.JoinResponse();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.playerId = reader.uint64();
                                    break;
                                }
                            case 2: {
                                    message.entityId = reader.uint64();
                                    break;
                                }
                            case 3: {
                                    message.initialSnapshot = $root.com.triforge.protocol.proto.FullSnapshot.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 4: {
                                    message.map = $root.com.triforge.protocol.proto.MapSnapshot.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 5: {
                                    message.lobby = $root.com.triforge.protocol.proto.RoomLobbySnapshot.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a JoinResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.JoinResponse} JoinResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    JoinResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a JoinResponse message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    JoinResponse.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            if (!$util.isInteger(message.playerId) && !(message.playerId && $util.isInteger(message.playerId.low) && $util.isInteger(message.playerId.high)))
                                return "playerId: integer|Long expected";
                        if (message.entityId != null && Object.hasOwnProperty.call(message, "entityId"))
                            if (!$util.isInteger(message.entityId) && !(message.entityId && $util.isInteger(message.entityId.low) && $util.isInteger(message.entityId.high)))
                                return "entityId: integer|Long expected";
                        if (message.initialSnapshot != null && Object.hasOwnProperty.call(message, "initialSnapshot")) {
                            let error = $root.com.triforge.protocol.proto.FullSnapshot.verify(message.initialSnapshot, long + 1);
                            if (error)
                                return "initialSnapshot." + error;
                        }
                        if (message.map != null && Object.hasOwnProperty.call(message, "map")) {
                            let error = $root.com.triforge.protocol.proto.MapSnapshot.verify(message.map, long + 1);
                            if (error)
                                return "map." + error;
                        }
                        if (message.lobby != null && Object.hasOwnProperty.call(message, "lobby")) {
                            let error = $root.com.triforge.protocol.proto.RoomLobbySnapshot.verify(message.lobby, long + 1);
                            if (error)
                                return "lobby." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a JoinResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.JoinResponse} JoinResponse
                     */
                    JoinResponse.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.JoinResponse)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.JoinResponse: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.JoinResponse();
                        if (object.playerId != null)
                            if ($util.Long)
                                message.playerId = $util.Long.fromValue(object.playerId, true);
                            else if (typeof object.playerId === "string")
                                message.playerId = parseInt(object.playerId, 10);
                            else if (typeof object.playerId === "number")
                                message.playerId = object.playerId;
                            else if (typeof object.playerId === "object")
                                message.playerId = new $util.LongBits(object.playerId.low >>> 0, object.playerId.high >>> 0).toNumber(true);
                        if (object.entityId != null)
                            if ($util.Long)
                                message.entityId = $util.Long.fromValue(object.entityId, true);
                            else if (typeof object.entityId === "string")
                                message.entityId = parseInt(object.entityId, 10);
                            else if (typeof object.entityId === "number")
                                message.entityId = object.entityId;
                            else if (typeof object.entityId === "object")
                                message.entityId = new $util.LongBits(object.entityId.low >>> 0, object.entityId.high >>> 0).toNumber(true);
                        if (object.initialSnapshot != null) {
                            if (!$util.isObject(object.initialSnapshot))
                                throw TypeError(".com.triforge.protocol.proto.JoinResponse.initialSnapshot: object expected");
                            message.initialSnapshot = $root.com.triforge.protocol.proto.FullSnapshot.fromObject(object.initialSnapshot, long + 1);
                        }
                        if (object.map != null) {
                            if (!$util.isObject(object.map))
                                throw TypeError(".com.triforge.protocol.proto.JoinResponse.map: object expected");
                            message.map = $root.com.triforge.protocol.proto.MapSnapshot.fromObject(object.map, long + 1);
                        }
                        if (object.lobby != null) {
                            if (!$util.isObject(object.lobby))
                                throw TypeError(".com.triforge.protocol.proto.JoinResponse.lobby: object expected");
                            message.lobby = $root.com.triforge.protocol.proto.RoomLobbySnapshot.fromObject(object.lobby, long + 1);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a JoinResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @static
                     * @param {com.triforge.protocol.proto.JoinResponse} message JoinResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    JoinResponse.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.playerId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.playerId = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.entityId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.entityId = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            object.initialSnapshot = null;
                            object.map = null;
                            object.lobby = null;
                        }
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.playerId = typeof message.playerId === "number" ? BigInt(message.playerId) : $util.Long.fromBits(message.playerId.low >>> 0, message.playerId.high >>> 0, true).toBigInt();
                            else if (typeof message.playerId === "number")
                                object.playerId = options.longs === String ? String(message.playerId) : message.playerId;
                            else
                                object.playerId = options.longs === String ? $util.Long.prototype.toString.call(message.playerId) : options.longs === Number ? new $util.LongBits(message.playerId.low >>> 0, message.playerId.high >>> 0).toNumber(true) : message.playerId;
                        if (message.entityId != null && Object.hasOwnProperty.call(message, "entityId"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.entityId = typeof message.entityId === "number" ? BigInt(message.entityId) : $util.Long.fromBits(message.entityId.low >>> 0, message.entityId.high >>> 0, true).toBigInt();
                            else if (typeof message.entityId === "number")
                                object.entityId = options.longs === String ? String(message.entityId) : message.entityId;
                            else
                                object.entityId = options.longs === String ? $util.Long.prototype.toString.call(message.entityId) : options.longs === Number ? new $util.LongBits(message.entityId.low >>> 0, message.entityId.high >>> 0).toNumber(true) : message.entityId;
                        if (message.initialSnapshot != null && Object.hasOwnProperty.call(message, "initialSnapshot"))
                            object.initialSnapshot = $root.com.triforge.protocol.proto.FullSnapshot.toObject(message.initialSnapshot, options, q + 1);
                        if (message.map != null && Object.hasOwnProperty.call(message, "map"))
                            object.map = $root.com.triforge.protocol.proto.MapSnapshot.toObject(message.map, options, q + 1);
                        if (message.lobby != null && Object.hasOwnProperty.call(message, "lobby"))
                            object.lobby = $root.com.triforge.protocol.proto.RoomLobbySnapshot.toObject(message.lobby, options, q + 1);
                        return object;
                    };

                    /**
                     * Converts this JoinResponse to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    JoinResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for JoinResponse
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.JoinResponse
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    JoinResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.JoinResponse";
                    };

                    return JoinResponse;
                })();

                /**
                 * Direction enum.
                 * @name com.triforge.protocol.proto.Direction
                 * @enum {number}
                 * @property {number} UP=0 UP value
                 * @property {number} DOWN=1 DOWN value
                 * @property {number} LEFT=2 LEFT value
                 * @property {number} RIGHT=3 RIGHT value
                 */
                proto.Direction = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "UP"] = 0;
                    values[valuesById[1] = "DOWN"] = 1;
                    values[valuesById[2] = "LEFT"] = 2;
                    values[valuesById[3] = "RIGHT"] = 3;
                    return values;
                })();

                /**
                 * TileType enum.
                 * @name com.triforge.protocol.proto.TileType
                 * @enum {number}
                 * @property {number} EMPTY=0 EMPTY value
                 * @property {number} BRICK=1 BRICK value
                 * @property {number} STEEL=2 STEEL value
                 * @property {number} WATER=3 WATER value
                 * @property {number} TREE=4 TREE value
                 * @property {number} WALL=5 WALL value
                 * @property {number} COVER=6 COVER value
                 * @property {number} HQ=7 HQ value
                 */
                proto.TileType = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "EMPTY"] = 0;
                    values[valuesById[1] = "BRICK"] = 1;
                    values[valuesById[2] = "STEEL"] = 2;
                    values[valuesById[3] = "WATER"] = 3;
                    values[valuesById[4] = "TREE"] = 4;
                    values[valuesById[5] = "WALL"] = 5;
                    values[valuesById[6] = "COVER"] = 6;
                    values[valuesById[7] = "HQ"] = 7;
                    return values;
                })();

                /**
                 * FogCellState enum.
                 * @name com.triforge.protocol.proto.FogCellState
                 * @enum {number}
                 * @property {number} UNKNOWN=0 UNKNOWN value
                 * @property {number} SEEN=1 SEEN value
                 * @property {number} VISIBLE=2 VISIBLE value
                 */
                proto.FogCellState = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "UNKNOWN"] = 0;
                    values[valuesById[1] = "SEEN"] = 1;
                    values[valuesById[2] = "VISIBLE"] = 2;
                    return values;
                })();

                proto.FogSnapshot = (function() {

                    /**
                     * Properties of a FogSnapshot.
                     * @memberof com.triforge.protocol.proto
                     * @interface IFogSnapshot
                     * @property {number|null} [width] FogSnapshot width
                     * @property {number|null} [height] FogSnapshot height
                     * @property {Uint8Array|null} [cells] FogSnapshot cells
                     */

                    /**
                     * Constructs a new FogSnapshot.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a FogSnapshot.
                     * @implements IFogSnapshot
                     * @constructor
                     * @param {com.triforge.protocol.proto.IFogSnapshot=} [properties] Properties to set
                     */
                    function FogSnapshot(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * FogSnapshot width.
                     * @member {number} width
                     * @memberof com.triforge.protocol.proto.FogSnapshot
                     * @instance
                     */
                    FogSnapshot.prototype.width = 0;

                    /**
                     * FogSnapshot height.
                     * @member {number} height
                     * @memberof com.triforge.protocol.proto.FogSnapshot
                     * @instance
                     */
                    FogSnapshot.prototype.height = 0;

                    /**
                     * FogSnapshot cells.
                     * @member {Uint8Array} cells
                     * @memberof com.triforge.protocol.proto.FogSnapshot
                     * @instance
                     */
                    FogSnapshot.prototype.cells = $util.newBuffer([]);

                    /**
                     * Creates a new FogSnapshot instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.FogSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IFogSnapshot=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.FogSnapshot} FogSnapshot instance
                     */
                    FogSnapshot.create = function create(properties) {
                        return new FogSnapshot(properties);
                    };

                    /**
                     * Encodes the specified FogSnapshot message. Does not implicitly {@link com.triforge.protocol.proto.FogSnapshot.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.FogSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IFogSnapshot} message FogSnapshot message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    FogSnapshot.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.width);
                        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.height);
                        if (message.cells != null && Object.hasOwnProperty.call(message, "cells"))
                            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.cells);
                        return writer;
                    };

                    /**
                     * Encodes the specified FogSnapshot message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.FogSnapshot.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.FogSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IFogSnapshot} message FogSnapshot message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    FogSnapshot.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a FogSnapshot message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.FogSnapshot
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.FogSnapshot} FogSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    FogSnapshot.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.FogSnapshot();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.width = reader.uint32();
                                    break;
                                }
                            case 2: {
                                    message.height = reader.uint32();
                                    break;
                                }
                            case 3: {
                                    message.cells = reader.bytes();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a FogSnapshot message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.FogSnapshot
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.FogSnapshot} FogSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    FogSnapshot.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a FogSnapshot message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.FogSnapshot
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    FogSnapshot.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                            if (!$util.isInteger(message.width))
                                return "width: integer expected";
                        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                            if (!$util.isInteger(message.height))
                                return "height: integer expected";
                        if (message.cells != null && Object.hasOwnProperty.call(message, "cells"))
                            if (!(message.cells && typeof message.cells.length === "number" || $util.isString(message.cells)))
                                return "cells: buffer expected";
                        return null;
                    };

                    /**
                     * Creates a FogSnapshot message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.FogSnapshot
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.FogSnapshot} FogSnapshot
                     */
                    FogSnapshot.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.FogSnapshot)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.FogSnapshot: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.FogSnapshot();
                        if (object.width != null)
                            message.width = object.width >>> 0;
                        if (object.height != null)
                            message.height = object.height >>> 0;
                        if (object.cells != null)
                            if (typeof object.cells === "string")
                                $util.base64.decode(object.cells, message.cells = $util.newBuffer($util.base64.length(object.cells)), 0);
                            else if (object.cells.length >= 0)
                                message.cells = object.cells;
                        return message;
                    };

                    /**
                     * Creates a plain object from a FogSnapshot message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.FogSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.FogSnapshot} message FogSnapshot
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    FogSnapshot.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            object.width = 0;
                            object.height = 0;
                            if (options.bytes === String)
                                object.cells = "";
                            else {
                                object.cells = [];
                                if (options.bytes !== Array)
                                    object.cells = $util.newBuffer(object.cells);
                            }
                        }
                        if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                            object.width = message.width;
                        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                            object.height = message.height;
                        if (message.cells != null && Object.hasOwnProperty.call(message, "cells"))
                            object.cells = options.bytes === String ? $util.base64.encode(message.cells, 0, message.cells.length) : options.bytes === Array ? Array.prototype.slice.call(message.cells) : message.cells;
                        return object;
                    };

                    /**
                     * Converts this FogSnapshot to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.FogSnapshot
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    FogSnapshot.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for FogSnapshot
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.FogSnapshot
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    FogSnapshot.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.FogSnapshot";
                    };

                    return FogSnapshot;
                })();

                /**
                 * GameEventType enum.
                 * @name com.triforge.protocol.proto.GameEventType
                 * @enum {number}
                 * @property {number} PLAYER_HIT=0 PLAYER_HIT value
                 * @property {number} PLAYER_DEATH=1 PLAYER_DEATH value
                 * @property {number} PLAYER_RESPAWN=2 PLAYER_RESPAWN value
                 * @property {number} MATCH_COUNTDOWN=3 MATCH_COUNTDOWN value
                 * @property {number} MATCH_STARTED=4 MATCH_STARTED value
                 * @property {number} MATCH_ENDED=5 MATCH_ENDED value
                 * @property {number} LOBBY_UPDATED=6 LOBBY_UPDATED value
                 * @property {number} HQ_DAMAGED=7 HQ_DAMAGED value
                 * @property {number} HQ_DESTROYED=8 HQ_DESTROYED value
                 */
                proto.GameEventType = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "PLAYER_HIT"] = 0;
                    values[valuesById[1] = "PLAYER_DEATH"] = 1;
                    values[valuesById[2] = "PLAYER_RESPAWN"] = 2;
                    values[valuesById[3] = "MATCH_COUNTDOWN"] = 3;
                    values[valuesById[4] = "MATCH_STARTED"] = 4;
                    values[valuesById[5] = "MATCH_ENDED"] = 5;
                    values[valuesById[6] = "LOBBY_UPDATED"] = 6;
                    values[valuesById[7] = "HQ_DAMAGED"] = 7;
                    values[valuesById[8] = "HQ_DESTROYED"] = 8;
                    return values;
                })();

                /**
                 * MatchPhase enum.
                 * @name com.triforge.protocol.proto.MatchPhase
                 * @enum {number}
                 * @property {number} LOBBY=0 LOBBY value
                 * @property {number} COUNTDOWN=1 COUNTDOWN value
                 * @property {number} PLAYING=2 PLAYING value
                 * @property {number} ENDED=3 ENDED value
                 */
                proto.MatchPhase = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "LOBBY"] = 0;
                    values[valuesById[1] = "COUNTDOWN"] = 1;
                    values[valuesById[2] = "PLAYING"] = 2;
                    values[valuesById[3] = "ENDED"] = 3;
                    return values;
                })();

                /**
                 * Team enum.
                 * @name com.triforge.protocol.proto.Team
                 * @enum {number}
                 * @property {number} TEAM_NONE=0 TEAM_NONE value
                 * @property {number} TEAM_RED=1 TEAM_RED value
                 * @property {number} TEAM_BLUE=2 TEAM_BLUE value
                 */
                proto.Team = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "TEAM_NONE"] = 0;
                    values[valuesById[1] = "TEAM_RED"] = 1;
                    values[valuesById[2] = "TEAM_BLUE"] = 2;
                    return values;
                })();

                /**
                 * SpawnRegion enum.
                 * @name com.triforge.protocol.proto.SpawnRegion
                 * @enum {number}
                 * @property {number} REGION_UNSPECIFIED=0 REGION_UNSPECIFIED value
                 * @property {number} TOP_LEFT=1 TOP_LEFT value
                 * @property {number} TOP_RIGHT=2 TOP_RIGHT value
                 * @property {number} BOTTOM_LEFT=3 BOTTOM_LEFT value
                 * @property {number} BOTTOM_RIGHT=4 BOTTOM_RIGHT value
                 */
                proto.SpawnRegion = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "REGION_UNSPECIFIED"] = 0;
                    values[valuesById[1] = "TOP_LEFT"] = 1;
                    values[valuesById[2] = "TOP_RIGHT"] = 2;
                    values[valuesById[3] = "BOTTOM_LEFT"] = 3;
                    values[valuesById[4] = "BOTTOM_RIGHT"] = 4;
                    return values;
                })();

                proto.MapSnapshot = (function() {

                    /**
                     * Properties of a MapSnapshot.
                     * @memberof com.triforge.protocol.proto
                     * @interface IMapSnapshot
                     * @property {number|null} [width] MapSnapshot width
                     * @property {number|null} [height] MapSnapshot height
                     * @property {number|null} [tileSize] MapSnapshot tileSize
                     * @property {Array.<com.triforge.protocol.proto.TileType>|null} [tiles] MapSnapshot tiles
                     * @property {Array.<com.triforge.protocol.proto.IHeadquartersProto>|null} [headquarters] MapSnapshot headquarters
                     */

                    /**
                     * Constructs a new MapSnapshot.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a MapSnapshot.
                     * @implements IMapSnapshot
                     * @constructor
                     * @param {com.triforge.protocol.proto.IMapSnapshot=} [properties] Properties to set
                     */
                    function MapSnapshot(properties) {
                        this.tiles = [];
                        this.headquarters = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * MapSnapshot width.
                     * @member {number} width
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @instance
                     */
                    MapSnapshot.prototype.width = 0;

                    /**
                     * MapSnapshot height.
                     * @member {number} height
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @instance
                     */
                    MapSnapshot.prototype.height = 0;

                    /**
                     * MapSnapshot tileSize.
                     * @member {number} tileSize
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @instance
                     */
                    MapSnapshot.prototype.tileSize = 0;

                    /**
                     * MapSnapshot tiles.
                     * @member {Array.<com.triforge.protocol.proto.TileType>} tiles
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @instance
                     */
                    MapSnapshot.prototype.tiles = $util.emptyArray;

                    /**
                     * MapSnapshot headquarters.
                     * @member {Array.<com.triforge.protocol.proto.IHeadquartersProto>} headquarters
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @instance
                     */
                    MapSnapshot.prototype.headquarters = $util.emptyArray;

                    /**
                     * Creates a new MapSnapshot instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IMapSnapshot=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.MapSnapshot} MapSnapshot instance
                     */
                    MapSnapshot.create = function create(properties) {
                        return new MapSnapshot(properties);
                    };

                    /**
                     * Encodes the specified MapSnapshot message. Does not implicitly {@link com.triforge.protocol.proto.MapSnapshot.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IMapSnapshot} message MapSnapshot message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MapSnapshot.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.width);
                        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.height);
                        if (message.tileSize != null && Object.hasOwnProperty.call(message, "tileSize"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.tileSize);
                        if (message.tiles != null && message.tiles.length) {
                            writer.uint32(/* id 4, wireType 2 =*/34).fork();
                            for (let i = 0; i < message.tiles.length; ++i)
                                writer.int32(message.tiles[i]);
                            writer.ldelim();
                        }
                        if (message.headquarters != null && message.headquarters.length)
                            for (let i = 0; i < message.headquarters.length; ++i)
                                $root.com.triforge.protocol.proto.HeadquartersProto.encode(message.headquarters[i], writer.uint32(/* id 5, wireType 2 =*/42).fork(), q + 1).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified MapSnapshot message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.MapSnapshot.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IMapSnapshot} message MapSnapshot message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MapSnapshot.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a MapSnapshot message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.MapSnapshot} MapSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MapSnapshot.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.MapSnapshot();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.width = reader.uint32();
                                    break;
                                }
                            case 2: {
                                    message.height = reader.uint32();
                                    break;
                                }
                            case 3: {
                                    message.tileSize = reader.uint32();
                                    break;
                                }
                            case 4: {
                                    if (!(message.tiles && message.tiles.length))
                                        message.tiles = [];
                                    if ((tag & 7) === 2) {
                                        let end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.tiles.push(reader.int32());
                                    } else
                                        message.tiles.push(reader.int32());
                                    break;
                                }
                            case 5: {
                                    if (!(message.headquarters && message.headquarters.length))
                                        message.headquarters = [];
                                    message.headquarters.push($root.com.triforge.protocol.proto.HeadquartersProto.decode(reader, reader.uint32(), undefined, long + 1));
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MapSnapshot message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.MapSnapshot} MapSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MapSnapshot.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MapSnapshot message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MapSnapshot.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                            if (!$util.isInteger(message.width))
                                return "width: integer expected";
                        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                            if (!$util.isInteger(message.height))
                                return "height: integer expected";
                        if (message.tileSize != null && Object.hasOwnProperty.call(message, "tileSize"))
                            if (!$util.isInteger(message.tileSize))
                                return "tileSize: integer expected";
                        if (message.tiles != null && Object.hasOwnProperty.call(message, "tiles")) {
                            if (!Array.isArray(message.tiles))
                                return "tiles: array expected";
                            for (let i = 0; i < message.tiles.length; ++i)
                                switch (message.tiles[i]) {
                                default:
                                    return "tiles: enum value[] expected";
                                case 0:
                                case 1:
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                case 6:
                                case 7:
                                    break;
                                }
                        }
                        if (message.headquarters != null && Object.hasOwnProperty.call(message, "headquarters")) {
                            if (!Array.isArray(message.headquarters))
                                return "headquarters: array expected";
                            for (let i = 0; i < message.headquarters.length; ++i) {
                                let error = $root.com.triforge.protocol.proto.HeadquartersProto.verify(message.headquarters[i], long + 1);
                                if (error)
                                    return "headquarters." + error;
                            }
                        }
                        return null;
                    };

                    /**
                     * Creates a MapSnapshot message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.MapSnapshot} MapSnapshot
                     */
                    MapSnapshot.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.MapSnapshot)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.MapSnapshot: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.MapSnapshot();
                        if (object.width != null)
                            message.width = object.width >>> 0;
                        if (object.height != null)
                            message.height = object.height >>> 0;
                        if (object.tileSize != null)
                            message.tileSize = object.tileSize >>> 0;
                        if (object.tiles) {
                            if (!Array.isArray(object.tiles))
                                throw TypeError(".com.triforge.protocol.proto.MapSnapshot.tiles: array expected");
                            message.tiles = [];
                            for (let i = 0; i < object.tiles.length; ++i)
                                switch (object.tiles[i]) {
                                default:
                                    if (typeof object.tiles[i] === "number") {
                                        message.tiles[i] = object.tiles[i];
                                        break;
                                    }
                                case "EMPTY":
                                case 0:
                                    message.tiles[i] = 0;
                                    break;
                                case "BRICK":
                                case 1:
                                    message.tiles[i] = 1;
                                    break;
                                case "STEEL":
                                case 2:
                                    message.tiles[i] = 2;
                                    break;
                                case "WATER":
                                case 3:
                                    message.tiles[i] = 3;
                                    break;
                                case "TREE":
                                case 4:
                                    message.tiles[i] = 4;
                                    break;
                                case "WALL":
                                case 5:
                                    message.tiles[i] = 5;
                                    break;
                                case "COVER":
                                case 6:
                                    message.tiles[i] = 6;
                                    break;
                                case "HQ":
                                case 7:
                                    message.tiles[i] = 7;
                                    break;
                                }
                        }
                        if (object.headquarters) {
                            if (!Array.isArray(object.headquarters))
                                throw TypeError(".com.triforge.protocol.proto.MapSnapshot.headquarters: array expected");
                            message.headquarters = [];
                            for (let i = 0; i < object.headquarters.length; ++i) {
                                if (!$util.isObject(object.headquarters[i]))
                                    throw TypeError(".com.triforge.protocol.proto.MapSnapshot.headquarters: object expected");
                                message.headquarters[i] = $root.com.triforge.protocol.proto.HeadquartersProto.fromObject(object.headquarters[i], long + 1);
                            }
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a MapSnapshot message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.MapSnapshot} message MapSnapshot
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MapSnapshot.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.arrays || options.defaults) {
                            object.tiles = [];
                            object.headquarters = [];
                        }
                        if (options.defaults) {
                            object.width = 0;
                            object.height = 0;
                            object.tileSize = 0;
                        }
                        if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                            object.width = message.width;
                        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                            object.height = message.height;
                        if (message.tileSize != null && Object.hasOwnProperty.call(message, "tileSize"))
                            object.tileSize = message.tileSize;
                        if (message.tiles && message.tiles.length) {
                            object.tiles = [];
                            for (let j = 0; j < message.tiles.length; ++j)
                                object.tiles[j] = options.enums === String ? $root.com.triforge.protocol.proto.TileType[message.tiles[j]] === undefined ? message.tiles[j] : $root.com.triforge.protocol.proto.TileType[message.tiles[j]] : message.tiles[j];
                        }
                        if (message.headquarters && message.headquarters.length) {
                            object.headquarters = [];
                            for (let j = 0; j < message.headquarters.length; ++j)
                                object.headquarters[j] = $root.com.triforge.protocol.proto.HeadquartersProto.toObject(message.headquarters[j], options, q + 1);
                        }
                        return object;
                    };

                    /**
                     * Converts this MapSnapshot to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MapSnapshot.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for MapSnapshot
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.MapSnapshot
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    MapSnapshot.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.MapSnapshot";
                    };

                    return MapSnapshot;
                })();

                proto.HeadquartersProto = (function() {

                    /**
                     * Properties of a HeadquartersProto.
                     * @memberof com.triforge.protocol.proto
                     * @interface IHeadquartersProto
                     * @property {com.triforge.protocol.proto.Team|null} [team] HeadquartersProto team
                     * @property {number|null} [x] HeadquartersProto x
                     * @property {number|null} [y] HeadquartersProto y
                     * @property {number|null} [width] HeadquartersProto width
                     * @property {number|null} [height] HeadquartersProto height
                     * @property {number|null} [maxHp] HeadquartersProto maxHp
                     */

                    /**
                     * Constructs a new HeadquartersProto.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a HeadquartersProto.
                     * @implements IHeadquartersProto
                     * @constructor
                     * @param {com.triforge.protocol.proto.IHeadquartersProto=} [properties] Properties to set
                     */
                    function HeadquartersProto(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * HeadquartersProto team.
                     * @member {com.triforge.protocol.proto.Team} team
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @instance
                     */
                    HeadquartersProto.prototype.team = 0;

                    /**
                     * HeadquartersProto x.
                     * @member {number} x
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @instance
                     */
                    HeadquartersProto.prototype.x = 0;

                    /**
                     * HeadquartersProto y.
                     * @member {number} y
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @instance
                     */
                    HeadquartersProto.prototype.y = 0;

                    /**
                     * HeadquartersProto width.
                     * @member {number} width
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @instance
                     */
                    HeadquartersProto.prototype.width = 0;

                    /**
                     * HeadquartersProto height.
                     * @member {number} height
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @instance
                     */
                    HeadquartersProto.prototype.height = 0;

                    /**
                     * HeadquartersProto maxHp.
                     * @member {number} maxHp
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @instance
                     */
                    HeadquartersProto.prototype.maxHp = 0;

                    /**
                     * Creates a new HeadquartersProto instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @static
                     * @param {com.triforge.protocol.proto.IHeadquartersProto=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.HeadquartersProto} HeadquartersProto instance
                     */
                    HeadquartersProto.create = function create(properties) {
                        return new HeadquartersProto(properties);
                    };

                    /**
                     * Encodes the specified HeadquartersProto message. Does not implicitly {@link com.triforge.protocol.proto.HeadquartersProto.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @static
                     * @param {com.triforge.protocol.proto.IHeadquartersProto} message HeadquartersProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    HeadquartersProto.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.team);
                        if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.x);
                        if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.y);
                        if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.width);
                        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.height);
                        if (message.maxHp != null && Object.hasOwnProperty.call(message, "maxHp"))
                            writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.maxHp);
                        return writer;
                    };

                    /**
                     * Encodes the specified HeadquartersProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.HeadquartersProto.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @static
                     * @param {com.triforge.protocol.proto.IHeadquartersProto} message HeadquartersProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    HeadquartersProto.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a HeadquartersProto message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.HeadquartersProto} HeadquartersProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    HeadquartersProto.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.HeadquartersProto();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.team = reader.int32();
                                    break;
                                }
                            case 2: {
                                    message.x = reader.uint32();
                                    break;
                                }
                            case 3: {
                                    message.y = reader.uint32();
                                    break;
                                }
                            case 4: {
                                    message.width = reader.uint32();
                                    break;
                                }
                            case 5: {
                                    message.height = reader.uint32();
                                    break;
                                }
                            case 6: {
                                    message.maxHp = reader.uint32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a HeadquartersProto message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.HeadquartersProto} HeadquartersProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    HeadquartersProto.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a HeadquartersProto message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    HeadquartersProto.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            switch (message.team) {
                            default:
                                return "team: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                                break;
                            }
                        if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                            if (!$util.isInteger(message.x))
                                return "x: integer expected";
                        if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                            if (!$util.isInteger(message.y))
                                return "y: integer expected";
                        if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                            if (!$util.isInteger(message.width))
                                return "width: integer expected";
                        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                            if (!$util.isInteger(message.height))
                                return "height: integer expected";
                        if (message.maxHp != null && Object.hasOwnProperty.call(message, "maxHp"))
                            if (!$util.isInteger(message.maxHp))
                                return "maxHp: integer expected";
                        return null;
                    };

                    /**
                     * Creates a HeadquartersProto message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.HeadquartersProto} HeadquartersProto
                     */
                    HeadquartersProto.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.HeadquartersProto)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.HeadquartersProto: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.HeadquartersProto();
                        switch (object.team) {
                        default:
                            if (typeof object.team === "number") {
                                message.team = object.team;
                                break;
                            }
                            break;
                        case "TEAM_NONE":
                        case 0:
                            message.team = 0;
                            break;
                        case "TEAM_RED":
                        case 1:
                            message.team = 1;
                            break;
                        case "TEAM_BLUE":
                        case 2:
                            message.team = 2;
                            break;
                        }
                        if (object.x != null)
                            message.x = object.x >>> 0;
                        if (object.y != null)
                            message.y = object.y >>> 0;
                        if (object.width != null)
                            message.width = object.width >>> 0;
                        if (object.height != null)
                            message.height = object.height >>> 0;
                        if (object.maxHp != null)
                            message.maxHp = object.maxHp >>> 0;
                        return message;
                    };

                    /**
                     * Creates a plain object from a HeadquartersProto message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @static
                     * @param {com.triforge.protocol.proto.HeadquartersProto} message HeadquartersProto
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    HeadquartersProto.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            object.team = options.enums === String ? "TEAM_NONE" : 0;
                            object.x = 0;
                            object.y = 0;
                            object.width = 0;
                            object.height = 0;
                            object.maxHp = 0;
                        }
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            object.team = options.enums === String ? $root.com.triforge.protocol.proto.Team[message.team] === undefined ? message.team : $root.com.triforge.protocol.proto.Team[message.team] : message.team;
                        if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                            object.x = message.x;
                        if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                            object.y = message.y;
                        if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                            object.width = message.width;
                        if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                            object.height = message.height;
                        if (message.maxHp != null && Object.hasOwnProperty.call(message, "maxHp"))
                            object.maxHp = message.maxHp;
                        return object;
                    };

                    /**
                     * Converts this HeadquartersProto to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    HeadquartersProto.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for HeadquartersProto
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.HeadquartersProto
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    HeadquartersProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.HeadquartersProto";
                    };

                    return HeadquartersProto;
                })();

                proto.TileChange = (function() {

                    /**
                     * Properties of a TileChange.
                     * @memberof com.triforge.protocol.proto
                     * @interface ITileChange
                     * @property {number|null} [x] TileChange x
                     * @property {number|null} [y] TileChange y
                     * @property {com.triforge.protocol.proto.TileType|null} [tile] TileChange tile
                     */

                    /**
                     * Constructs a new TileChange.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a TileChange.
                     * @implements ITileChange
                     * @constructor
                     * @param {com.triforge.protocol.proto.ITileChange=} [properties] Properties to set
                     */
                    function TileChange(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * TileChange x.
                     * @member {number} x
                     * @memberof com.triforge.protocol.proto.TileChange
                     * @instance
                     */
                    TileChange.prototype.x = 0;

                    /**
                     * TileChange y.
                     * @member {number} y
                     * @memberof com.triforge.protocol.proto.TileChange
                     * @instance
                     */
                    TileChange.prototype.y = 0;

                    /**
                     * TileChange tile.
                     * @member {com.triforge.protocol.proto.TileType} tile
                     * @memberof com.triforge.protocol.proto.TileChange
                     * @instance
                     */
                    TileChange.prototype.tile = 0;

                    /**
                     * Creates a new TileChange instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.TileChange
                     * @static
                     * @param {com.triforge.protocol.proto.ITileChange=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.TileChange} TileChange instance
                     */
                    TileChange.create = function create(properties) {
                        return new TileChange(properties);
                    };

                    /**
                     * Encodes the specified TileChange message. Does not implicitly {@link com.triforge.protocol.proto.TileChange.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.TileChange
                     * @static
                     * @param {com.triforge.protocol.proto.ITileChange} message TileChange message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TileChange.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.x);
                        if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.y);
                        if (message.tile != null && Object.hasOwnProperty.call(message, "tile"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.tile);
                        return writer;
                    };

                    /**
                     * Encodes the specified TileChange message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.TileChange.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.TileChange
                     * @static
                     * @param {com.triforge.protocol.proto.ITileChange} message TileChange message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TileChange.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a TileChange message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.TileChange
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.TileChange} TileChange
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TileChange.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.TileChange();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.x = reader.uint32();
                                    break;
                                }
                            case 2: {
                                    message.y = reader.uint32();
                                    break;
                                }
                            case 3: {
                                    message.tile = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a TileChange message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.TileChange
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.TileChange} TileChange
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TileChange.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a TileChange message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.TileChange
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    TileChange.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                            if (!$util.isInteger(message.x))
                                return "x: integer expected";
                        if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                            if (!$util.isInteger(message.y))
                                return "y: integer expected";
                        if (message.tile != null && Object.hasOwnProperty.call(message, "tile"))
                            switch (message.tile) {
                            default:
                                return "tile: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                                break;
                            }
                        return null;
                    };

                    /**
                     * Creates a TileChange message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.TileChange
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.TileChange} TileChange
                     */
                    TileChange.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.TileChange)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.TileChange: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.TileChange();
                        if (object.x != null)
                            message.x = object.x >>> 0;
                        if (object.y != null)
                            message.y = object.y >>> 0;
                        switch (object.tile) {
                        default:
                            if (typeof object.tile === "number") {
                                message.tile = object.tile;
                                break;
                            }
                            break;
                        case "EMPTY":
                        case 0:
                            message.tile = 0;
                            break;
                        case "BRICK":
                        case 1:
                            message.tile = 1;
                            break;
                        case "STEEL":
                        case 2:
                            message.tile = 2;
                            break;
                        case "WATER":
                        case 3:
                            message.tile = 3;
                            break;
                        case "TREE":
                        case 4:
                            message.tile = 4;
                            break;
                        case "WALL":
                        case 5:
                            message.tile = 5;
                            break;
                        case "COVER":
                        case 6:
                            message.tile = 6;
                            break;
                        case "HQ":
                        case 7:
                            message.tile = 7;
                            break;
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a TileChange message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.TileChange
                     * @static
                     * @param {com.triforge.protocol.proto.TileChange} message TileChange
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    TileChange.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            object.x = 0;
                            object.y = 0;
                            object.tile = options.enums === String ? "EMPTY" : 0;
                        }
                        if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                            object.x = message.x;
                        if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                            object.y = message.y;
                        if (message.tile != null && Object.hasOwnProperty.call(message, "tile"))
                            object.tile = options.enums === String ? $root.com.triforge.protocol.proto.TileType[message.tile] === undefined ? message.tile : $root.com.triforge.protocol.proto.TileType[message.tile] : message.tile;
                        return object;
                    };

                    /**
                     * Converts this TileChange to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.TileChange
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    TileChange.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for TileChange
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.TileChange
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    TileChange.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.TileChange";
                    };

                    return TileChange;
                })();

                proto.GameEvent = (function() {

                    /**
                     * Properties of a GameEvent.
                     * @memberof com.triforge.protocol.proto
                     * @interface IGameEvent
                     * @property {com.triforge.protocol.proto.GameEventType|null} [type] GameEvent type
                     * @property {number|Long|null} [playerId] GameEvent playerId
                     * @property {number|Long|null} [entityId] GameEvent entityId
                     * @property {number|Long|null} [tick] GameEvent tick
                     * @property {number|null} [livesRemaining] GameEvent livesRemaining
                     * @property {com.triforge.protocol.proto.Team|null} [team] GameEvent team
                     * @property {number|Long|null} [killerPlayerId] GameEvent killerPlayerId
                     * @property {Array.<number|Long>|null} [assistPlayerIds] GameEvent assistPlayerIds
                     */

                    /**
                     * Constructs a new GameEvent.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a GameEvent.
                     * @implements IGameEvent
                     * @constructor
                     * @param {com.triforge.protocol.proto.IGameEvent=} [properties] Properties to set
                     */
                    function GameEvent(properties) {
                        this.assistPlayerIds = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * GameEvent type.
                     * @member {com.triforge.protocol.proto.GameEventType} type
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @instance
                     */
                    GameEvent.prototype.type = 0;

                    /**
                     * GameEvent playerId.
                     * @member {number|Long} playerId
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @instance
                     */
                    GameEvent.prototype.playerId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * GameEvent entityId.
                     * @member {number|Long} entityId
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @instance
                     */
                    GameEvent.prototype.entityId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * GameEvent tick.
                     * @member {number|Long} tick
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @instance
                     */
                    GameEvent.prototype.tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * GameEvent livesRemaining.
                     * @member {number} livesRemaining
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @instance
                     */
                    GameEvent.prototype.livesRemaining = 0;

                    /**
                     * GameEvent team.
                     * @member {com.triforge.protocol.proto.Team} team
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @instance
                     */
                    GameEvent.prototype.team = 0;

                    /**
                     * GameEvent killerPlayerId.
                     * @member {number|Long} killerPlayerId
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @instance
                     */
                    GameEvent.prototype.killerPlayerId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * GameEvent assistPlayerIds.
                     * @member {Array.<number|Long>} assistPlayerIds
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @instance
                     */
                    GameEvent.prototype.assistPlayerIds = $util.emptyArray;

                    /**
                     * Creates a new GameEvent instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @static
                     * @param {com.triforge.protocol.proto.IGameEvent=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.GameEvent} GameEvent instance
                     */
                    GameEvent.create = function create(properties) {
                        return new GameEvent(properties);
                    };

                    /**
                     * Encodes the specified GameEvent message. Does not implicitly {@link com.triforge.protocol.proto.GameEvent.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @static
                     * @param {com.triforge.protocol.proto.IGameEvent} message GameEvent message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    GameEvent.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.playerId);
                        if (message.entityId != null && Object.hasOwnProperty.call(message, "entityId"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.entityId);
                        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                            writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.tick);
                        if (message.livesRemaining != null && Object.hasOwnProperty.call(message, "livesRemaining"))
                            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.livesRemaining);
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.team);
                        if (message.killerPlayerId != null && Object.hasOwnProperty.call(message, "killerPlayerId"))
                            writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.killerPlayerId);
                        if (message.assistPlayerIds != null && message.assistPlayerIds.length) {
                            writer.uint32(/* id 8, wireType 2 =*/66).fork();
                            for (let i = 0; i < message.assistPlayerIds.length; ++i)
                                writer.uint64(message.assistPlayerIds[i]);
                            writer.ldelim();
                        }
                        return writer;
                    };

                    /**
                     * Encodes the specified GameEvent message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.GameEvent.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @static
                     * @param {com.triforge.protocol.proto.IGameEvent} message GameEvent message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    GameEvent.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a GameEvent message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.GameEvent} GameEvent
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    GameEvent.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.GameEvent();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.type = reader.int32();
                                    break;
                                }
                            case 2: {
                                    message.playerId = reader.uint64();
                                    break;
                                }
                            case 3: {
                                    message.entityId = reader.uint64();
                                    break;
                                }
                            case 4: {
                                    message.tick = reader.uint64();
                                    break;
                                }
                            case 5: {
                                    message.livesRemaining = reader.int32();
                                    break;
                                }
                            case 6: {
                                    message.team = reader.int32();
                                    break;
                                }
                            case 7: {
                                    message.killerPlayerId = reader.uint64();
                                    break;
                                }
                            case 8: {
                                    if (!(message.assistPlayerIds && message.assistPlayerIds.length))
                                        message.assistPlayerIds = [];
                                    if ((tag & 7) === 2) {
                                        let end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.assistPlayerIds.push(reader.uint64());
                                    } else
                                        message.assistPlayerIds.push(reader.uint64());
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a GameEvent message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.GameEvent} GameEvent
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    GameEvent.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a GameEvent message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    GameEvent.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                            switch (message.type) {
                            default:
                                return "type: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                                break;
                            }
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            if (!$util.isInteger(message.playerId) && !(message.playerId && $util.isInteger(message.playerId.low) && $util.isInteger(message.playerId.high)))
                                return "playerId: integer|Long expected";
                        if (message.entityId != null && Object.hasOwnProperty.call(message, "entityId"))
                            if (!$util.isInteger(message.entityId) && !(message.entityId && $util.isInteger(message.entityId.low) && $util.isInteger(message.entityId.high)))
                                return "entityId: integer|Long expected";
                        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                            if (!$util.isInteger(message.tick) && !(message.tick && $util.isInteger(message.tick.low) && $util.isInteger(message.tick.high)))
                                return "tick: integer|Long expected";
                        if (message.livesRemaining != null && Object.hasOwnProperty.call(message, "livesRemaining"))
                            if (!$util.isInteger(message.livesRemaining))
                                return "livesRemaining: integer expected";
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            switch (message.team) {
                            default:
                                return "team: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                                break;
                            }
                        if (message.killerPlayerId != null && Object.hasOwnProperty.call(message, "killerPlayerId"))
                            if (!$util.isInteger(message.killerPlayerId) && !(message.killerPlayerId && $util.isInteger(message.killerPlayerId.low) && $util.isInteger(message.killerPlayerId.high)))
                                return "killerPlayerId: integer|Long expected";
                        if (message.assistPlayerIds != null && Object.hasOwnProperty.call(message, "assistPlayerIds")) {
                            if (!Array.isArray(message.assistPlayerIds))
                                return "assistPlayerIds: array expected";
                            for (let i = 0; i < message.assistPlayerIds.length; ++i)
                                if (!$util.isInteger(message.assistPlayerIds[i]) && !(message.assistPlayerIds[i] && $util.isInteger(message.assistPlayerIds[i].low) && $util.isInteger(message.assistPlayerIds[i].high)))
                                    return "assistPlayerIds: integer|Long[] expected";
                        }
                        return null;
                    };

                    /**
                     * Creates a GameEvent message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.GameEvent} GameEvent
                     */
                    GameEvent.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.GameEvent)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.GameEvent: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.GameEvent();
                        switch (object.type) {
                        default:
                            if (typeof object.type === "number") {
                                message.type = object.type;
                                break;
                            }
                            break;
                        case "PLAYER_HIT":
                        case 0:
                            message.type = 0;
                            break;
                        case "PLAYER_DEATH":
                        case 1:
                            message.type = 1;
                            break;
                        case "PLAYER_RESPAWN":
                        case 2:
                            message.type = 2;
                            break;
                        case "MATCH_COUNTDOWN":
                        case 3:
                            message.type = 3;
                            break;
                        case "MATCH_STARTED":
                        case 4:
                            message.type = 4;
                            break;
                        case "MATCH_ENDED":
                        case 5:
                            message.type = 5;
                            break;
                        case "LOBBY_UPDATED":
                        case 6:
                            message.type = 6;
                            break;
                        case "HQ_DAMAGED":
                        case 7:
                            message.type = 7;
                            break;
                        case "HQ_DESTROYED":
                        case 8:
                            message.type = 8;
                            break;
                        }
                        if (object.playerId != null)
                            if ($util.Long)
                                message.playerId = $util.Long.fromValue(object.playerId, true);
                            else if (typeof object.playerId === "string")
                                message.playerId = parseInt(object.playerId, 10);
                            else if (typeof object.playerId === "number")
                                message.playerId = object.playerId;
                            else if (typeof object.playerId === "object")
                                message.playerId = new $util.LongBits(object.playerId.low >>> 0, object.playerId.high >>> 0).toNumber(true);
                        if (object.entityId != null)
                            if ($util.Long)
                                message.entityId = $util.Long.fromValue(object.entityId, true);
                            else if (typeof object.entityId === "string")
                                message.entityId = parseInt(object.entityId, 10);
                            else if (typeof object.entityId === "number")
                                message.entityId = object.entityId;
                            else if (typeof object.entityId === "object")
                                message.entityId = new $util.LongBits(object.entityId.low >>> 0, object.entityId.high >>> 0).toNumber(true);
                        if (object.tick != null)
                            if ($util.Long)
                                message.tick = $util.Long.fromValue(object.tick, true);
                            else if (typeof object.tick === "string")
                                message.tick = parseInt(object.tick, 10);
                            else if (typeof object.tick === "number")
                                message.tick = object.tick;
                            else if (typeof object.tick === "object")
                                message.tick = new $util.LongBits(object.tick.low >>> 0, object.tick.high >>> 0).toNumber(true);
                        if (object.livesRemaining != null)
                            message.livesRemaining = object.livesRemaining | 0;
                        switch (object.team) {
                        default:
                            if (typeof object.team === "number") {
                                message.team = object.team;
                                break;
                            }
                            break;
                        case "TEAM_NONE":
                        case 0:
                            message.team = 0;
                            break;
                        case "TEAM_RED":
                        case 1:
                            message.team = 1;
                            break;
                        case "TEAM_BLUE":
                        case 2:
                            message.team = 2;
                            break;
                        }
                        if (object.killerPlayerId != null)
                            if ($util.Long)
                                message.killerPlayerId = $util.Long.fromValue(object.killerPlayerId, true);
                            else if (typeof object.killerPlayerId === "string")
                                message.killerPlayerId = parseInt(object.killerPlayerId, 10);
                            else if (typeof object.killerPlayerId === "number")
                                message.killerPlayerId = object.killerPlayerId;
                            else if (typeof object.killerPlayerId === "object")
                                message.killerPlayerId = new $util.LongBits(object.killerPlayerId.low >>> 0, object.killerPlayerId.high >>> 0).toNumber(true);
                        if (object.assistPlayerIds) {
                            if (!Array.isArray(object.assistPlayerIds))
                                throw TypeError(".com.triforge.protocol.proto.GameEvent.assistPlayerIds: array expected");
                            message.assistPlayerIds = [];
                            for (let i = 0; i < object.assistPlayerIds.length; ++i)
                                if ($util.Long)
                                    message.assistPlayerIds[i] = $util.Long.fromValue(object.assistPlayerIds[i], true);
                                else if (typeof object.assistPlayerIds[i] === "string")
                                    message.assistPlayerIds[i] = parseInt(object.assistPlayerIds[i], 10);
                                else if (typeof object.assistPlayerIds[i] === "number")
                                    message.assistPlayerIds[i] = object.assistPlayerIds[i];
                                else if (typeof object.assistPlayerIds[i] === "object")
                                    message.assistPlayerIds[i] = new $util.LongBits(object.assistPlayerIds[i].low >>> 0, object.assistPlayerIds[i].high >>> 0).toNumber(true);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a GameEvent message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @static
                     * @param {com.triforge.protocol.proto.GameEvent} message GameEvent
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    GameEvent.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.assistPlayerIds = [];
                        if (options.defaults) {
                            object.type = options.enums === String ? "PLAYER_HIT" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.playerId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.playerId = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.entityId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.entityId = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.tick = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.tick = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            object.livesRemaining = 0;
                            object.team = options.enums === String ? "TEAM_NONE" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.killerPlayerId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.killerPlayerId = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                        }
                        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                            object.type = options.enums === String ? $root.com.triforge.protocol.proto.GameEventType[message.type] === undefined ? message.type : $root.com.triforge.protocol.proto.GameEventType[message.type] : message.type;
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.playerId = typeof message.playerId === "number" ? BigInt(message.playerId) : $util.Long.fromBits(message.playerId.low >>> 0, message.playerId.high >>> 0, true).toBigInt();
                            else if (typeof message.playerId === "number")
                                object.playerId = options.longs === String ? String(message.playerId) : message.playerId;
                            else
                                object.playerId = options.longs === String ? $util.Long.prototype.toString.call(message.playerId) : options.longs === Number ? new $util.LongBits(message.playerId.low >>> 0, message.playerId.high >>> 0).toNumber(true) : message.playerId;
                        if (message.entityId != null && Object.hasOwnProperty.call(message, "entityId"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.entityId = typeof message.entityId === "number" ? BigInt(message.entityId) : $util.Long.fromBits(message.entityId.low >>> 0, message.entityId.high >>> 0, true).toBigInt();
                            else if (typeof message.entityId === "number")
                                object.entityId = options.longs === String ? String(message.entityId) : message.entityId;
                            else
                                object.entityId = options.longs === String ? $util.Long.prototype.toString.call(message.entityId) : options.longs === Number ? new $util.LongBits(message.entityId.low >>> 0, message.entityId.high >>> 0).toNumber(true) : message.entityId;
                        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.tick = typeof message.tick === "number" ? BigInt(message.tick) : $util.Long.fromBits(message.tick.low >>> 0, message.tick.high >>> 0, true).toBigInt();
                            else if (typeof message.tick === "number")
                                object.tick = options.longs === String ? String(message.tick) : message.tick;
                            else
                                object.tick = options.longs === String ? $util.Long.prototype.toString.call(message.tick) : options.longs === Number ? new $util.LongBits(message.tick.low >>> 0, message.tick.high >>> 0).toNumber(true) : message.tick;
                        if (message.livesRemaining != null && Object.hasOwnProperty.call(message, "livesRemaining"))
                            object.livesRemaining = message.livesRemaining;
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            object.team = options.enums === String ? $root.com.triforge.protocol.proto.Team[message.team] === undefined ? message.team : $root.com.triforge.protocol.proto.Team[message.team] : message.team;
                        if (message.killerPlayerId != null && Object.hasOwnProperty.call(message, "killerPlayerId"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.killerPlayerId = typeof message.killerPlayerId === "number" ? BigInt(message.killerPlayerId) : $util.Long.fromBits(message.killerPlayerId.low >>> 0, message.killerPlayerId.high >>> 0, true).toBigInt();
                            else if (typeof message.killerPlayerId === "number")
                                object.killerPlayerId = options.longs === String ? String(message.killerPlayerId) : message.killerPlayerId;
                            else
                                object.killerPlayerId = options.longs === String ? $util.Long.prototype.toString.call(message.killerPlayerId) : options.longs === Number ? new $util.LongBits(message.killerPlayerId.low >>> 0, message.killerPlayerId.high >>> 0).toNumber(true) : message.killerPlayerId;
                        if (message.assistPlayerIds && message.assistPlayerIds.length) {
                            object.assistPlayerIds = [];
                            for (let j = 0; j < message.assistPlayerIds.length; ++j)
                                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                    object.assistPlayerIds[j] = typeof message.assistPlayerIds[j] === "number" ? BigInt(message.assistPlayerIds[j]) : $util.Long.fromBits(message.assistPlayerIds[j].low >>> 0, message.assistPlayerIds[j].high >>> 0, true).toBigInt();
                                else if (typeof message.assistPlayerIds[j] === "number")
                                    object.assistPlayerIds[j] = options.longs === String ? String(message.assistPlayerIds[j]) : message.assistPlayerIds[j];
                                else
                                    object.assistPlayerIds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.assistPlayerIds[j]) : options.longs === Number ? new $util.LongBits(message.assistPlayerIds[j].low >>> 0, message.assistPlayerIds[j].high >>> 0).toNumber(true) : message.assistPlayerIds[j];
                        }
                        return object;
                    };

                    /**
                     * Converts this GameEvent to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    GameEvent.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for GameEvent
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.GameEvent
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    GameEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.GameEvent";
                    };

                    return GameEvent;
                })();

                proto.PlayerComponentProto = (function() {

                    /**
                     * Properties of a PlayerComponentProto.
                     * @memberof com.triforge.protocol.proto
                     * @interface IPlayerComponentProto
                     * @property {number|Long|null} [playerId] PlayerComponentProto playerId
                     * @property {string|null} [name] PlayerComponentProto name
                     * @property {number|null} [score] PlayerComponentProto score
                     * @property {number|null} [lives] PlayerComponentProto lives
                     * @property {com.triforge.protocol.proto.Team|null} [team] PlayerComponentProto team
                     */

                    /**
                     * Constructs a new PlayerComponentProto.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a PlayerComponentProto.
                     * @implements IPlayerComponentProto
                     * @constructor
                     * @param {com.triforge.protocol.proto.IPlayerComponentProto=} [properties] Properties to set
                     */
                    function PlayerComponentProto(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * PlayerComponentProto playerId.
                     * @member {number|Long} playerId
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @instance
                     */
                    PlayerComponentProto.prototype.playerId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * PlayerComponentProto name.
                     * @member {string} name
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @instance
                     */
                    PlayerComponentProto.prototype.name = "";

                    /**
                     * PlayerComponentProto score.
                     * @member {number} score
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @instance
                     */
                    PlayerComponentProto.prototype.score = 0;

                    /**
                     * PlayerComponentProto lives.
                     * @member {number} lives
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @instance
                     */
                    PlayerComponentProto.prototype.lives = 0;

                    /**
                     * PlayerComponentProto team.
                     * @member {com.triforge.protocol.proto.Team} team
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @instance
                     */
                    PlayerComponentProto.prototype.team = 0;

                    /**
                     * Creates a new PlayerComponentProto instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.IPlayerComponentProto=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.PlayerComponentProto} PlayerComponentProto instance
                     */
                    PlayerComponentProto.create = function create(properties) {
                        return new PlayerComponentProto(properties);
                    };

                    /**
                     * Encodes the specified PlayerComponentProto message. Does not implicitly {@link com.triforge.protocol.proto.PlayerComponentProto.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.IPlayerComponentProto} message PlayerComponentProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PlayerComponentProto.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.playerId);
                        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                        if (message.score != null && Object.hasOwnProperty.call(message, "score"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.score);
                        if (message.lives != null && Object.hasOwnProperty.call(message, "lives"))
                            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.lives);
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.team);
                        return writer;
                    };

                    /**
                     * Encodes the specified PlayerComponentProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.PlayerComponentProto.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.IPlayerComponentProto} message PlayerComponentProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PlayerComponentProto.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a PlayerComponentProto message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.PlayerComponentProto} PlayerComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PlayerComponentProto.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.PlayerComponentProto();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.playerId = reader.uint64();
                                    break;
                                }
                            case 2: {
                                    message.name = reader.string();
                                    break;
                                }
                            case 3: {
                                    message.score = reader.int32();
                                    break;
                                }
                            case 4: {
                                    message.lives = reader.int32();
                                    break;
                                }
                            case 5: {
                                    message.team = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a PlayerComponentProto message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.PlayerComponentProto} PlayerComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PlayerComponentProto.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a PlayerComponentProto message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    PlayerComponentProto.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            if (!$util.isInteger(message.playerId) && !(message.playerId && $util.isInteger(message.playerId.low) && $util.isInteger(message.playerId.high)))
                                return "playerId: integer|Long expected";
                        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                            if (!$util.isString(message.name))
                                return "name: string expected";
                        if (message.score != null && Object.hasOwnProperty.call(message, "score"))
                            if (!$util.isInteger(message.score))
                                return "score: integer expected";
                        if (message.lives != null && Object.hasOwnProperty.call(message, "lives"))
                            if (!$util.isInteger(message.lives))
                                return "lives: integer expected";
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            switch (message.team) {
                            default:
                                return "team: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                                break;
                            }
                        return null;
                    };

                    /**
                     * Creates a PlayerComponentProto message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.PlayerComponentProto} PlayerComponentProto
                     */
                    PlayerComponentProto.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.PlayerComponentProto)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.PlayerComponentProto: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.PlayerComponentProto();
                        if (object.playerId != null)
                            if ($util.Long)
                                message.playerId = $util.Long.fromValue(object.playerId, true);
                            else if (typeof object.playerId === "string")
                                message.playerId = parseInt(object.playerId, 10);
                            else if (typeof object.playerId === "number")
                                message.playerId = object.playerId;
                            else if (typeof object.playerId === "object")
                                message.playerId = new $util.LongBits(object.playerId.low >>> 0, object.playerId.high >>> 0).toNumber(true);
                        if (object.name != null)
                            message.name = String(object.name);
                        if (object.score != null)
                            message.score = object.score | 0;
                        if (object.lives != null)
                            message.lives = object.lives | 0;
                        switch (object.team) {
                        default:
                            if (typeof object.team === "number") {
                                message.team = object.team;
                                break;
                            }
                            break;
                        case "TEAM_NONE":
                        case 0:
                            message.team = 0;
                            break;
                        case "TEAM_RED":
                        case 1:
                            message.team = 1;
                            break;
                        case "TEAM_BLUE":
                        case 2:
                            message.team = 2;
                            break;
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a PlayerComponentProto message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.PlayerComponentProto} message PlayerComponentProto
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    PlayerComponentProto.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.playerId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.playerId = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            object.name = "";
                            object.score = 0;
                            object.lives = 0;
                            object.team = options.enums === String ? "TEAM_NONE" : 0;
                        }
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.playerId = typeof message.playerId === "number" ? BigInt(message.playerId) : $util.Long.fromBits(message.playerId.low >>> 0, message.playerId.high >>> 0, true).toBigInt();
                            else if (typeof message.playerId === "number")
                                object.playerId = options.longs === String ? String(message.playerId) : message.playerId;
                            else
                                object.playerId = options.longs === String ? $util.Long.prototype.toString.call(message.playerId) : options.longs === Number ? new $util.LongBits(message.playerId.low >>> 0, message.playerId.high >>> 0).toNumber(true) : message.playerId;
                        if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                            object.name = message.name;
                        if (message.score != null && Object.hasOwnProperty.call(message, "score"))
                            object.score = message.score;
                        if (message.lives != null && Object.hasOwnProperty.call(message, "lives"))
                            object.lives = message.lives;
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            object.team = options.enums === String ? $root.com.triforge.protocol.proto.Team[message.team] === undefined ? message.team : $root.com.triforge.protocol.proto.Team[message.team] : message.team;
                        return object;
                    };

                    /**
                     * Converts this PlayerComponentProto to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    PlayerComponentProto.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for PlayerComponentProto
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.PlayerComponentProto
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    PlayerComponentProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.PlayerComponentProto";
                    };

                    return PlayerComponentProto;
                })();

                proto.PositionComponentProto = (function() {

                    /**
                     * Properties of a PositionComponentProto.
                     * @memberof com.triforge.protocol.proto
                     * @interface IPositionComponentProto
                     * @property {number|null} [x] PositionComponentProto x
                     * @property {number|null} [y] PositionComponentProto y
                     */

                    /**
                     * Constructs a new PositionComponentProto.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a PositionComponentProto.
                     * @implements IPositionComponentProto
                     * @constructor
                     * @param {com.triforge.protocol.proto.IPositionComponentProto=} [properties] Properties to set
                     */
                    function PositionComponentProto(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * PositionComponentProto x.
                     * @member {number} x
                     * @memberof com.triforge.protocol.proto.PositionComponentProto
                     * @instance
                     */
                    PositionComponentProto.prototype.x = 0;

                    /**
                     * PositionComponentProto y.
                     * @member {number} y
                     * @memberof com.triforge.protocol.proto.PositionComponentProto
                     * @instance
                     */
                    PositionComponentProto.prototype.y = 0;

                    /**
                     * Creates a new PositionComponentProto instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.PositionComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.IPositionComponentProto=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.PositionComponentProto} PositionComponentProto instance
                     */
                    PositionComponentProto.create = function create(properties) {
                        return new PositionComponentProto(properties);
                    };

                    /**
                     * Encodes the specified PositionComponentProto message. Does not implicitly {@link com.triforge.protocol.proto.PositionComponentProto.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.PositionComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.IPositionComponentProto} message PositionComponentProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PositionComponentProto.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                            writer.uint32(/* id 1, wireType 5 =*/13).float(message.x);
                        if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                            writer.uint32(/* id 2, wireType 5 =*/21).float(message.y);
                        return writer;
                    };

                    /**
                     * Encodes the specified PositionComponentProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.PositionComponentProto.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.PositionComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.IPositionComponentProto} message PositionComponentProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PositionComponentProto.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a PositionComponentProto message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.PositionComponentProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.PositionComponentProto} PositionComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PositionComponentProto.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.PositionComponentProto();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.x = reader.float();
                                    break;
                                }
                            case 2: {
                                    message.y = reader.float();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a PositionComponentProto message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.PositionComponentProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.PositionComponentProto} PositionComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PositionComponentProto.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a PositionComponentProto message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.PositionComponentProto
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    PositionComponentProto.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                            if (typeof message.x !== "number")
                                return "x: number expected";
                        if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                            if (typeof message.y !== "number")
                                return "y: number expected";
                        return null;
                    };

                    /**
                     * Creates a PositionComponentProto message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.PositionComponentProto
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.PositionComponentProto} PositionComponentProto
                     */
                    PositionComponentProto.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.PositionComponentProto)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.PositionComponentProto: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.PositionComponentProto();
                        if (object.x != null)
                            message.x = Number(object.x);
                        if (object.y != null)
                            message.y = Number(object.y);
                        return message;
                    };

                    /**
                     * Creates a plain object from a PositionComponentProto message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.PositionComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.PositionComponentProto} message PositionComponentProto
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    PositionComponentProto.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            object.x = 0;
                            object.y = 0;
                        }
                        if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                            object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
                        if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                            object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
                        return object;
                    };

                    /**
                     * Converts this PositionComponentProto to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.PositionComponentProto
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    PositionComponentProto.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for PositionComponentProto
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.PositionComponentProto
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    PositionComponentProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.PositionComponentProto";
                    };

                    return PositionComponentProto;
                })();

                proto.DirectionComponentProto = (function() {

                    /**
                     * Properties of a DirectionComponentProto.
                     * @memberof com.triforge.protocol.proto
                     * @interface IDirectionComponentProto
                     * @property {com.triforge.protocol.proto.Direction|null} [direction] DirectionComponentProto direction
                     */

                    /**
                     * Constructs a new DirectionComponentProto.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a DirectionComponentProto.
                     * @implements IDirectionComponentProto
                     * @constructor
                     * @param {com.triforge.protocol.proto.IDirectionComponentProto=} [properties] Properties to set
                     */
                    function DirectionComponentProto(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * DirectionComponentProto direction.
                     * @member {com.triforge.protocol.proto.Direction} direction
                     * @memberof com.triforge.protocol.proto.DirectionComponentProto
                     * @instance
                     */
                    DirectionComponentProto.prototype.direction = 0;

                    /**
                     * Creates a new DirectionComponentProto instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.DirectionComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.IDirectionComponentProto=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.DirectionComponentProto} DirectionComponentProto instance
                     */
                    DirectionComponentProto.create = function create(properties) {
                        return new DirectionComponentProto(properties);
                    };

                    /**
                     * Encodes the specified DirectionComponentProto message. Does not implicitly {@link com.triforge.protocol.proto.DirectionComponentProto.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.DirectionComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.IDirectionComponentProto} message DirectionComponentProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DirectionComponentProto.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.direction);
                        return writer;
                    };

                    /**
                     * Encodes the specified DirectionComponentProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.DirectionComponentProto.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.DirectionComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.IDirectionComponentProto} message DirectionComponentProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DirectionComponentProto.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a DirectionComponentProto message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.DirectionComponentProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.DirectionComponentProto} DirectionComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DirectionComponentProto.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.DirectionComponentProto();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.direction = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a DirectionComponentProto message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.DirectionComponentProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.DirectionComponentProto} DirectionComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DirectionComponentProto.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a DirectionComponentProto message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.DirectionComponentProto
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    DirectionComponentProto.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                            switch (message.direction) {
                            default:
                                return "direction: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                                break;
                            }
                        return null;
                    };

                    /**
                     * Creates a DirectionComponentProto message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.DirectionComponentProto
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.DirectionComponentProto} DirectionComponentProto
                     */
                    DirectionComponentProto.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.DirectionComponentProto)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.DirectionComponentProto: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.DirectionComponentProto();
                        switch (object.direction) {
                        default:
                            if (typeof object.direction === "number") {
                                message.direction = object.direction;
                                break;
                            }
                            break;
                        case "UP":
                        case 0:
                            message.direction = 0;
                            break;
                        case "DOWN":
                        case 1:
                            message.direction = 1;
                            break;
                        case "LEFT":
                        case 2:
                            message.direction = 2;
                            break;
                        case "RIGHT":
                        case 3:
                            message.direction = 3;
                            break;
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a DirectionComponentProto message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.DirectionComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.DirectionComponentProto} message DirectionComponentProto
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    DirectionComponentProto.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults)
                            object.direction = options.enums === String ? "UP" : 0;
                        if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                            object.direction = options.enums === String ? $root.com.triforge.protocol.proto.Direction[message.direction] === undefined ? message.direction : $root.com.triforge.protocol.proto.Direction[message.direction] : message.direction;
                        return object;
                    };

                    /**
                     * Converts this DirectionComponentProto to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.DirectionComponentProto
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    DirectionComponentProto.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for DirectionComponentProto
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.DirectionComponentProto
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    DirectionComponentProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.DirectionComponentProto";
                    };

                    return DirectionComponentProto;
                })();

                proto.TankComponentProto = (function() {

                    /**
                     * Properties of a TankComponentProto.
                     * @memberof com.triforge.protocol.proto
                     * @interface ITankComponentProto
                     * @property {number|null} [speed] TankComponentProto speed
                     * @property {number|Long|null} [shootCooldownTicks] TankComponentProto shootCooldownTicks
                     * @property {number|Long|null} [cooldownRemainingTicks] TankComponentProto cooldownRemainingTicks
                     */

                    /**
                     * Constructs a new TankComponentProto.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a TankComponentProto.
                     * @implements ITankComponentProto
                     * @constructor
                     * @param {com.triforge.protocol.proto.ITankComponentProto=} [properties] Properties to set
                     */
                    function TankComponentProto(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * TankComponentProto speed.
                     * @member {number} speed
                     * @memberof com.triforge.protocol.proto.TankComponentProto
                     * @instance
                     */
                    TankComponentProto.prototype.speed = 0;

                    /**
                     * TankComponentProto shootCooldownTicks.
                     * @member {number|Long} shootCooldownTicks
                     * @memberof com.triforge.protocol.proto.TankComponentProto
                     * @instance
                     */
                    TankComponentProto.prototype.shootCooldownTicks = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * TankComponentProto cooldownRemainingTicks.
                     * @member {number|Long} cooldownRemainingTicks
                     * @memberof com.triforge.protocol.proto.TankComponentProto
                     * @instance
                     */
                    TankComponentProto.prototype.cooldownRemainingTicks = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * Creates a new TankComponentProto instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.TankComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.ITankComponentProto=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.TankComponentProto} TankComponentProto instance
                     */
                    TankComponentProto.create = function create(properties) {
                        return new TankComponentProto(properties);
                    };

                    /**
                     * Encodes the specified TankComponentProto message. Does not implicitly {@link com.triforge.protocol.proto.TankComponentProto.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.TankComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.ITankComponentProto} message TankComponentProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TankComponentProto.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                            writer.uint32(/* id 1, wireType 5 =*/13).float(message.speed);
                        if (message.shootCooldownTicks != null && Object.hasOwnProperty.call(message, "shootCooldownTicks"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.shootCooldownTicks);
                        if (message.cooldownRemainingTicks != null && Object.hasOwnProperty.call(message, "cooldownRemainingTicks"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.cooldownRemainingTicks);
                        return writer;
                    };

                    /**
                     * Encodes the specified TankComponentProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.TankComponentProto.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.TankComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.ITankComponentProto} message TankComponentProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TankComponentProto.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a TankComponentProto message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.TankComponentProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.TankComponentProto} TankComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TankComponentProto.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.TankComponentProto();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.speed = reader.float();
                                    break;
                                }
                            case 2: {
                                    message.shootCooldownTicks = reader.uint64();
                                    break;
                                }
                            case 3: {
                                    message.cooldownRemainingTicks = reader.uint64();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a TankComponentProto message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.TankComponentProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.TankComponentProto} TankComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TankComponentProto.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a TankComponentProto message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.TankComponentProto
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    TankComponentProto.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                            if (typeof message.speed !== "number")
                                return "speed: number expected";
                        if (message.shootCooldownTicks != null && Object.hasOwnProperty.call(message, "shootCooldownTicks"))
                            if (!$util.isInteger(message.shootCooldownTicks) && !(message.shootCooldownTicks && $util.isInteger(message.shootCooldownTicks.low) && $util.isInteger(message.shootCooldownTicks.high)))
                                return "shootCooldownTicks: integer|Long expected";
                        if (message.cooldownRemainingTicks != null && Object.hasOwnProperty.call(message, "cooldownRemainingTicks"))
                            if (!$util.isInteger(message.cooldownRemainingTicks) && !(message.cooldownRemainingTicks && $util.isInteger(message.cooldownRemainingTicks.low) && $util.isInteger(message.cooldownRemainingTicks.high)))
                                return "cooldownRemainingTicks: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates a TankComponentProto message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.TankComponentProto
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.TankComponentProto} TankComponentProto
                     */
                    TankComponentProto.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.TankComponentProto)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.TankComponentProto: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.TankComponentProto();
                        if (object.speed != null)
                            message.speed = Number(object.speed);
                        if (object.shootCooldownTicks != null)
                            if ($util.Long)
                                message.shootCooldownTicks = $util.Long.fromValue(object.shootCooldownTicks, true);
                            else if (typeof object.shootCooldownTicks === "string")
                                message.shootCooldownTicks = parseInt(object.shootCooldownTicks, 10);
                            else if (typeof object.shootCooldownTicks === "number")
                                message.shootCooldownTicks = object.shootCooldownTicks;
                            else if (typeof object.shootCooldownTicks === "object")
                                message.shootCooldownTicks = new $util.LongBits(object.shootCooldownTicks.low >>> 0, object.shootCooldownTicks.high >>> 0).toNumber(true);
                        if (object.cooldownRemainingTicks != null)
                            if ($util.Long)
                                message.cooldownRemainingTicks = $util.Long.fromValue(object.cooldownRemainingTicks, true);
                            else if (typeof object.cooldownRemainingTicks === "string")
                                message.cooldownRemainingTicks = parseInt(object.cooldownRemainingTicks, 10);
                            else if (typeof object.cooldownRemainingTicks === "number")
                                message.cooldownRemainingTicks = object.cooldownRemainingTicks;
                            else if (typeof object.cooldownRemainingTicks === "object")
                                message.cooldownRemainingTicks = new $util.LongBits(object.cooldownRemainingTicks.low >>> 0, object.cooldownRemainingTicks.high >>> 0).toNumber(true);
                        return message;
                    };

                    /**
                     * Creates a plain object from a TankComponentProto message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.TankComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.TankComponentProto} message TankComponentProto
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    TankComponentProto.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            object.speed = 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.shootCooldownTicks = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.shootCooldownTicks = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.cooldownRemainingTicks = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.cooldownRemainingTicks = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                        }
                        if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                            object.speed = options.json && !isFinite(message.speed) ? String(message.speed) : message.speed;
                        if (message.shootCooldownTicks != null && Object.hasOwnProperty.call(message, "shootCooldownTicks"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.shootCooldownTicks = typeof message.shootCooldownTicks === "number" ? BigInt(message.shootCooldownTicks) : $util.Long.fromBits(message.shootCooldownTicks.low >>> 0, message.shootCooldownTicks.high >>> 0, true).toBigInt();
                            else if (typeof message.shootCooldownTicks === "number")
                                object.shootCooldownTicks = options.longs === String ? String(message.shootCooldownTicks) : message.shootCooldownTicks;
                            else
                                object.shootCooldownTicks = options.longs === String ? $util.Long.prototype.toString.call(message.shootCooldownTicks) : options.longs === Number ? new $util.LongBits(message.shootCooldownTicks.low >>> 0, message.shootCooldownTicks.high >>> 0).toNumber(true) : message.shootCooldownTicks;
                        if (message.cooldownRemainingTicks != null && Object.hasOwnProperty.call(message, "cooldownRemainingTicks"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.cooldownRemainingTicks = typeof message.cooldownRemainingTicks === "number" ? BigInt(message.cooldownRemainingTicks) : $util.Long.fromBits(message.cooldownRemainingTicks.low >>> 0, message.cooldownRemainingTicks.high >>> 0, true).toBigInt();
                            else if (typeof message.cooldownRemainingTicks === "number")
                                object.cooldownRemainingTicks = options.longs === String ? String(message.cooldownRemainingTicks) : message.cooldownRemainingTicks;
                            else
                                object.cooldownRemainingTicks = options.longs === String ? $util.Long.prototype.toString.call(message.cooldownRemainingTicks) : options.longs === Number ? new $util.LongBits(message.cooldownRemainingTicks.low >>> 0, message.cooldownRemainingTicks.high >>> 0).toNumber(true) : message.cooldownRemainingTicks;
                        return object;
                    };

                    /**
                     * Converts this TankComponentProto to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.TankComponentProto
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    TankComponentProto.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for TankComponentProto
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.TankComponentProto
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    TankComponentProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.TankComponentProto";
                    };

                    return TankComponentProto;
                })();

                proto.BulletComponentProto = (function() {

                    /**
                     * Properties of a BulletComponentProto.
                     * @memberof com.triforge.protocol.proto
                     * @interface IBulletComponentProto
                     * @property {number|Long|null} [ownerEntityId] BulletComponentProto ownerEntityId
                     * @property {number|null} [speed] BulletComponentProto speed
                     * @property {number|null} [dx] BulletComponentProto dx
                     * @property {number|null} [dy] BulletComponentProto dy
                     */

                    /**
                     * Constructs a new BulletComponentProto.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a BulletComponentProto.
                     * @implements IBulletComponentProto
                     * @constructor
                     * @param {com.triforge.protocol.proto.IBulletComponentProto=} [properties] Properties to set
                     */
                    function BulletComponentProto(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * BulletComponentProto ownerEntityId.
                     * @member {number|Long} ownerEntityId
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @instance
                     */
                    BulletComponentProto.prototype.ownerEntityId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * BulletComponentProto speed.
                     * @member {number} speed
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @instance
                     */
                    BulletComponentProto.prototype.speed = 0;

                    /**
                     * BulletComponentProto dx.
                     * @member {number} dx
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @instance
                     */
                    BulletComponentProto.prototype.dx = 0;

                    /**
                     * BulletComponentProto dy.
                     * @member {number} dy
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @instance
                     */
                    BulletComponentProto.prototype.dy = 0;

                    /**
                     * Creates a new BulletComponentProto instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.IBulletComponentProto=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.BulletComponentProto} BulletComponentProto instance
                     */
                    BulletComponentProto.create = function create(properties) {
                        return new BulletComponentProto(properties);
                    };

                    /**
                     * Encodes the specified BulletComponentProto message. Does not implicitly {@link com.triforge.protocol.proto.BulletComponentProto.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.IBulletComponentProto} message BulletComponentProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    BulletComponentProto.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.ownerEntityId != null && Object.hasOwnProperty.call(message, "ownerEntityId"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.ownerEntityId);
                        if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                            writer.uint32(/* id 2, wireType 5 =*/21).float(message.speed);
                        if (message.dx != null && Object.hasOwnProperty.call(message, "dx"))
                            writer.uint32(/* id 3, wireType 5 =*/29).float(message.dx);
                        if (message.dy != null && Object.hasOwnProperty.call(message, "dy"))
                            writer.uint32(/* id 4, wireType 5 =*/37).float(message.dy);
                        return writer;
                    };

                    /**
                     * Encodes the specified BulletComponentProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BulletComponentProto.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.IBulletComponentProto} message BulletComponentProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    BulletComponentProto.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a BulletComponentProto message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.BulletComponentProto} BulletComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    BulletComponentProto.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.BulletComponentProto();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.ownerEntityId = reader.uint64();
                                    break;
                                }
                            case 2: {
                                    message.speed = reader.float();
                                    break;
                                }
                            case 3: {
                                    message.dx = reader.float();
                                    break;
                                }
                            case 4: {
                                    message.dy = reader.float();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a BulletComponentProto message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.BulletComponentProto} BulletComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    BulletComponentProto.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a BulletComponentProto message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    BulletComponentProto.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.ownerEntityId != null && Object.hasOwnProperty.call(message, "ownerEntityId"))
                            if (!$util.isInteger(message.ownerEntityId) && !(message.ownerEntityId && $util.isInteger(message.ownerEntityId.low) && $util.isInteger(message.ownerEntityId.high)))
                                return "ownerEntityId: integer|Long expected";
                        if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                            if (typeof message.speed !== "number")
                                return "speed: number expected";
                        if (message.dx != null && Object.hasOwnProperty.call(message, "dx"))
                            if (typeof message.dx !== "number")
                                return "dx: number expected";
                        if (message.dy != null && Object.hasOwnProperty.call(message, "dy"))
                            if (typeof message.dy !== "number")
                                return "dy: number expected";
                        return null;
                    };

                    /**
                     * Creates a BulletComponentProto message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.BulletComponentProto} BulletComponentProto
                     */
                    BulletComponentProto.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.BulletComponentProto)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.BulletComponentProto: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.BulletComponentProto();
                        if (object.ownerEntityId != null)
                            if ($util.Long)
                                message.ownerEntityId = $util.Long.fromValue(object.ownerEntityId, true);
                            else if (typeof object.ownerEntityId === "string")
                                message.ownerEntityId = parseInt(object.ownerEntityId, 10);
                            else if (typeof object.ownerEntityId === "number")
                                message.ownerEntityId = object.ownerEntityId;
                            else if (typeof object.ownerEntityId === "object")
                                message.ownerEntityId = new $util.LongBits(object.ownerEntityId.low >>> 0, object.ownerEntityId.high >>> 0).toNumber(true);
                        if (object.speed != null)
                            message.speed = Number(object.speed);
                        if (object.dx != null)
                            message.dx = Number(object.dx);
                        if (object.dy != null)
                            message.dy = Number(object.dy);
                        return message;
                    };

                    /**
                     * Creates a plain object from a BulletComponentProto message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @static
                     * @param {com.triforge.protocol.proto.BulletComponentProto} message BulletComponentProto
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    BulletComponentProto.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.ownerEntityId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.ownerEntityId = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            object.speed = 0;
                            object.dx = 0;
                            object.dy = 0;
                        }
                        if (message.ownerEntityId != null && Object.hasOwnProperty.call(message, "ownerEntityId"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.ownerEntityId = typeof message.ownerEntityId === "number" ? BigInt(message.ownerEntityId) : $util.Long.fromBits(message.ownerEntityId.low >>> 0, message.ownerEntityId.high >>> 0, true).toBigInt();
                            else if (typeof message.ownerEntityId === "number")
                                object.ownerEntityId = options.longs === String ? String(message.ownerEntityId) : message.ownerEntityId;
                            else
                                object.ownerEntityId = options.longs === String ? $util.Long.prototype.toString.call(message.ownerEntityId) : options.longs === Number ? new $util.LongBits(message.ownerEntityId.low >>> 0, message.ownerEntityId.high >>> 0).toNumber(true) : message.ownerEntityId;
                        if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                            object.speed = options.json && !isFinite(message.speed) ? String(message.speed) : message.speed;
                        if (message.dx != null && Object.hasOwnProperty.call(message, "dx"))
                            object.dx = options.json && !isFinite(message.dx) ? String(message.dx) : message.dx;
                        if (message.dy != null && Object.hasOwnProperty.call(message, "dy"))
                            object.dy = options.json && !isFinite(message.dy) ? String(message.dy) : message.dy;
                        return object;
                    };

                    /**
                     * Converts this BulletComponentProto to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    BulletComponentProto.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for BulletComponentProto
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.BulletComponentProto
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    BulletComponentProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.BulletComponentProto";
                    };

                    return BulletComponentProto;
                })();

                proto.EntityProto = (function() {

                    /**
                     * Properties of an EntityProto.
                     * @memberof com.triforge.protocol.proto
                     * @interface IEntityProto
                     * @property {number|Long|null} [entityId] EntityProto entityId
                     * @property {com.triforge.protocol.proto.IPlayerComponentProto|null} [player] EntityProto player
                     * @property {com.triforge.protocol.proto.IPositionComponentProto|null} [position] EntityProto position
                     * @property {com.triforge.protocol.proto.IDirectionComponentProto|null} [direction] EntityProto direction
                     * @property {com.triforge.protocol.proto.ITankComponentProto|null} [tank] EntityProto tank
                     * @property {com.triforge.protocol.proto.IBulletComponentProto|null} [bullet] EntityProto bullet
                     */

                    /**
                     * Constructs a new EntityProto.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents an EntityProto.
                     * @implements IEntityProto
                     * @constructor
                     * @param {com.triforge.protocol.proto.IEntityProto=} [properties] Properties to set
                     */
                    function EntityProto(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * EntityProto entityId.
                     * @member {number|Long} entityId
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @instance
                     */
                    EntityProto.prototype.entityId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * EntityProto player.
                     * @member {com.triforge.protocol.proto.IPlayerComponentProto|null|undefined} player
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @instance
                     */
                    EntityProto.prototype.player = null;

                    /**
                     * EntityProto position.
                     * @member {com.triforge.protocol.proto.IPositionComponentProto|null|undefined} position
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @instance
                     */
                    EntityProto.prototype.position = null;

                    /**
                     * EntityProto direction.
                     * @member {com.triforge.protocol.proto.IDirectionComponentProto|null|undefined} direction
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @instance
                     */
                    EntityProto.prototype.direction = null;

                    /**
                     * EntityProto tank.
                     * @member {com.triforge.protocol.proto.ITankComponentProto|null|undefined} tank
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @instance
                     */
                    EntityProto.prototype.tank = null;

                    /**
                     * EntityProto bullet.
                     * @member {com.triforge.protocol.proto.IBulletComponentProto|null|undefined} bullet
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @instance
                     */
                    EntityProto.prototype.bullet = null;

                    /**
                     * Creates a new EntityProto instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @static
                     * @param {com.triforge.protocol.proto.IEntityProto=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.EntityProto} EntityProto instance
                     */
                    EntityProto.create = function create(properties) {
                        return new EntityProto(properties);
                    };

                    /**
                     * Encodes the specified EntityProto message. Does not implicitly {@link com.triforge.protocol.proto.EntityProto.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @static
                     * @param {com.triforge.protocol.proto.IEntityProto} message EntityProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    EntityProto.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.entityId != null && Object.hasOwnProperty.call(message, "entityId"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.entityId);
                        if (message.player != null && Object.hasOwnProperty.call(message, "player"))
                            $root.com.triforge.protocol.proto.PlayerComponentProto.encode(message.player, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                        if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                            $root.com.triforge.protocol.proto.PositionComponentProto.encode(message.position, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
                        if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                            $root.com.triforge.protocol.proto.DirectionComponentProto.encode(message.direction, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
                        if (message.tank != null && Object.hasOwnProperty.call(message, "tank"))
                            $root.com.triforge.protocol.proto.TankComponentProto.encode(message.tank, writer.uint32(/* id 5, wireType 2 =*/42).fork(), q + 1).ldelim();
                        if (message.bullet != null && Object.hasOwnProperty.call(message, "bullet"))
                            $root.com.triforge.protocol.proto.BulletComponentProto.encode(message.bullet, writer.uint32(/* id 6, wireType 2 =*/50).fork(), q + 1).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified EntityProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.EntityProto.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @static
                     * @param {com.triforge.protocol.proto.IEntityProto} message EntityProto message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    EntityProto.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes an EntityProto message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.EntityProto} EntityProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    EntityProto.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.EntityProto();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.entityId = reader.uint64();
                                    break;
                                }
                            case 2: {
                                    message.player = $root.com.triforge.protocol.proto.PlayerComponentProto.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 3: {
                                    message.position = $root.com.triforge.protocol.proto.PositionComponentProto.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 4: {
                                    message.direction = $root.com.triforge.protocol.proto.DirectionComponentProto.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 5: {
                                    message.tank = $root.com.triforge.protocol.proto.TankComponentProto.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 6: {
                                    message.bullet = $root.com.triforge.protocol.proto.BulletComponentProto.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes an EntityProto message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.EntityProto} EntityProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    EntityProto.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies an EntityProto message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    EntityProto.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.entityId != null && Object.hasOwnProperty.call(message, "entityId"))
                            if (!$util.isInteger(message.entityId) && !(message.entityId && $util.isInteger(message.entityId.low) && $util.isInteger(message.entityId.high)))
                                return "entityId: integer|Long expected";
                        if (message.player != null && Object.hasOwnProperty.call(message, "player")) {
                            let error = $root.com.triforge.protocol.proto.PlayerComponentProto.verify(message.player, long + 1);
                            if (error)
                                return "player." + error;
                        }
                        if (message.position != null && Object.hasOwnProperty.call(message, "position")) {
                            let error = $root.com.triforge.protocol.proto.PositionComponentProto.verify(message.position, long + 1);
                            if (error)
                                return "position." + error;
                        }
                        if (message.direction != null && Object.hasOwnProperty.call(message, "direction")) {
                            let error = $root.com.triforge.protocol.proto.DirectionComponentProto.verify(message.direction, long + 1);
                            if (error)
                                return "direction." + error;
                        }
                        if (message.tank != null && Object.hasOwnProperty.call(message, "tank")) {
                            let error = $root.com.triforge.protocol.proto.TankComponentProto.verify(message.tank, long + 1);
                            if (error)
                                return "tank." + error;
                        }
                        if (message.bullet != null && Object.hasOwnProperty.call(message, "bullet")) {
                            let error = $root.com.triforge.protocol.proto.BulletComponentProto.verify(message.bullet, long + 1);
                            if (error)
                                return "bullet." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates an EntityProto message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.EntityProto} EntityProto
                     */
                    EntityProto.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.EntityProto)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.EntityProto: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.EntityProto();
                        if (object.entityId != null)
                            if ($util.Long)
                                message.entityId = $util.Long.fromValue(object.entityId, true);
                            else if (typeof object.entityId === "string")
                                message.entityId = parseInt(object.entityId, 10);
                            else if (typeof object.entityId === "number")
                                message.entityId = object.entityId;
                            else if (typeof object.entityId === "object")
                                message.entityId = new $util.LongBits(object.entityId.low >>> 0, object.entityId.high >>> 0).toNumber(true);
                        if (object.player != null) {
                            if (!$util.isObject(object.player))
                                throw TypeError(".com.triforge.protocol.proto.EntityProto.player: object expected");
                            message.player = $root.com.triforge.protocol.proto.PlayerComponentProto.fromObject(object.player, long + 1);
                        }
                        if (object.position != null) {
                            if (!$util.isObject(object.position))
                                throw TypeError(".com.triforge.protocol.proto.EntityProto.position: object expected");
                            message.position = $root.com.triforge.protocol.proto.PositionComponentProto.fromObject(object.position, long + 1);
                        }
                        if (object.direction != null) {
                            if (!$util.isObject(object.direction))
                                throw TypeError(".com.triforge.protocol.proto.EntityProto.direction: object expected");
                            message.direction = $root.com.triforge.protocol.proto.DirectionComponentProto.fromObject(object.direction, long + 1);
                        }
                        if (object.tank != null) {
                            if (!$util.isObject(object.tank))
                                throw TypeError(".com.triforge.protocol.proto.EntityProto.tank: object expected");
                            message.tank = $root.com.triforge.protocol.proto.TankComponentProto.fromObject(object.tank, long + 1);
                        }
                        if (object.bullet != null) {
                            if (!$util.isObject(object.bullet))
                                throw TypeError(".com.triforge.protocol.proto.EntityProto.bullet: object expected");
                            message.bullet = $root.com.triforge.protocol.proto.BulletComponentProto.fromObject(object.bullet, long + 1);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from an EntityProto message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @static
                     * @param {com.triforge.protocol.proto.EntityProto} message EntityProto
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    EntityProto.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.entityId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.entityId = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            object.player = null;
                            object.position = null;
                            object.direction = null;
                            object.tank = null;
                            object.bullet = null;
                        }
                        if (message.entityId != null && Object.hasOwnProperty.call(message, "entityId"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.entityId = typeof message.entityId === "number" ? BigInt(message.entityId) : $util.Long.fromBits(message.entityId.low >>> 0, message.entityId.high >>> 0, true).toBigInt();
                            else if (typeof message.entityId === "number")
                                object.entityId = options.longs === String ? String(message.entityId) : message.entityId;
                            else
                                object.entityId = options.longs === String ? $util.Long.prototype.toString.call(message.entityId) : options.longs === Number ? new $util.LongBits(message.entityId.low >>> 0, message.entityId.high >>> 0).toNumber(true) : message.entityId;
                        if (message.player != null && Object.hasOwnProperty.call(message, "player"))
                            object.player = $root.com.triforge.protocol.proto.PlayerComponentProto.toObject(message.player, options, q + 1);
                        if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                            object.position = $root.com.triforge.protocol.proto.PositionComponentProto.toObject(message.position, options, q + 1);
                        if (message.direction != null && Object.hasOwnProperty.call(message, "direction"))
                            object.direction = $root.com.triforge.protocol.proto.DirectionComponentProto.toObject(message.direction, options, q + 1);
                        if (message.tank != null && Object.hasOwnProperty.call(message, "tank"))
                            object.tank = $root.com.triforge.protocol.proto.TankComponentProto.toObject(message.tank, options, q + 1);
                        if (message.bullet != null && Object.hasOwnProperty.call(message, "bullet"))
                            object.bullet = $root.com.triforge.protocol.proto.BulletComponentProto.toObject(message.bullet, options, q + 1);
                        return object;
                    };

                    /**
                     * Converts this EntityProto to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    EntityProto.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for EntityProto
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.EntityProto
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    EntityProto.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.EntityProto";
                    };

                    return EntityProto;
                })();

                proto.FullSnapshot = (function() {

                    /**
                     * Properties of a FullSnapshot.
                     * @memberof com.triforge.protocol.proto
                     * @interface IFullSnapshot
                     * @property {number|Long|null} [tick] FullSnapshot tick
                     * @property {Array.<com.triforge.protocol.proto.IEntityProto>|null} [entities] FullSnapshot entities
                     * @property {com.triforge.protocol.proto.IFogSnapshot|null} [fog] FullSnapshot fog
                     */

                    /**
                     * Constructs a new FullSnapshot.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a FullSnapshot.
                     * @implements IFullSnapshot
                     * @constructor
                     * @param {com.triforge.protocol.proto.IFullSnapshot=} [properties] Properties to set
                     */
                    function FullSnapshot(properties) {
                        this.entities = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * FullSnapshot tick.
                     * @member {number|Long} tick
                     * @memberof com.triforge.protocol.proto.FullSnapshot
                     * @instance
                     */
                    FullSnapshot.prototype.tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * FullSnapshot entities.
                     * @member {Array.<com.triforge.protocol.proto.IEntityProto>} entities
                     * @memberof com.triforge.protocol.proto.FullSnapshot
                     * @instance
                     */
                    FullSnapshot.prototype.entities = $util.emptyArray;

                    /**
                     * FullSnapshot fog.
                     * @member {com.triforge.protocol.proto.IFogSnapshot|null|undefined} fog
                     * @memberof com.triforge.protocol.proto.FullSnapshot
                     * @instance
                     */
                    FullSnapshot.prototype.fog = null;

                    /**
                     * Creates a new FullSnapshot instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.FullSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IFullSnapshot=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.FullSnapshot} FullSnapshot instance
                     */
                    FullSnapshot.create = function create(properties) {
                        return new FullSnapshot(properties);
                    };

                    /**
                     * Encodes the specified FullSnapshot message. Does not implicitly {@link com.triforge.protocol.proto.FullSnapshot.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.FullSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IFullSnapshot} message FullSnapshot message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    FullSnapshot.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.tick);
                        if (message.entities != null && message.entities.length)
                            for (let i = 0; i < message.entities.length; ++i)
                                $root.com.triforge.protocol.proto.EntityProto.encode(message.entities[i], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                        if (message.fog != null && Object.hasOwnProperty.call(message, "fog"))
                            $root.com.triforge.protocol.proto.FogSnapshot.encode(message.fog, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified FullSnapshot message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.FullSnapshot.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.FullSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IFullSnapshot} message FullSnapshot message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    FullSnapshot.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a FullSnapshot message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.FullSnapshot
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.FullSnapshot} FullSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    FullSnapshot.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.FullSnapshot();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.tick = reader.uint64();
                                    break;
                                }
                            case 2: {
                                    if (!(message.entities && message.entities.length))
                                        message.entities = [];
                                    message.entities.push($root.com.triforge.protocol.proto.EntityProto.decode(reader, reader.uint32(), undefined, long + 1));
                                    break;
                                }
                            case 3: {
                                    message.fog = $root.com.triforge.protocol.proto.FogSnapshot.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a FullSnapshot message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.FullSnapshot
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.FullSnapshot} FullSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    FullSnapshot.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a FullSnapshot message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.FullSnapshot
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    FullSnapshot.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                            if (!$util.isInteger(message.tick) && !(message.tick && $util.isInteger(message.tick.low) && $util.isInteger(message.tick.high)))
                                return "tick: integer|Long expected";
                        if (message.entities != null && Object.hasOwnProperty.call(message, "entities")) {
                            if (!Array.isArray(message.entities))
                                return "entities: array expected";
                            for (let i = 0; i < message.entities.length; ++i) {
                                let error = $root.com.triforge.protocol.proto.EntityProto.verify(message.entities[i], long + 1);
                                if (error)
                                    return "entities." + error;
                            }
                        }
                        if (message.fog != null && Object.hasOwnProperty.call(message, "fog")) {
                            let error = $root.com.triforge.protocol.proto.FogSnapshot.verify(message.fog, long + 1);
                            if (error)
                                return "fog." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a FullSnapshot message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.FullSnapshot
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.FullSnapshot} FullSnapshot
                     */
                    FullSnapshot.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.FullSnapshot)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.FullSnapshot: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.FullSnapshot();
                        if (object.tick != null)
                            if ($util.Long)
                                message.tick = $util.Long.fromValue(object.tick, true);
                            else if (typeof object.tick === "string")
                                message.tick = parseInt(object.tick, 10);
                            else if (typeof object.tick === "number")
                                message.tick = object.tick;
                            else if (typeof object.tick === "object")
                                message.tick = new $util.LongBits(object.tick.low >>> 0, object.tick.high >>> 0).toNumber(true);
                        if (object.entities) {
                            if (!Array.isArray(object.entities))
                                throw TypeError(".com.triforge.protocol.proto.FullSnapshot.entities: array expected");
                            message.entities = [];
                            for (let i = 0; i < object.entities.length; ++i) {
                                if (!$util.isObject(object.entities[i]))
                                    throw TypeError(".com.triforge.protocol.proto.FullSnapshot.entities: object expected");
                                message.entities[i] = $root.com.triforge.protocol.proto.EntityProto.fromObject(object.entities[i], long + 1);
                            }
                        }
                        if (object.fog != null) {
                            if (!$util.isObject(object.fog))
                                throw TypeError(".com.triforge.protocol.proto.FullSnapshot.fog: object expected");
                            message.fog = $root.com.triforge.protocol.proto.FogSnapshot.fromObject(object.fog, long + 1);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a FullSnapshot message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.FullSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.FullSnapshot} message FullSnapshot
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    FullSnapshot.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.entities = [];
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.tick = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.tick = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            object.fog = null;
                        }
                        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.tick = typeof message.tick === "number" ? BigInt(message.tick) : $util.Long.fromBits(message.tick.low >>> 0, message.tick.high >>> 0, true).toBigInt();
                            else if (typeof message.tick === "number")
                                object.tick = options.longs === String ? String(message.tick) : message.tick;
                            else
                                object.tick = options.longs === String ? $util.Long.prototype.toString.call(message.tick) : options.longs === Number ? new $util.LongBits(message.tick.low >>> 0, message.tick.high >>> 0).toNumber(true) : message.tick;
                        if (message.entities && message.entities.length) {
                            object.entities = [];
                            for (let j = 0; j < message.entities.length; ++j)
                                object.entities[j] = $root.com.triforge.protocol.proto.EntityProto.toObject(message.entities[j], options, q + 1);
                        }
                        if (message.fog != null && Object.hasOwnProperty.call(message, "fog"))
                            object.fog = $root.com.triforge.protocol.proto.FogSnapshot.toObject(message.fog, options, q + 1);
                        return object;
                    };

                    /**
                     * Converts this FullSnapshot to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.FullSnapshot
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    FullSnapshot.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for FullSnapshot
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.FullSnapshot
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    FullSnapshot.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.FullSnapshot";
                    };

                    return FullSnapshot;
                })();

                proto.DeltaSnapshot = (function() {

                    /**
                     * Properties of a DeltaSnapshot.
                     * @memberof com.triforge.protocol.proto
                     * @interface IDeltaSnapshot
                     * @property {number|Long|null} [tick] DeltaSnapshot tick
                     * @property {Array.<com.triforge.protocol.proto.IEntityProto>|null} [updatedEntities] DeltaSnapshot updatedEntities
                     * @property {Array.<number|Long>|null} [removedEntityIds] DeltaSnapshot removedEntityIds
                     * @property {Array.<com.triforge.protocol.proto.ITileChange>|null} [tileChanges] DeltaSnapshot tileChanges
                     * @property {com.triforge.protocol.proto.IFogSnapshot|null} [fog] DeltaSnapshot fog
                     */

                    /**
                     * Constructs a new DeltaSnapshot.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a DeltaSnapshot.
                     * @implements IDeltaSnapshot
                     * @constructor
                     * @param {com.triforge.protocol.proto.IDeltaSnapshot=} [properties] Properties to set
                     */
                    function DeltaSnapshot(properties) {
                        this.updatedEntities = [];
                        this.removedEntityIds = [];
                        this.tileChanges = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * DeltaSnapshot tick.
                     * @member {number|Long} tick
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @instance
                     */
                    DeltaSnapshot.prototype.tick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * DeltaSnapshot updatedEntities.
                     * @member {Array.<com.triforge.protocol.proto.IEntityProto>} updatedEntities
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @instance
                     */
                    DeltaSnapshot.prototype.updatedEntities = $util.emptyArray;

                    /**
                     * DeltaSnapshot removedEntityIds.
                     * @member {Array.<number|Long>} removedEntityIds
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @instance
                     */
                    DeltaSnapshot.prototype.removedEntityIds = $util.emptyArray;

                    /**
                     * DeltaSnapshot tileChanges.
                     * @member {Array.<com.triforge.protocol.proto.ITileChange>} tileChanges
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @instance
                     */
                    DeltaSnapshot.prototype.tileChanges = $util.emptyArray;

                    /**
                     * DeltaSnapshot fog.
                     * @member {com.triforge.protocol.proto.IFogSnapshot|null|undefined} fog
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @instance
                     */
                    DeltaSnapshot.prototype.fog = null;

                    /**
                     * Creates a new DeltaSnapshot instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IDeltaSnapshot=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.DeltaSnapshot} DeltaSnapshot instance
                     */
                    DeltaSnapshot.create = function create(properties) {
                        return new DeltaSnapshot(properties);
                    };

                    /**
                     * Encodes the specified DeltaSnapshot message. Does not implicitly {@link com.triforge.protocol.proto.DeltaSnapshot.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IDeltaSnapshot} message DeltaSnapshot message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DeltaSnapshot.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.tick);
                        if (message.updatedEntities != null && message.updatedEntities.length)
                            for (let i = 0; i < message.updatedEntities.length; ++i)
                                $root.com.triforge.protocol.proto.EntityProto.encode(message.updatedEntities[i], writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                        if (message.removedEntityIds != null && message.removedEntityIds.length) {
                            writer.uint32(/* id 3, wireType 2 =*/26).fork();
                            for (let i = 0; i < message.removedEntityIds.length; ++i)
                                writer.uint64(message.removedEntityIds[i]);
                            writer.ldelim();
                        }
                        if (message.tileChanges != null && message.tileChanges.length)
                            for (let i = 0; i < message.tileChanges.length; ++i)
                                $root.com.triforge.protocol.proto.TileChange.encode(message.tileChanges[i], writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
                        if (message.fog != null && Object.hasOwnProperty.call(message, "fog"))
                            $root.com.triforge.protocol.proto.FogSnapshot.encode(message.fog, writer.uint32(/* id 5, wireType 2 =*/42).fork(), q + 1).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified DeltaSnapshot message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.DeltaSnapshot.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IDeltaSnapshot} message DeltaSnapshot message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    DeltaSnapshot.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a DeltaSnapshot message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.DeltaSnapshot} DeltaSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DeltaSnapshot.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.DeltaSnapshot();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.tick = reader.uint64();
                                    break;
                                }
                            case 2: {
                                    if (!(message.updatedEntities && message.updatedEntities.length))
                                        message.updatedEntities = [];
                                    message.updatedEntities.push($root.com.triforge.protocol.proto.EntityProto.decode(reader, reader.uint32(), undefined, long + 1));
                                    break;
                                }
                            case 3: {
                                    if (!(message.removedEntityIds && message.removedEntityIds.length))
                                        message.removedEntityIds = [];
                                    if ((tag & 7) === 2) {
                                        let end2 = reader.uint32() + reader.pos;
                                        while (reader.pos < end2)
                                            message.removedEntityIds.push(reader.uint64());
                                    } else
                                        message.removedEntityIds.push(reader.uint64());
                                    break;
                                }
                            case 4: {
                                    if (!(message.tileChanges && message.tileChanges.length))
                                        message.tileChanges = [];
                                    message.tileChanges.push($root.com.triforge.protocol.proto.TileChange.decode(reader, reader.uint32(), undefined, long + 1));
                                    break;
                                }
                            case 5: {
                                    message.fog = $root.com.triforge.protocol.proto.FogSnapshot.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a DeltaSnapshot message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.DeltaSnapshot} DeltaSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    DeltaSnapshot.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a DeltaSnapshot message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    DeltaSnapshot.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                            if (!$util.isInteger(message.tick) && !(message.tick && $util.isInteger(message.tick.low) && $util.isInteger(message.tick.high)))
                                return "tick: integer|Long expected";
                        if (message.updatedEntities != null && Object.hasOwnProperty.call(message, "updatedEntities")) {
                            if (!Array.isArray(message.updatedEntities))
                                return "updatedEntities: array expected";
                            for (let i = 0; i < message.updatedEntities.length; ++i) {
                                let error = $root.com.triforge.protocol.proto.EntityProto.verify(message.updatedEntities[i], long + 1);
                                if (error)
                                    return "updatedEntities." + error;
                            }
                        }
                        if (message.removedEntityIds != null && Object.hasOwnProperty.call(message, "removedEntityIds")) {
                            if (!Array.isArray(message.removedEntityIds))
                                return "removedEntityIds: array expected";
                            for (let i = 0; i < message.removedEntityIds.length; ++i)
                                if (!$util.isInteger(message.removedEntityIds[i]) && !(message.removedEntityIds[i] && $util.isInteger(message.removedEntityIds[i].low) && $util.isInteger(message.removedEntityIds[i].high)))
                                    return "removedEntityIds: integer|Long[] expected";
                        }
                        if (message.tileChanges != null && Object.hasOwnProperty.call(message, "tileChanges")) {
                            if (!Array.isArray(message.tileChanges))
                                return "tileChanges: array expected";
                            for (let i = 0; i < message.tileChanges.length; ++i) {
                                let error = $root.com.triforge.protocol.proto.TileChange.verify(message.tileChanges[i], long + 1);
                                if (error)
                                    return "tileChanges." + error;
                            }
                        }
                        if (message.fog != null && Object.hasOwnProperty.call(message, "fog")) {
                            let error = $root.com.triforge.protocol.proto.FogSnapshot.verify(message.fog, long + 1);
                            if (error)
                                return "fog." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a DeltaSnapshot message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.DeltaSnapshot} DeltaSnapshot
                     */
                    DeltaSnapshot.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.DeltaSnapshot)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.DeltaSnapshot: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.DeltaSnapshot();
                        if (object.tick != null)
                            if ($util.Long)
                                message.tick = $util.Long.fromValue(object.tick, true);
                            else if (typeof object.tick === "string")
                                message.tick = parseInt(object.tick, 10);
                            else if (typeof object.tick === "number")
                                message.tick = object.tick;
                            else if (typeof object.tick === "object")
                                message.tick = new $util.LongBits(object.tick.low >>> 0, object.tick.high >>> 0).toNumber(true);
                        if (object.updatedEntities) {
                            if (!Array.isArray(object.updatedEntities))
                                throw TypeError(".com.triforge.protocol.proto.DeltaSnapshot.updatedEntities: array expected");
                            message.updatedEntities = [];
                            for (let i = 0; i < object.updatedEntities.length; ++i) {
                                if (!$util.isObject(object.updatedEntities[i]))
                                    throw TypeError(".com.triforge.protocol.proto.DeltaSnapshot.updatedEntities: object expected");
                                message.updatedEntities[i] = $root.com.triforge.protocol.proto.EntityProto.fromObject(object.updatedEntities[i], long + 1);
                            }
                        }
                        if (object.removedEntityIds) {
                            if (!Array.isArray(object.removedEntityIds))
                                throw TypeError(".com.triforge.protocol.proto.DeltaSnapshot.removedEntityIds: array expected");
                            message.removedEntityIds = [];
                            for (let i = 0; i < object.removedEntityIds.length; ++i)
                                if ($util.Long)
                                    message.removedEntityIds[i] = $util.Long.fromValue(object.removedEntityIds[i], true);
                                else if (typeof object.removedEntityIds[i] === "string")
                                    message.removedEntityIds[i] = parseInt(object.removedEntityIds[i], 10);
                                else if (typeof object.removedEntityIds[i] === "number")
                                    message.removedEntityIds[i] = object.removedEntityIds[i];
                                else if (typeof object.removedEntityIds[i] === "object")
                                    message.removedEntityIds[i] = new $util.LongBits(object.removedEntityIds[i].low >>> 0, object.removedEntityIds[i].high >>> 0).toNumber(true);
                        }
                        if (object.tileChanges) {
                            if (!Array.isArray(object.tileChanges))
                                throw TypeError(".com.triforge.protocol.proto.DeltaSnapshot.tileChanges: array expected");
                            message.tileChanges = [];
                            for (let i = 0; i < object.tileChanges.length; ++i) {
                                if (!$util.isObject(object.tileChanges[i]))
                                    throw TypeError(".com.triforge.protocol.proto.DeltaSnapshot.tileChanges: object expected");
                                message.tileChanges[i] = $root.com.triforge.protocol.proto.TileChange.fromObject(object.tileChanges[i], long + 1);
                            }
                        }
                        if (object.fog != null) {
                            if (!$util.isObject(object.fog))
                                throw TypeError(".com.triforge.protocol.proto.DeltaSnapshot.fog: object expected");
                            message.fog = $root.com.triforge.protocol.proto.FogSnapshot.fromObject(object.fog, long + 1);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a DeltaSnapshot message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.DeltaSnapshot} message DeltaSnapshot
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    DeltaSnapshot.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.arrays || options.defaults) {
                            object.updatedEntities = [];
                            object.removedEntityIds = [];
                            object.tileChanges = [];
                        }
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.tick = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.tick = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            object.fog = null;
                        }
                        if (message.tick != null && Object.hasOwnProperty.call(message, "tick"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.tick = typeof message.tick === "number" ? BigInt(message.tick) : $util.Long.fromBits(message.tick.low >>> 0, message.tick.high >>> 0, true).toBigInt();
                            else if (typeof message.tick === "number")
                                object.tick = options.longs === String ? String(message.tick) : message.tick;
                            else
                                object.tick = options.longs === String ? $util.Long.prototype.toString.call(message.tick) : options.longs === Number ? new $util.LongBits(message.tick.low >>> 0, message.tick.high >>> 0).toNumber(true) : message.tick;
                        if (message.updatedEntities && message.updatedEntities.length) {
                            object.updatedEntities = [];
                            for (let j = 0; j < message.updatedEntities.length; ++j)
                                object.updatedEntities[j] = $root.com.triforge.protocol.proto.EntityProto.toObject(message.updatedEntities[j], options, q + 1);
                        }
                        if (message.removedEntityIds && message.removedEntityIds.length) {
                            object.removedEntityIds = [];
                            for (let j = 0; j < message.removedEntityIds.length; ++j)
                                if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                    object.removedEntityIds[j] = typeof message.removedEntityIds[j] === "number" ? BigInt(message.removedEntityIds[j]) : $util.Long.fromBits(message.removedEntityIds[j].low >>> 0, message.removedEntityIds[j].high >>> 0, true).toBigInt();
                                else if (typeof message.removedEntityIds[j] === "number")
                                    object.removedEntityIds[j] = options.longs === String ? String(message.removedEntityIds[j]) : message.removedEntityIds[j];
                                else
                                    object.removedEntityIds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.removedEntityIds[j]) : options.longs === Number ? new $util.LongBits(message.removedEntityIds[j].low >>> 0, message.removedEntityIds[j].high >>> 0).toNumber(true) : message.removedEntityIds[j];
                        }
                        if (message.tileChanges && message.tileChanges.length) {
                            object.tileChanges = [];
                            for (let j = 0; j < message.tileChanges.length; ++j)
                                object.tileChanges[j] = $root.com.triforge.protocol.proto.TileChange.toObject(message.tileChanges[j], options, q + 1);
                        }
                        if (message.fog != null && Object.hasOwnProperty.call(message, "fog"))
                            object.fog = $root.com.triforge.protocol.proto.FogSnapshot.toObject(message.fog, options, q + 1);
                        return object;
                    };

                    /**
                     * Converts this DeltaSnapshot to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    DeltaSnapshot.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for DeltaSnapshot
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.DeltaSnapshot
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    DeltaSnapshot.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.DeltaSnapshot";
                    };

                    return DeltaSnapshot;
                })();

                proto.InputCommand = (function() {

                    /**
                     * Properties of an InputCommand.
                     * @memberof com.triforge.protocol.proto
                     * @interface IInputCommand
                     * @property {boolean|null} [moveUp] InputCommand moveUp
                     * @property {boolean|null} [moveDown] InputCommand moveDown
                     * @property {boolean|null} [moveLeft] InputCommand moveLeft
                     * @property {boolean|null} [moveRight] InputCommand moveRight
                     * @property {boolean|null} [shoot] InputCommand shoot
                     */

                    /**
                     * Constructs a new InputCommand.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents an InputCommand.
                     * @implements IInputCommand
                     * @constructor
                     * @param {com.triforge.protocol.proto.IInputCommand=} [properties] Properties to set
                     */
                    function InputCommand(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * InputCommand moveUp.
                     * @member {boolean} moveUp
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @instance
                     */
                    InputCommand.prototype.moveUp = false;

                    /**
                     * InputCommand moveDown.
                     * @member {boolean} moveDown
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @instance
                     */
                    InputCommand.prototype.moveDown = false;

                    /**
                     * InputCommand moveLeft.
                     * @member {boolean} moveLeft
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @instance
                     */
                    InputCommand.prototype.moveLeft = false;

                    /**
                     * InputCommand moveRight.
                     * @member {boolean} moveRight
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @instance
                     */
                    InputCommand.prototype.moveRight = false;

                    /**
                     * InputCommand shoot.
                     * @member {boolean} shoot
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @instance
                     */
                    InputCommand.prototype.shoot = false;

                    /**
                     * Creates a new InputCommand instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @static
                     * @param {com.triforge.protocol.proto.IInputCommand=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.InputCommand} InputCommand instance
                     */
                    InputCommand.create = function create(properties) {
                        return new InputCommand(properties);
                    };

                    /**
                     * Encodes the specified InputCommand message. Does not implicitly {@link com.triforge.protocol.proto.InputCommand.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @static
                     * @param {com.triforge.protocol.proto.IInputCommand} message InputCommand message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    InputCommand.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.moveUp != null && Object.hasOwnProperty.call(message, "moveUp"))
                            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.moveUp);
                        if (message.moveDown != null && Object.hasOwnProperty.call(message, "moveDown"))
                            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.moveDown);
                        if (message.moveLeft != null && Object.hasOwnProperty.call(message, "moveLeft"))
                            writer.uint32(/* id 3, wireType 0 =*/24).bool(message.moveLeft);
                        if (message.moveRight != null && Object.hasOwnProperty.call(message, "moveRight"))
                            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.moveRight);
                        if (message.shoot != null && Object.hasOwnProperty.call(message, "shoot"))
                            writer.uint32(/* id 5, wireType 0 =*/40).bool(message.shoot);
                        return writer;
                    };

                    /**
                     * Encodes the specified InputCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.InputCommand.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @static
                     * @param {com.triforge.protocol.proto.IInputCommand} message InputCommand message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    InputCommand.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes an InputCommand message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.InputCommand} InputCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    InputCommand.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.InputCommand();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.moveUp = reader.bool();
                                    break;
                                }
                            case 2: {
                                    message.moveDown = reader.bool();
                                    break;
                                }
                            case 3: {
                                    message.moveLeft = reader.bool();
                                    break;
                                }
                            case 4: {
                                    message.moveRight = reader.bool();
                                    break;
                                }
                            case 5: {
                                    message.shoot = reader.bool();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes an InputCommand message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.InputCommand} InputCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    InputCommand.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies an InputCommand message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    InputCommand.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.moveUp != null && Object.hasOwnProperty.call(message, "moveUp"))
                            if (typeof message.moveUp !== "boolean")
                                return "moveUp: boolean expected";
                        if (message.moveDown != null && Object.hasOwnProperty.call(message, "moveDown"))
                            if (typeof message.moveDown !== "boolean")
                                return "moveDown: boolean expected";
                        if (message.moveLeft != null && Object.hasOwnProperty.call(message, "moveLeft"))
                            if (typeof message.moveLeft !== "boolean")
                                return "moveLeft: boolean expected";
                        if (message.moveRight != null && Object.hasOwnProperty.call(message, "moveRight"))
                            if (typeof message.moveRight !== "boolean")
                                return "moveRight: boolean expected";
                        if (message.shoot != null && Object.hasOwnProperty.call(message, "shoot"))
                            if (typeof message.shoot !== "boolean")
                                return "shoot: boolean expected";
                        return null;
                    };

                    /**
                     * Creates an InputCommand message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.InputCommand} InputCommand
                     */
                    InputCommand.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.InputCommand)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.InputCommand: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.InputCommand();
                        if (object.moveUp != null)
                            message.moveUp = Boolean(object.moveUp);
                        if (object.moveDown != null)
                            message.moveDown = Boolean(object.moveDown);
                        if (object.moveLeft != null)
                            message.moveLeft = Boolean(object.moveLeft);
                        if (object.moveRight != null)
                            message.moveRight = Boolean(object.moveRight);
                        if (object.shoot != null)
                            message.shoot = Boolean(object.shoot);
                        return message;
                    };

                    /**
                     * Creates a plain object from an InputCommand message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @static
                     * @param {com.triforge.protocol.proto.InputCommand} message InputCommand
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    InputCommand.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            object.moveUp = false;
                            object.moveDown = false;
                            object.moveLeft = false;
                            object.moveRight = false;
                            object.shoot = false;
                        }
                        if (message.moveUp != null && Object.hasOwnProperty.call(message, "moveUp"))
                            object.moveUp = message.moveUp;
                        if (message.moveDown != null && Object.hasOwnProperty.call(message, "moveDown"))
                            object.moveDown = message.moveDown;
                        if (message.moveLeft != null && Object.hasOwnProperty.call(message, "moveLeft"))
                            object.moveLeft = message.moveLeft;
                        if (message.moveRight != null && Object.hasOwnProperty.call(message, "moveRight"))
                            object.moveRight = message.moveRight;
                        if (message.shoot != null && Object.hasOwnProperty.call(message, "shoot"))
                            object.shoot = message.shoot;
                        return object;
                    };

                    /**
                     * Converts this InputCommand to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    InputCommand.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for InputCommand
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.InputCommand
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    InputCommand.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.InputCommand";
                    };

                    return InputCommand;
                })();

                proto.LobbyPlayer = (function() {

                    /**
                     * Properties of a LobbyPlayer.
                     * @memberof com.triforge.protocol.proto
                     * @interface ILobbyPlayer
                     * @property {number|Long|null} [playerId] LobbyPlayer playerId
                     * @property {string|null} [displayName] LobbyPlayer displayName
                     * @property {com.triforge.protocol.proto.Team|null} [team] LobbyPlayer team
                     * @property {com.triforge.protocol.proto.SpawnRegion|null} [spawnRegion] LobbyPlayer spawnRegion
                     * @property {boolean|null} [ready] LobbyPlayer ready
                     * @property {boolean|null} [isHost] LobbyPlayer isHost
                     * @property {boolean|null} [isTeamCaptain] LobbyPlayer isTeamCaptain
                     */

                    /**
                     * Constructs a new LobbyPlayer.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a LobbyPlayer.
                     * @implements ILobbyPlayer
                     * @constructor
                     * @param {com.triforge.protocol.proto.ILobbyPlayer=} [properties] Properties to set
                     */
                    function LobbyPlayer(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * LobbyPlayer playerId.
                     * @member {number|Long} playerId
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @instance
                     */
                    LobbyPlayer.prototype.playerId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * LobbyPlayer displayName.
                     * @member {string} displayName
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @instance
                     */
                    LobbyPlayer.prototype.displayName = "";

                    /**
                     * LobbyPlayer team.
                     * @member {com.triforge.protocol.proto.Team} team
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @instance
                     */
                    LobbyPlayer.prototype.team = 0;

                    /**
                     * LobbyPlayer spawnRegion.
                     * @member {com.triforge.protocol.proto.SpawnRegion} spawnRegion
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @instance
                     */
                    LobbyPlayer.prototype.spawnRegion = 0;

                    /**
                     * LobbyPlayer ready.
                     * @member {boolean} ready
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @instance
                     */
                    LobbyPlayer.prototype.ready = false;

                    /**
                     * LobbyPlayer isHost.
                     * @member {boolean} isHost
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @instance
                     */
                    LobbyPlayer.prototype.isHost = false;

                    /**
                     * LobbyPlayer isTeamCaptain.
                     * @member {boolean} isTeamCaptain
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @instance
                     */
                    LobbyPlayer.prototype.isTeamCaptain = false;

                    /**
                     * Creates a new LobbyPlayer instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @static
                     * @param {com.triforge.protocol.proto.ILobbyPlayer=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.LobbyPlayer} LobbyPlayer instance
                     */
                    LobbyPlayer.create = function create(properties) {
                        return new LobbyPlayer(properties);
                    };

                    /**
                     * Encodes the specified LobbyPlayer message. Does not implicitly {@link com.triforge.protocol.proto.LobbyPlayer.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @static
                     * @param {com.triforge.protocol.proto.ILobbyPlayer} message LobbyPlayer message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LobbyPlayer.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.playerId);
                        if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.displayName);
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.team);
                        if (message.spawnRegion != null && Object.hasOwnProperty.call(message, "spawnRegion"))
                            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.spawnRegion);
                        if (message.ready != null && Object.hasOwnProperty.call(message, "ready"))
                            writer.uint32(/* id 5, wireType 0 =*/40).bool(message.ready);
                        if (message.isHost != null && Object.hasOwnProperty.call(message, "isHost"))
                            writer.uint32(/* id 6, wireType 0 =*/48).bool(message.isHost);
                        if (message.isTeamCaptain != null && Object.hasOwnProperty.call(message, "isTeamCaptain"))
                            writer.uint32(/* id 7, wireType 0 =*/56).bool(message.isTeamCaptain);
                        return writer;
                    };

                    /**
                     * Encodes the specified LobbyPlayer message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.LobbyPlayer.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @static
                     * @param {com.triforge.protocol.proto.ILobbyPlayer} message LobbyPlayer message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LobbyPlayer.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a LobbyPlayer message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.LobbyPlayer} LobbyPlayer
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LobbyPlayer.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.LobbyPlayer();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.playerId = reader.uint64();
                                    break;
                                }
                            case 2: {
                                    message.displayName = reader.string();
                                    break;
                                }
                            case 3: {
                                    message.team = reader.int32();
                                    break;
                                }
                            case 4: {
                                    message.spawnRegion = reader.int32();
                                    break;
                                }
                            case 5: {
                                    message.ready = reader.bool();
                                    break;
                                }
                            case 6: {
                                    message.isHost = reader.bool();
                                    break;
                                }
                            case 7: {
                                    message.isTeamCaptain = reader.bool();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a LobbyPlayer message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.LobbyPlayer} LobbyPlayer
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LobbyPlayer.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a LobbyPlayer message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    LobbyPlayer.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            if (!$util.isInteger(message.playerId) && !(message.playerId && $util.isInteger(message.playerId.low) && $util.isInteger(message.playerId.high)))
                                return "playerId: integer|Long expected";
                        if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                            if (!$util.isString(message.displayName))
                                return "displayName: string expected";
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            switch (message.team) {
                            default:
                                return "team: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                                break;
                            }
                        if (message.spawnRegion != null && Object.hasOwnProperty.call(message, "spawnRegion"))
                            switch (message.spawnRegion) {
                            default:
                                return "spawnRegion: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                                break;
                            }
                        if (message.ready != null && Object.hasOwnProperty.call(message, "ready"))
                            if (typeof message.ready !== "boolean")
                                return "ready: boolean expected";
                        if (message.isHost != null && Object.hasOwnProperty.call(message, "isHost"))
                            if (typeof message.isHost !== "boolean")
                                return "isHost: boolean expected";
                        if (message.isTeamCaptain != null && Object.hasOwnProperty.call(message, "isTeamCaptain"))
                            if (typeof message.isTeamCaptain !== "boolean")
                                return "isTeamCaptain: boolean expected";
                        return null;
                    };

                    /**
                     * Creates a LobbyPlayer message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.LobbyPlayer} LobbyPlayer
                     */
                    LobbyPlayer.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.LobbyPlayer)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.LobbyPlayer: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.LobbyPlayer();
                        if (object.playerId != null)
                            if ($util.Long)
                                message.playerId = $util.Long.fromValue(object.playerId, true);
                            else if (typeof object.playerId === "string")
                                message.playerId = parseInt(object.playerId, 10);
                            else if (typeof object.playerId === "number")
                                message.playerId = object.playerId;
                            else if (typeof object.playerId === "object")
                                message.playerId = new $util.LongBits(object.playerId.low >>> 0, object.playerId.high >>> 0).toNumber(true);
                        if (object.displayName != null)
                            message.displayName = String(object.displayName);
                        switch (object.team) {
                        default:
                            if (typeof object.team === "number") {
                                message.team = object.team;
                                break;
                            }
                            break;
                        case "TEAM_NONE":
                        case 0:
                            message.team = 0;
                            break;
                        case "TEAM_RED":
                        case 1:
                            message.team = 1;
                            break;
                        case "TEAM_BLUE":
                        case 2:
                            message.team = 2;
                            break;
                        }
                        switch (object.spawnRegion) {
                        default:
                            if (typeof object.spawnRegion === "number") {
                                message.spawnRegion = object.spawnRegion;
                                break;
                            }
                            break;
                        case "REGION_UNSPECIFIED":
                        case 0:
                            message.spawnRegion = 0;
                            break;
                        case "TOP_LEFT":
                        case 1:
                            message.spawnRegion = 1;
                            break;
                        case "TOP_RIGHT":
                        case 2:
                            message.spawnRegion = 2;
                            break;
                        case "BOTTOM_LEFT":
                        case 3:
                            message.spawnRegion = 3;
                            break;
                        case "BOTTOM_RIGHT":
                        case 4:
                            message.spawnRegion = 4;
                            break;
                        }
                        if (object.ready != null)
                            message.ready = Boolean(object.ready);
                        if (object.isHost != null)
                            message.isHost = Boolean(object.isHost);
                        if (object.isTeamCaptain != null)
                            message.isTeamCaptain = Boolean(object.isTeamCaptain);
                        return message;
                    };

                    /**
                     * Creates a plain object from a LobbyPlayer message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @static
                     * @param {com.triforge.protocol.proto.LobbyPlayer} message LobbyPlayer
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    LobbyPlayer.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.playerId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.playerId = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            object.displayName = "";
                            object.team = options.enums === String ? "TEAM_NONE" : 0;
                            object.spawnRegion = options.enums === String ? "REGION_UNSPECIFIED" : 0;
                            object.ready = false;
                            object.isHost = false;
                            object.isTeamCaptain = false;
                        }
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.playerId = typeof message.playerId === "number" ? BigInt(message.playerId) : $util.Long.fromBits(message.playerId.low >>> 0, message.playerId.high >>> 0, true).toBigInt();
                            else if (typeof message.playerId === "number")
                                object.playerId = options.longs === String ? String(message.playerId) : message.playerId;
                            else
                                object.playerId = options.longs === String ? $util.Long.prototype.toString.call(message.playerId) : options.longs === Number ? new $util.LongBits(message.playerId.low >>> 0, message.playerId.high >>> 0).toNumber(true) : message.playerId;
                        if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                            object.displayName = message.displayName;
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            object.team = options.enums === String ? $root.com.triforge.protocol.proto.Team[message.team] === undefined ? message.team : $root.com.triforge.protocol.proto.Team[message.team] : message.team;
                        if (message.spawnRegion != null && Object.hasOwnProperty.call(message, "spawnRegion"))
                            object.spawnRegion = options.enums === String ? $root.com.triforge.protocol.proto.SpawnRegion[message.spawnRegion] === undefined ? message.spawnRegion : $root.com.triforge.protocol.proto.SpawnRegion[message.spawnRegion] : message.spawnRegion;
                        if (message.ready != null && Object.hasOwnProperty.call(message, "ready"))
                            object.ready = message.ready;
                        if (message.isHost != null && Object.hasOwnProperty.call(message, "isHost"))
                            object.isHost = message.isHost;
                        if (message.isTeamCaptain != null && Object.hasOwnProperty.call(message, "isTeamCaptain"))
                            object.isTeamCaptain = message.isTeamCaptain;
                        return object;
                    };

                    /**
                     * Converts this LobbyPlayer to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    LobbyPlayer.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for LobbyPlayer
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.LobbyPlayer
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    LobbyPlayer.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.LobbyPlayer";
                    };

                    return LobbyPlayer;
                })();

                proto.TeamSetup = (function() {

                    /**
                     * Properties of a TeamSetup.
                     * @memberof com.triforge.protocol.proto
                     * @interface ITeamSetup
                     * @property {com.triforge.protocol.proto.Team|null} [team] TeamSetup team
                     * @property {number|Long|null} [captainPlayerId] TeamSetup captainPlayerId
                     * @property {com.triforge.protocol.proto.SpawnRegion|null} [spawnRegion] TeamSetup spawnRegion
                     * @property {com.triforge.protocol.proto.SpawnRegion|null} [hqRegion] TeamSetup hqRegion
                     */

                    /**
                     * Constructs a new TeamSetup.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a TeamSetup.
                     * @implements ITeamSetup
                     * @constructor
                     * @param {com.triforge.protocol.proto.ITeamSetup=} [properties] Properties to set
                     */
                    function TeamSetup(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * TeamSetup team.
                     * @member {com.triforge.protocol.proto.Team} team
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @instance
                     */
                    TeamSetup.prototype.team = 0;

                    /**
                     * TeamSetup captainPlayerId.
                     * @member {number|Long} captainPlayerId
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @instance
                     */
                    TeamSetup.prototype.captainPlayerId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * TeamSetup spawnRegion.
                     * @member {com.triforge.protocol.proto.SpawnRegion} spawnRegion
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @instance
                     */
                    TeamSetup.prototype.spawnRegion = 0;

                    /**
                     * TeamSetup hqRegion.
                     * @member {com.triforge.protocol.proto.SpawnRegion} hqRegion
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @instance
                     */
                    TeamSetup.prototype.hqRegion = 0;

                    /**
                     * Creates a new TeamSetup instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @static
                     * @param {com.triforge.protocol.proto.ITeamSetup=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.TeamSetup} TeamSetup instance
                     */
                    TeamSetup.create = function create(properties) {
                        return new TeamSetup(properties);
                    };

                    /**
                     * Encodes the specified TeamSetup message. Does not implicitly {@link com.triforge.protocol.proto.TeamSetup.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @static
                     * @param {com.triforge.protocol.proto.ITeamSetup} message TeamSetup message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TeamSetup.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.team);
                        if (message.captainPlayerId != null && Object.hasOwnProperty.call(message, "captainPlayerId"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.captainPlayerId);
                        if (message.spawnRegion != null && Object.hasOwnProperty.call(message, "spawnRegion"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.spawnRegion);
                        if (message.hqRegion != null && Object.hasOwnProperty.call(message, "hqRegion"))
                            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.hqRegion);
                        return writer;
                    };

                    /**
                     * Encodes the specified TeamSetup message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.TeamSetup.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @static
                     * @param {com.triforge.protocol.proto.ITeamSetup} message TeamSetup message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TeamSetup.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a TeamSetup message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.TeamSetup} TeamSetup
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TeamSetup.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.TeamSetup();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.team = reader.int32();
                                    break;
                                }
                            case 2: {
                                    message.captainPlayerId = reader.uint64();
                                    break;
                                }
                            case 3: {
                                    message.spawnRegion = reader.int32();
                                    break;
                                }
                            case 4: {
                                    message.hqRegion = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a TeamSetup message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.TeamSetup} TeamSetup
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TeamSetup.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a TeamSetup message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    TeamSetup.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            switch (message.team) {
                            default:
                                return "team: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                                break;
                            }
                        if (message.captainPlayerId != null && Object.hasOwnProperty.call(message, "captainPlayerId"))
                            if (!$util.isInteger(message.captainPlayerId) && !(message.captainPlayerId && $util.isInteger(message.captainPlayerId.low) && $util.isInteger(message.captainPlayerId.high)))
                                return "captainPlayerId: integer|Long expected";
                        if (message.spawnRegion != null && Object.hasOwnProperty.call(message, "spawnRegion"))
                            switch (message.spawnRegion) {
                            default:
                                return "spawnRegion: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                                break;
                            }
                        if (message.hqRegion != null && Object.hasOwnProperty.call(message, "hqRegion"))
                            switch (message.hqRegion) {
                            default:
                                return "hqRegion: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                                break;
                            }
                        return null;
                    };

                    /**
                     * Creates a TeamSetup message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.TeamSetup} TeamSetup
                     */
                    TeamSetup.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.TeamSetup)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.TeamSetup: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.TeamSetup();
                        switch (object.team) {
                        default:
                            if (typeof object.team === "number") {
                                message.team = object.team;
                                break;
                            }
                            break;
                        case "TEAM_NONE":
                        case 0:
                            message.team = 0;
                            break;
                        case "TEAM_RED":
                        case 1:
                            message.team = 1;
                            break;
                        case "TEAM_BLUE":
                        case 2:
                            message.team = 2;
                            break;
                        }
                        if (object.captainPlayerId != null)
                            if ($util.Long)
                                message.captainPlayerId = $util.Long.fromValue(object.captainPlayerId, true);
                            else if (typeof object.captainPlayerId === "string")
                                message.captainPlayerId = parseInt(object.captainPlayerId, 10);
                            else if (typeof object.captainPlayerId === "number")
                                message.captainPlayerId = object.captainPlayerId;
                            else if (typeof object.captainPlayerId === "object")
                                message.captainPlayerId = new $util.LongBits(object.captainPlayerId.low >>> 0, object.captainPlayerId.high >>> 0).toNumber(true);
                        switch (object.spawnRegion) {
                        default:
                            if (typeof object.spawnRegion === "number") {
                                message.spawnRegion = object.spawnRegion;
                                break;
                            }
                            break;
                        case "REGION_UNSPECIFIED":
                        case 0:
                            message.spawnRegion = 0;
                            break;
                        case "TOP_LEFT":
                        case 1:
                            message.spawnRegion = 1;
                            break;
                        case "TOP_RIGHT":
                        case 2:
                            message.spawnRegion = 2;
                            break;
                        case "BOTTOM_LEFT":
                        case 3:
                            message.spawnRegion = 3;
                            break;
                        case "BOTTOM_RIGHT":
                        case 4:
                            message.spawnRegion = 4;
                            break;
                        }
                        switch (object.hqRegion) {
                        default:
                            if (typeof object.hqRegion === "number") {
                                message.hqRegion = object.hqRegion;
                                break;
                            }
                            break;
                        case "REGION_UNSPECIFIED":
                        case 0:
                            message.hqRegion = 0;
                            break;
                        case "TOP_LEFT":
                        case 1:
                            message.hqRegion = 1;
                            break;
                        case "TOP_RIGHT":
                        case 2:
                            message.hqRegion = 2;
                            break;
                        case "BOTTOM_LEFT":
                        case 3:
                            message.hqRegion = 3;
                            break;
                        case "BOTTOM_RIGHT":
                        case 4:
                            message.hqRegion = 4;
                            break;
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a TeamSetup message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @static
                     * @param {com.triforge.protocol.proto.TeamSetup} message TeamSetup
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    TeamSetup.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            object.team = options.enums === String ? "TEAM_NONE" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.captainPlayerId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.captainPlayerId = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            object.spawnRegion = options.enums === String ? "REGION_UNSPECIFIED" : 0;
                            object.hqRegion = options.enums === String ? "REGION_UNSPECIFIED" : 0;
                        }
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            object.team = options.enums === String ? $root.com.triforge.protocol.proto.Team[message.team] === undefined ? message.team : $root.com.triforge.protocol.proto.Team[message.team] : message.team;
                        if (message.captainPlayerId != null && Object.hasOwnProperty.call(message, "captainPlayerId"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.captainPlayerId = typeof message.captainPlayerId === "number" ? BigInt(message.captainPlayerId) : $util.Long.fromBits(message.captainPlayerId.low >>> 0, message.captainPlayerId.high >>> 0, true).toBigInt();
                            else if (typeof message.captainPlayerId === "number")
                                object.captainPlayerId = options.longs === String ? String(message.captainPlayerId) : message.captainPlayerId;
                            else
                                object.captainPlayerId = options.longs === String ? $util.Long.prototype.toString.call(message.captainPlayerId) : options.longs === Number ? new $util.LongBits(message.captainPlayerId.low >>> 0, message.captainPlayerId.high >>> 0).toNumber(true) : message.captainPlayerId;
                        if (message.spawnRegion != null && Object.hasOwnProperty.call(message, "spawnRegion"))
                            object.spawnRegion = options.enums === String ? $root.com.triforge.protocol.proto.SpawnRegion[message.spawnRegion] === undefined ? message.spawnRegion : $root.com.triforge.protocol.proto.SpawnRegion[message.spawnRegion] : message.spawnRegion;
                        if (message.hqRegion != null && Object.hasOwnProperty.call(message, "hqRegion"))
                            object.hqRegion = options.enums === String ? $root.com.triforge.protocol.proto.SpawnRegion[message.hqRegion] === undefined ? message.hqRegion : $root.com.triforge.protocol.proto.SpawnRegion[message.hqRegion] : message.hqRegion;
                        return object;
                    };

                    /**
                     * Converts this TeamSetup to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    TeamSetup.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for TeamSetup
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.TeamSetup
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    TeamSetup.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.TeamSetup";
                    };

                    return TeamSetup;
                })();

                proto.RoomLobbySnapshot = (function() {

                    /**
                     * Properties of a RoomLobbySnapshot.
                     * @memberof com.triforge.protocol.proto
                     * @interface IRoomLobbySnapshot
                     * @property {string|null} [roomId] RoomLobbySnapshot roomId
                     * @property {string|null} [roomName] RoomLobbySnapshot roomName
                     * @property {com.triforge.protocol.proto.MatchPhase|null} [phase] RoomLobbySnapshot phase
                     * @property {Array.<com.triforge.protocol.proto.ILobbyPlayer>|null} [players] RoomLobbySnapshot players
                     * @property {number|null} [minPlayers] RoomLobbySnapshot minPlayers
                     * @property {boolean|null} [canStart] RoomLobbySnapshot canStart
                     * @property {Array.<com.triforge.protocol.proto.ITeamSetup>|null} [teamSetups] RoomLobbySnapshot teamSetups
                     */

                    /**
                     * Constructs a new RoomLobbySnapshot.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a RoomLobbySnapshot.
                     * @implements IRoomLobbySnapshot
                     * @constructor
                     * @param {com.triforge.protocol.proto.IRoomLobbySnapshot=} [properties] Properties to set
                     */
                    function RoomLobbySnapshot(properties) {
                        this.players = [];
                        this.teamSetups = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * RoomLobbySnapshot roomId.
                     * @member {string} roomId
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @instance
                     */
                    RoomLobbySnapshot.prototype.roomId = "";

                    /**
                     * RoomLobbySnapshot roomName.
                     * @member {string} roomName
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @instance
                     */
                    RoomLobbySnapshot.prototype.roomName = "";

                    /**
                     * RoomLobbySnapshot phase.
                     * @member {com.triforge.protocol.proto.MatchPhase} phase
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @instance
                     */
                    RoomLobbySnapshot.prototype.phase = 0;

                    /**
                     * RoomLobbySnapshot players.
                     * @member {Array.<com.triforge.protocol.proto.ILobbyPlayer>} players
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @instance
                     */
                    RoomLobbySnapshot.prototype.players = $util.emptyArray;

                    /**
                     * RoomLobbySnapshot minPlayers.
                     * @member {number} minPlayers
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @instance
                     */
                    RoomLobbySnapshot.prototype.minPlayers = 0;

                    /**
                     * RoomLobbySnapshot canStart.
                     * @member {boolean} canStart
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @instance
                     */
                    RoomLobbySnapshot.prototype.canStart = false;

                    /**
                     * RoomLobbySnapshot teamSetups.
                     * @member {Array.<com.triforge.protocol.proto.ITeamSetup>} teamSetups
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @instance
                     */
                    RoomLobbySnapshot.prototype.teamSetups = $util.emptyArray;

                    /**
                     * Creates a new RoomLobbySnapshot instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IRoomLobbySnapshot=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.RoomLobbySnapshot} RoomLobbySnapshot instance
                     */
                    RoomLobbySnapshot.create = function create(properties) {
                        return new RoomLobbySnapshot(properties);
                    };

                    /**
                     * Encodes the specified RoomLobbySnapshot message. Does not implicitly {@link com.triforge.protocol.proto.RoomLobbySnapshot.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IRoomLobbySnapshot} message RoomLobbySnapshot message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    RoomLobbySnapshot.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomId);
                        if (message.roomName != null && Object.hasOwnProperty.call(message, "roomName"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.roomName);
                        if (message.phase != null && Object.hasOwnProperty.call(message, "phase"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.phase);
                        if (message.players != null && message.players.length)
                            for (let i = 0; i < message.players.length; ++i)
                                $root.com.triforge.protocol.proto.LobbyPlayer.encode(message.players[i], writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
                        if (message.minPlayers != null && Object.hasOwnProperty.call(message, "minPlayers"))
                            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.minPlayers);
                        if (message.canStart != null && Object.hasOwnProperty.call(message, "canStart"))
                            writer.uint32(/* id 6, wireType 0 =*/48).bool(message.canStart);
                        if (message.teamSetups != null && message.teamSetups.length)
                            for (let i = 0; i < message.teamSetups.length; ++i)
                                $root.com.triforge.protocol.proto.TeamSetup.encode(message.teamSetups[i], writer.uint32(/* id 7, wireType 2 =*/58).fork(), q + 1).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified RoomLobbySnapshot message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.RoomLobbySnapshot.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.IRoomLobbySnapshot} message RoomLobbySnapshot message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    RoomLobbySnapshot.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a RoomLobbySnapshot message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.RoomLobbySnapshot} RoomLobbySnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    RoomLobbySnapshot.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.RoomLobbySnapshot();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.roomId = reader.string();
                                    break;
                                }
                            case 2: {
                                    message.roomName = reader.string();
                                    break;
                                }
                            case 3: {
                                    message.phase = reader.int32();
                                    break;
                                }
                            case 4: {
                                    if (!(message.players && message.players.length))
                                        message.players = [];
                                    message.players.push($root.com.triforge.protocol.proto.LobbyPlayer.decode(reader, reader.uint32(), undefined, long + 1));
                                    break;
                                }
                            case 5: {
                                    message.minPlayers = reader.uint32();
                                    break;
                                }
                            case 6: {
                                    message.canStart = reader.bool();
                                    break;
                                }
                            case 7: {
                                    if (!(message.teamSetups && message.teamSetups.length))
                                        message.teamSetups = [];
                                    message.teamSetups.push($root.com.triforge.protocol.proto.TeamSetup.decode(reader, reader.uint32(), undefined, long + 1));
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a RoomLobbySnapshot message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.RoomLobbySnapshot} RoomLobbySnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    RoomLobbySnapshot.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a RoomLobbySnapshot message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    RoomLobbySnapshot.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                            if (!$util.isString(message.roomId))
                                return "roomId: string expected";
                        if (message.roomName != null && Object.hasOwnProperty.call(message, "roomName"))
                            if (!$util.isString(message.roomName))
                                return "roomName: string expected";
                        if (message.phase != null && Object.hasOwnProperty.call(message, "phase"))
                            switch (message.phase) {
                            default:
                                return "phase: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                                break;
                            }
                        if (message.players != null && Object.hasOwnProperty.call(message, "players")) {
                            if (!Array.isArray(message.players))
                                return "players: array expected";
                            for (let i = 0; i < message.players.length; ++i) {
                                let error = $root.com.triforge.protocol.proto.LobbyPlayer.verify(message.players[i], long + 1);
                                if (error)
                                    return "players." + error;
                            }
                        }
                        if (message.minPlayers != null && Object.hasOwnProperty.call(message, "minPlayers"))
                            if (!$util.isInteger(message.minPlayers))
                                return "minPlayers: integer expected";
                        if (message.canStart != null && Object.hasOwnProperty.call(message, "canStart"))
                            if (typeof message.canStart !== "boolean")
                                return "canStart: boolean expected";
                        if (message.teamSetups != null && Object.hasOwnProperty.call(message, "teamSetups")) {
                            if (!Array.isArray(message.teamSetups))
                                return "teamSetups: array expected";
                            for (let i = 0; i < message.teamSetups.length; ++i) {
                                let error = $root.com.triforge.protocol.proto.TeamSetup.verify(message.teamSetups[i], long + 1);
                                if (error)
                                    return "teamSetups." + error;
                            }
                        }
                        return null;
                    };

                    /**
                     * Creates a RoomLobbySnapshot message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.RoomLobbySnapshot} RoomLobbySnapshot
                     */
                    RoomLobbySnapshot.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.RoomLobbySnapshot)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.RoomLobbySnapshot: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.RoomLobbySnapshot();
                        if (object.roomId != null)
                            message.roomId = String(object.roomId);
                        if (object.roomName != null)
                            message.roomName = String(object.roomName);
                        switch (object.phase) {
                        default:
                            if (typeof object.phase === "number") {
                                message.phase = object.phase;
                                break;
                            }
                            break;
                        case "LOBBY":
                        case 0:
                            message.phase = 0;
                            break;
                        case "COUNTDOWN":
                        case 1:
                            message.phase = 1;
                            break;
                        case "PLAYING":
                        case 2:
                            message.phase = 2;
                            break;
                        case "ENDED":
                        case 3:
                            message.phase = 3;
                            break;
                        }
                        if (object.players) {
                            if (!Array.isArray(object.players))
                                throw TypeError(".com.triforge.protocol.proto.RoomLobbySnapshot.players: array expected");
                            message.players = [];
                            for (let i = 0; i < object.players.length; ++i) {
                                if (!$util.isObject(object.players[i]))
                                    throw TypeError(".com.triforge.protocol.proto.RoomLobbySnapshot.players: object expected");
                                message.players[i] = $root.com.triforge.protocol.proto.LobbyPlayer.fromObject(object.players[i], long + 1);
                            }
                        }
                        if (object.minPlayers != null)
                            message.minPlayers = object.minPlayers >>> 0;
                        if (object.canStart != null)
                            message.canStart = Boolean(object.canStart);
                        if (object.teamSetups) {
                            if (!Array.isArray(object.teamSetups))
                                throw TypeError(".com.triforge.protocol.proto.RoomLobbySnapshot.teamSetups: array expected");
                            message.teamSetups = [];
                            for (let i = 0; i < object.teamSetups.length; ++i) {
                                if (!$util.isObject(object.teamSetups[i]))
                                    throw TypeError(".com.triforge.protocol.proto.RoomLobbySnapshot.teamSetups: object expected");
                                message.teamSetups[i] = $root.com.triforge.protocol.proto.TeamSetup.fromObject(object.teamSetups[i], long + 1);
                            }
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a RoomLobbySnapshot message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @static
                     * @param {com.triforge.protocol.proto.RoomLobbySnapshot} message RoomLobbySnapshot
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    RoomLobbySnapshot.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.arrays || options.defaults) {
                            object.players = [];
                            object.teamSetups = [];
                        }
                        if (options.defaults) {
                            object.roomId = "";
                            object.roomName = "";
                            object.phase = options.enums === String ? "LOBBY" : 0;
                            object.minPlayers = 0;
                            object.canStart = false;
                        }
                        if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                            object.roomId = message.roomId;
                        if (message.roomName != null && Object.hasOwnProperty.call(message, "roomName"))
                            object.roomName = message.roomName;
                        if (message.phase != null && Object.hasOwnProperty.call(message, "phase"))
                            object.phase = options.enums === String ? $root.com.triforge.protocol.proto.MatchPhase[message.phase] === undefined ? message.phase : $root.com.triforge.protocol.proto.MatchPhase[message.phase] : message.phase;
                        if (message.players && message.players.length) {
                            object.players = [];
                            for (let j = 0; j < message.players.length; ++j)
                                object.players[j] = $root.com.triforge.protocol.proto.LobbyPlayer.toObject(message.players[j], options, q + 1);
                        }
                        if (message.minPlayers != null && Object.hasOwnProperty.call(message, "minPlayers"))
                            object.minPlayers = message.minPlayers;
                        if (message.canStart != null && Object.hasOwnProperty.call(message, "canStart"))
                            object.canStart = message.canStart;
                        if (message.teamSetups && message.teamSetups.length) {
                            object.teamSetups = [];
                            for (let j = 0; j < message.teamSetups.length; ++j)
                                object.teamSetups[j] = $root.com.triforge.protocol.proto.TeamSetup.toObject(message.teamSetups[j], options, q + 1);
                        }
                        return object;
                    };

                    /**
                     * Converts this RoomLobbySnapshot to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    RoomLobbySnapshot.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for RoomLobbySnapshot
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.RoomLobbySnapshot
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    RoomLobbySnapshot.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.RoomLobbySnapshot";
                    };

                    return RoomLobbySnapshot;
                })();

                proto.SetNameAction = (function() {

                    /**
                     * Properties of a SetNameAction.
                     * @memberof com.triforge.protocol.proto
                     * @interface ISetNameAction
                     * @property {string|null} [displayName] SetNameAction displayName
                     */

                    /**
                     * Constructs a new SetNameAction.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a SetNameAction.
                     * @implements ISetNameAction
                     * @constructor
                     * @param {com.triforge.protocol.proto.ISetNameAction=} [properties] Properties to set
                     */
                    function SetNameAction(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * SetNameAction displayName.
                     * @member {string} displayName
                     * @memberof com.triforge.protocol.proto.SetNameAction
                     * @instance
                     */
                    SetNameAction.prototype.displayName = "";

                    /**
                     * Creates a new SetNameAction instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.SetNameAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetNameAction=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.SetNameAction} SetNameAction instance
                     */
                    SetNameAction.create = function create(properties) {
                        return new SetNameAction(properties);
                    };

                    /**
                     * Encodes the specified SetNameAction message. Does not implicitly {@link com.triforge.protocol.proto.SetNameAction.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.SetNameAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetNameAction} message SetNameAction message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SetNameAction.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.displayName);
                        return writer;
                    };

                    /**
                     * Encodes the specified SetNameAction message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.SetNameAction.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.SetNameAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetNameAction} message SetNameAction message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SetNameAction.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a SetNameAction message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.SetNameAction
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.SetNameAction} SetNameAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SetNameAction.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.SetNameAction();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.displayName = reader.string();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a SetNameAction message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.SetNameAction
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.SetNameAction} SetNameAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SetNameAction.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a SetNameAction message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.SetNameAction
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    SetNameAction.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                            if (!$util.isString(message.displayName))
                                return "displayName: string expected";
                        return null;
                    };

                    /**
                     * Creates a SetNameAction message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.SetNameAction
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.SetNameAction} SetNameAction
                     */
                    SetNameAction.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.SetNameAction)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.SetNameAction: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.SetNameAction();
                        if (object.displayName != null)
                            message.displayName = String(object.displayName);
                        return message;
                    };

                    /**
                     * Creates a plain object from a SetNameAction message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.SetNameAction
                     * @static
                     * @param {com.triforge.protocol.proto.SetNameAction} message SetNameAction
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    SetNameAction.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults)
                            object.displayName = "";
                        if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                            object.displayName = message.displayName;
                        return object;
                    };

                    /**
                     * Converts this SetNameAction to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.SetNameAction
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    SetNameAction.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for SetNameAction
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.SetNameAction
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    SetNameAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.SetNameAction";
                    };

                    return SetNameAction;
                })();

                proto.SetTeamAction = (function() {

                    /**
                     * Properties of a SetTeamAction.
                     * @memberof com.triforge.protocol.proto
                     * @interface ISetTeamAction
                     * @property {com.triforge.protocol.proto.Team|null} [team] SetTeamAction team
                     */

                    /**
                     * Constructs a new SetTeamAction.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a SetTeamAction.
                     * @implements ISetTeamAction
                     * @constructor
                     * @param {com.triforge.protocol.proto.ISetTeamAction=} [properties] Properties to set
                     */
                    function SetTeamAction(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * SetTeamAction team.
                     * @member {com.triforge.protocol.proto.Team} team
                     * @memberof com.triforge.protocol.proto.SetTeamAction
                     * @instance
                     */
                    SetTeamAction.prototype.team = 0;

                    /**
                     * Creates a new SetTeamAction instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.SetTeamAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetTeamAction=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.SetTeamAction} SetTeamAction instance
                     */
                    SetTeamAction.create = function create(properties) {
                        return new SetTeamAction(properties);
                    };

                    /**
                     * Encodes the specified SetTeamAction message. Does not implicitly {@link com.triforge.protocol.proto.SetTeamAction.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.SetTeamAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetTeamAction} message SetTeamAction message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SetTeamAction.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.team);
                        return writer;
                    };

                    /**
                     * Encodes the specified SetTeamAction message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.SetTeamAction.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.SetTeamAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetTeamAction} message SetTeamAction message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SetTeamAction.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a SetTeamAction message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.SetTeamAction
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.SetTeamAction} SetTeamAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SetTeamAction.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.SetTeamAction();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.team = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a SetTeamAction message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.SetTeamAction
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.SetTeamAction} SetTeamAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SetTeamAction.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a SetTeamAction message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.SetTeamAction
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    SetTeamAction.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            switch (message.team) {
                            default:
                                return "team: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                                break;
                            }
                        return null;
                    };

                    /**
                     * Creates a SetTeamAction message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.SetTeamAction
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.SetTeamAction} SetTeamAction
                     */
                    SetTeamAction.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.SetTeamAction)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.SetTeamAction: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.SetTeamAction();
                        switch (object.team) {
                        default:
                            if (typeof object.team === "number") {
                                message.team = object.team;
                                break;
                            }
                            break;
                        case "TEAM_NONE":
                        case 0:
                            message.team = 0;
                            break;
                        case "TEAM_RED":
                        case 1:
                            message.team = 1;
                            break;
                        case "TEAM_BLUE":
                        case 2:
                            message.team = 2;
                            break;
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a SetTeamAction message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.SetTeamAction
                     * @static
                     * @param {com.triforge.protocol.proto.SetTeamAction} message SetTeamAction
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    SetTeamAction.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults)
                            object.team = options.enums === String ? "TEAM_NONE" : 0;
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            object.team = options.enums === String ? $root.com.triforge.protocol.proto.Team[message.team] === undefined ? message.team : $root.com.triforge.protocol.proto.Team[message.team] : message.team;
                        return object;
                    };

                    /**
                     * Converts this SetTeamAction to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.SetTeamAction
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    SetTeamAction.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for SetTeamAction
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.SetTeamAction
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    SetTeamAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.SetTeamAction";
                    };

                    return SetTeamAction;
                })();

                proto.SetSpawnAction = (function() {

                    /**
                     * Properties of a SetSpawnAction.
                     * @memberof com.triforge.protocol.proto
                     * @interface ISetSpawnAction
                     * @property {com.triforge.protocol.proto.SpawnRegion|null} [region] SetSpawnAction region
                     */

                    /**
                     * Constructs a new SetSpawnAction.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a SetSpawnAction.
                     * @implements ISetSpawnAction
                     * @constructor
                     * @param {com.triforge.protocol.proto.ISetSpawnAction=} [properties] Properties to set
                     */
                    function SetSpawnAction(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * SetSpawnAction region.
                     * @member {com.triforge.protocol.proto.SpawnRegion} region
                     * @memberof com.triforge.protocol.proto.SetSpawnAction
                     * @instance
                     */
                    SetSpawnAction.prototype.region = 0;

                    /**
                     * Creates a new SetSpawnAction instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.SetSpawnAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetSpawnAction=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.SetSpawnAction} SetSpawnAction instance
                     */
                    SetSpawnAction.create = function create(properties) {
                        return new SetSpawnAction(properties);
                    };

                    /**
                     * Encodes the specified SetSpawnAction message. Does not implicitly {@link com.triforge.protocol.proto.SetSpawnAction.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.SetSpawnAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetSpawnAction} message SetSpawnAction message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SetSpawnAction.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.region != null && Object.hasOwnProperty.call(message, "region"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.region);
                        return writer;
                    };

                    /**
                     * Encodes the specified SetSpawnAction message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.SetSpawnAction.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.SetSpawnAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetSpawnAction} message SetSpawnAction message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SetSpawnAction.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a SetSpawnAction message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.SetSpawnAction
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.SetSpawnAction} SetSpawnAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SetSpawnAction.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.SetSpawnAction();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.region = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a SetSpawnAction message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.SetSpawnAction
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.SetSpawnAction} SetSpawnAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SetSpawnAction.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a SetSpawnAction message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.SetSpawnAction
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    SetSpawnAction.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.region != null && Object.hasOwnProperty.call(message, "region"))
                            switch (message.region) {
                            default:
                                return "region: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                                break;
                            }
                        return null;
                    };

                    /**
                     * Creates a SetSpawnAction message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.SetSpawnAction
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.SetSpawnAction} SetSpawnAction
                     */
                    SetSpawnAction.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.SetSpawnAction)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.SetSpawnAction: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.SetSpawnAction();
                        switch (object.region) {
                        default:
                            if (typeof object.region === "number") {
                                message.region = object.region;
                                break;
                            }
                            break;
                        case "REGION_UNSPECIFIED":
                        case 0:
                            message.region = 0;
                            break;
                        case "TOP_LEFT":
                        case 1:
                            message.region = 1;
                            break;
                        case "TOP_RIGHT":
                        case 2:
                            message.region = 2;
                            break;
                        case "BOTTOM_LEFT":
                        case 3:
                            message.region = 3;
                            break;
                        case "BOTTOM_RIGHT":
                        case 4:
                            message.region = 4;
                            break;
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a SetSpawnAction message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.SetSpawnAction
                     * @static
                     * @param {com.triforge.protocol.proto.SetSpawnAction} message SetSpawnAction
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    SetSpawnAction.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults)
                            object.region = options.enums === String ? "REGION_UNSPECIFIED" : 0;
                        if (message.region != null && Object.hasOwnProperty.call(message, "region"))
                            object.region = options.enums === String ? $root.com.triforge.protocol.proto.SpawnRegion[message.region] === undefined ? message.region : $root.com.triforge.protocol.proto.SpawnRegion[message.region] : message.region;
                        return object;
                    };

                    /**
                     * Converts this SetSpawnAction to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.SetSpawnAction
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    SetSpawnAction.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for SetSpawnAction
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.SetSpawnAction
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    SetSpawnAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.SetSpawnAction";
                    };

                    return SetSpawnAction;
                })();

                proto.SetTeamSetupAction = (function() {

                    /**
                     * Properties of a SetTeamSetupAction.
                     * @memberof com.triforge.protocol.proto
                     * @interface ISetTeamSetupAction
                     * @property {com.triforge.protocol.proto.SpawnRegion|null} [spawnRegion] SetTeamSetupAction spawnRegion
                     * @property {com.triforge.protocol.proto.SpawnRegion|null} [hqRegion] SetTeamSetupAction hqRegion
                     */

                    /**
                     * Constructs a new SetTeamSetupAction.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a SetTeamSetupAction.
                     * @implements ISetTeamSetupAction
                     * @constructor
                     * @param {com.triforge.protocol.proto.ISetTeamSetupAction=} [properties] Properties to set
                     */
                    function SetTeamSetupAction(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * SetTeamSetupAction spawnRegion.
                     * @member {com.triforge.protocol.proto.SpawnRegion} spawnRegion
                     * @memberof com.triforge.protocol.proto.SetTeamSetupAction
                     * @instance
                     */
                    SetTeamSetupAction.prototype.spawnRegion = 0;

                    /**
                     * SetTeamSetupAction hqRegion.
                     * @member {com.triforge.protocol.proto.SpawnRegion} hqRegion
                     * @memberof com.triforge.protocol.proto.SetTeamSetupAction
                     * @instance
                     */
                    SetTeamSetupAction.prototype.hqRegion = 0;

                    /**
                     * Creates a new SetTeamSetupAction instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.SetTeamSetupAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetTeamSetupAction=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.SetTeamSetupAction} SetTeamSetupAction instance
                     */
                    SetTeamSetupAction.create = function create(properties) {
                        return new SetTeamSetupAction(properties);
                    };

                    /**
                     * Encodes the specified SetTeamSetupAction message. Does not implicitly {@link com.triforge.protocol.proto.SetTeamSetupAction.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.SetTeamSetupAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetTeamSetupAction} message SetTeamSetupAction message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SetTeamSetupAction.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.spawnRegion != null && Object.hasOwnProperty.call(message, "spawnRegion"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.spawnRegion);
                        if (message.hqRegion != null && Object.hasOwnProperty.call(message, "hqRegion"))
                            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.hqRegion);
                        return writer;
                    };

                    /**
                     * Encodes the specified SetTeamSetupAction message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.SetTeamSetupAction.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.SetTeamSetupAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetTeamSetupAction} message SetTeamSetupAction message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SetTeamSetupAction.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a SetTeamSetupAction message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.SetTeamSetupAction
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.SetTeamSetupAction} SetTeamSetupAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SetTeamSetupAction.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.SetTeamSetupAction();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.spawnRegion = reader.int32();
                                    break;
                                }
                            case 2: {
                                    message.hqRegion = reader.int32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a SetTeamSetupAction message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.SetTeamSetupAction
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.SetTeamSetupAction} SetTeamSetupAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SetTeamSetupAction.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a SetTeamSetupAction message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.SetTeamSetupAction
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    SetTeamSetupAction.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.spawnRegion != null && Object.hasOwnProperty.call(message, "spawnRegion"))
                            switch (message.spawnRegion) {
                            default:
                                return "spawnRegion: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                                break;
                            }
                        if (message.hqRegion != null && Object.hasOwnProperty.call(message, "hqRegion"))
                            switch (message.hqRegion) {
                            default:
                                return "hqRegion: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                                break;
                            }
                        return null;
                    };

                    /**
                     * Creates a SetTeamSetupAction message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.SetTeamSetupAction
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.SetTeamSetupAction} SetTeamSetupAction
                     */
                    SetTeamSetupAction.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.SetTeamSetupAction)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.SetTeamSetupAction: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.SetTeamSetupAction();
                        switch (object.spawnRegion) {
                        default:
                            if (typeof object.spawnRegion === "number") {
                                message.spawnRegion = object.spawnRegion;
                                break;
                            }
                            break;
                        case "REGION_UNSPECIFIED":
                        case 0:
                            message.spawnRegion = 0;
                            break;
                        case "TOP_LEFT":
                        case 1:
                            message.spawnRegion = 1;
                            break;
                        case "TOP_RIGHT":
                        case 2:
                            message.spawnRegion = 2;
                            break;
                        case "BOTTOM_LEFT":
                        case 3:
                            message.spawnRegion = 3;
                            break;
                        case "BOTTOM_RIGHT":
                        case 4:
                            message.spawnRegion = 4;
                            break;
                        }
                        switch (object.hqRegion) {
                        default:
                            if (typeof object.hqRegion === "number") {
                                message.hqRegion = object.hqRegion;
                                break;
                            }
                            break;
                        case "REGION_UNSPECIFIED":
                        case 0:
                            message.hqRegion = 0;
                            break;
                        case "TOP_LEFT":
                        case 1:
                            message.hqRegion = 1;
                            break;
                        case "TOP_RIGHT":
                        case 2:
                            message.hqRegion = 2;
                            break;
                        case "BOTTOM_LEFT":
                        case 3:
                            message.hqRegion = 3;
                            break;
                        case "BOTTOM_RIGHT":
                        case 4:
                            message.hqRegion = 4;
                            break;
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a SetTeamSetupAction message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.SetTeamSetupAction
                     * @static
                     * @param {com.triforge.protocol.proto.SetTeamSetupAction} message SetTeamSetupAction
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    SetTeamSetupAction.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            object.spawnRegion = options.enums === String ? "REGION_UNSPECIFIED" : 0;
                            object.hqRegion = options.enums === String ? "REGION_UNSPECIFIED" : 0;
                        }
                        if (message.spawnRegion != null && Object.hasOwnProperty.call(message, "spawnRegion"))
                            object.spawnRegion = options.enums === String ? $root.com.triforge.protocol.proto.SpawnRegion[message.spawnRegion] === undefined ? message.spawnRegion : $root.com.triforge.protocol.proto.SpawnRegion[message.spawnRegion] : message.spawnRegion;
                        if (message.hqRegion != null && Object.hasOwnProperty.call(message, "hqRegion"))
                            object.hqRegion = options.enums === String ? $root.com.triforge.protocol.proto.SpawnRegion[message.hqRegion] === undefined ? message.hqRegion : $root.com.triforge.protocol.proto.SpawnRegion[message.hqRegion] : message.hqRegion;
                        return object;
                    };

                    /**
                     * Converts this SetTeamSetupAction to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.SetTeamSetupAction
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    SetTeamSetupAction.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for SetTeamSetupAction
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.SetTeamSetupAction
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    SetTeamSetupAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.SetTeamSetupAction";
                    };

                    return SetTeamSetupAction;
                })();

                proto.SetReadyAction = (function() {

                    /**
                     * Properties of a SetReadyAction.
                     * @memberof com.triforge.protocol.proto
                     * @interface ISetReadyAction
                     * @property {boolean|null} [ready] SetReadyAction ready
                     */

                    /**
                     * Constructs a new SetReadyAction.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a SetReadyAction.
                     * @implements ISetReadyAction
                     * @constructor
                     * @param {com.triforge.protocol.proto.ISetReadyAction=} [properties] Properties to set
                     */
                    function SetReadyAction(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * SetReadyAction ready.
                     * @member {boolean} ready
                     * @memberof com.triforge.protocol.proto.SetReadyAction
                     * @instance
                     */
                    SetReadyAction.prototype.ready = false;

                    /**
                     * Creates a new SetReadyAction instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.SetReadyAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetReadyAction=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.SetReadyAction} SetReadyAction instance
                     */
                    SetReadyAction.create = function create(properties) {
                        return new SetReadyAction(properties);
                    };

                    /**
                     * Encodes the specified SetReadyAction message. Does not implicitly {@link com.triforge.protocol.proto.SetReadyAction.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.SetReadyAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetReadyAction} message SetReadyAction message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SetReadyAction.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.ready != null && Object.hasOwnProperty.call(message, "ready"))
                            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.ready);
                        return writer;
                    };

                    /**
                     * Encodes the specified SetReadyAction message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.SetReadyAction.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.SetReadyAction
                     * @static
                     * @param {com.triforge.protocol.proto.ISetReadyAction} message SetReadyAction message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SetReadyAction.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a SetReadyAction message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.SetReadyAction
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.SetReadyAction} SetReadyAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SetReadyAction.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.SetReadyAction();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.ready = reader.bool();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a SetReadyAction message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.SetReadyAction
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.SetReadyAction} SetReadyAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SetReadyAction.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a SetReadyAction message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.SetReadyAction
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    SetReadyAction.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.ready != null && Object.hasOwnProperty.call(message, "ready"))
                            if (typeof message.ready !== "boolean")
                                return "ready: boolean expected";
                        return null;
                    };

                    /**
                     * Creates a SetReadyAction message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.SetReadyAction
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.SetReadyAction} SetReadyAction
                     */
                    SetReadyAction.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.SetReadyAction)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.SetReadyAction: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.SetReadyAction();
                        if (object.ready != null)
                            message.ready = Boolean(object.ready);
                        return message;
                    };

                    /**
                     * Creates a plain object from a SetReadyAction message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.SetReadyAction
                     * @static
                     * @param {com.triforge.protocol.proto.SetReadyAction} message SetReadyAction
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    SetReadyAction.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults)
                            object.ready = false;
                        if (message.ready != null && Object.hasOwnProperty.call(message, "ready"))
                            object.ready = message.ready;
                        return object;
                    };

                    /**
                     * Converts this SetReadyAction to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.SetReadyAction
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    SetReadyAction.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for SetReadyAction
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.SetReadyAction
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    SetReadyAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.SetReadyAction";
                    };

                    return SetReadyAction;
                })();

                proto.StartMatchAction = (function() {

                    /**
                     * Properties of a StartMatchAction.
                     * @memberof com.triforge.protocol.proto
                     * @interface IStartMatchAction
                     */

                    /**
                     * Constructs a new StartMatchAction.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a StartMatchAction.
                     * @implements IStartMatchAction
                     * @constructor
                     * @param {com.triforge.protocol.proto.IStartMatchAction=} [properties] Properties to set
                     */
                    function StartMatchAction(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Creates a new StartMatchAction instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.StartMatchAction
                     * @static
                     * @param {com.triforge.protocol.proto.IStartMatchAction=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.StartMatchAction} StartMatchAction instance
                     */
                    StartMatchAction.create = function create(properties) {
                        return new StartMatchAction(properties);
                    };

                    /**
                     * Encodes the specified StartMatchAction message. Does not implicitly {@link com.triforge.protocol.proto.StartMatchAction.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.StartMatchAction
                     * @static
                     * @param {com.triforge.protocol.proto.IStartMatchAction} message StartMatchAction message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    StartMatchAction.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        return writer;
                    };

                    /**
                     * Encodes the specified StartMatchAction message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.StartMatchAction.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.StartMatchAction
                     * @static
                     * @param {com.triforge.protocol.proto.IStartMatchAction} message StartMatchAction message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    StartMatchAction.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a StartMatchAction message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.StartMatchAction
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.StartMatchAction} StartMatchAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    StartMatchAction.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.StartMatchAction();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a StartMatchAction message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.StartMatchAction
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.StartMatchAction} StartMatchAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    StartMatchAction.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a StartMatchAction message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.StartMatchAction
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    StartMatchAction.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        return null;
                    };

                    /**
                     * Creates a StartMatchAction message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.StartMatchAction
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.StartMatchAction} StartMatchAction
                     */
                    StartMatchAction.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.StartMatchAction)
                            return object;
                        return new $root.com.triforge.protocol.proto.StartMatchAction();
                    };

                    /**
                     * Creates a plain object from a StartMatchAction message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.StartMatchAction
                     * @static
                     * @param {com.triforge.protocol.proto.StartMatchAction} message StartMatchAction
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    StartMatchAction.toObject = function toObject() {
                        return {};
                    };

                    /**
                     * Converts this StartMatchAction to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.StartMatchAction
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    StartMatchAction.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for StartMatchAction
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.StartMatchAction
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    StartMatchAction.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.StartMatchAction";
                    };

                    return StartMatchAction;
                })();

                proto.LobbyCommand = (function() {

                    /**
                     * Properties of a LobbyCommand.
                     * @memberof com.triforge.protocol.proto
                     * @interface ILobbyCommand
                     * @property {com.triforge.protocol.proto.ISetNameAction|null} [setName] LobbyCommand setName
                     * @property {com.triforge.protocol.proto.ISetTeamAction|null} [setTeam] LobbyCommand setTeam
                     * @property {com.triforge.protocol.proto.ISetSpawnAction|null} [setSpawn] LobbyCommand setSpawn
                     * @property {com.triforge.protocol.proto.ISetReadyAction|null} [setReady] LobbyCommand setReady
                     * @property {com.triforge.protocol.proto.IStartMatchAction|null} [startMatch] LobbyCommand startMatch
                     * @property {com.triforge.protocol.proto.ISetTeamSetupAction|null} [setTeamSetup] LobbyCommand setTeamSetup
                     */

                    /**
                     * Constructs a new LobbyCommand.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a LobbyCommand.
                     * @implements ILobbyCommand
                     * @constructor
                     * @param {com.triforge.protocol.proto.ILobbyCommand=} [properties] Properties to set
                     */
                    function LobbyCommand(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * LobbyCommand setName.
                     * @member {com.triforge.protocol.proto.ISetNameAction|null|undefined} setName
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @instance
                     */
                    LobbyCommand.prototype.setName = null;

                    /**
                     * LobbyCommand setTeam.
                     * @member {com.triforge.protocol.proto.ISetTeamAction|null|undefined} setTeam
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @instance
                     */
                    LobbyCommand.prototype.setTeam = null;

                    /**
                     * LobbyCommand setSpawn.
                     * @member {com.triforge.protocol.proto.ISetSpawnAction|null|undefined} setSpawn
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @instance
                     */
                    LobbyCommand.prototype.setSpawn = null;

                    /**
                     * LobbyCommand setReady.
                     * @member {com.triforge.protocol.proto.ISetReadyAction|null|undefined} setReady
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @instance
                     */
                    LobbyCommand.prototype.setReady = null;

                    /**
                     * LobbyCommand startMatch.
                     * @member {com.triforge.protocol.proto.IStartMatchAction|null|undefined} startMatch
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @instance
                     */
                    LobbyCommand.prototype.startMatch = null;

                    /**
                     * LobbyCommand setTeamSetup.
                     * @member {com.triforge.protocol.proto.ISetTeamSetupAction|null|undefined} setTeamSetup
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @instance
                     */
                    LobbyCommand.prototype.setTeamSetup = null;

                    // OneOf field names bound to virtual getters and setters
                    let $oneOfFields;

                    /**
                     * LobbyCommand action.
                     * @member {"setName"|"setTeam"|"setSpawn"|"setReady"|"startMatch"|"setTeamSetup"|undefined} action
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @instance
                     */
                    Object.defineProperty(LobbyCommand.prototype, "action", {
                        get: $util.oneOfGetter($oneOfFields = ["setName", "setTeam", "setSpawn", "setReady", "startMatch", "setTeamSetup"]),
                        set: $util.oneOfSetter($oneOfFields)
                    });

                    /**
                     * Creates a new LobbyCommand instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @static
                     * @param {com.triforge.protocol.proto.ILobbyCommand=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.LobbyCommand} LobbyCommand instance
                     */
                    LobbyCommand.create = function create(properties) {
                        return new LobbyCommand(properties);
                    };

                    /**
                     * Encodes the specified LobbyCommand message. Does not implicitly {@link com.triforge.protocol.proto.LobbyCommand.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @static
                     * @param {com.triforge.protocol.proto.ILobbyCommand} message LobbyCommand message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LobbyCommand.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.setName != null && Object.hasOwnProperty.call(message, "setName"))
                            $root.com.triforge.protocol.proto.SetNameAction.encode(message.setName, writer.uint32(/* id 1, wireType 2 =*/10).fork(), q + 1).ldelim();
                        if (message.setTeam != null && Object.hasOwnProperty.call(message, "setTeam"))
                            $root.com.triforge.protocol.proto.SetTeamAction.encode(message.setTeam, writer.uint32(/* id 2, wireType 2 =*/18).fork(), q + 1).ldelim();
                        if (message.setSpawn != null && Object.hasOwnProperty.call(message, "setSpawn"))
                            $root.com.triforge.protocol.proto.SetSpawnAction.encode(message.setSpawn, writer.uint32(/* id 3, wireType 2 =*/26).fork(), q + 1).ldelim();
                        if (message.setReady != null && Object.hasOwnProperty.call(message, "setReady"))
                            $root.com.triforge.protocol.proto.SetReadyAction.encode(message.setReady, writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
                        if (message.startMatch != null && Object.hasOwnProperty.call(message, "startMatch"))
                            $root.com.triforge.protocol.proto.StartMatchAction.encode(message.startMatch, writer.uint32(/* id 5, wireType 2 =*/42).fork(), q + 1).ldelim();
                        if (message.setTeamSetup != null && Object.hasOwnProperty.call(message, "setTeamSetup"))
                            $root.com.triforge.protocol.proto.SetTeamSetupAction.encode(message.setTeamSetup, writer.uint32(/* id 6, wireType 2 =*/50).fork(), q + 1).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified LobbyCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.LobbyCommand.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @static
                     * @param {com.triforge.protocol.proto.ILobbyCommand} message LobbyCommand message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LobbyCommand.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a LobbyCommand message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.LobbyCommand} LobbyCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LobbyCommand.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.LobbyCommand();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.setName = $root.com.triforge.protocol.proto.SetNameAction.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 2: {
                                    message.setTeam = $root.com.triforge.protocol.proto.SetTeamAction.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 3: {
                                    message.setSpawn = $root.com.triforge.protocol.proto.SetSpawnAction.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 4: {
                                    message.setReady = $root.com.triforge.protocol.proto.SetReadyAction.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 5: {
                                    message.startMatch = $root.com.triforge.protocol.proto.StartMatchAction.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            case 6: {
                                    message.setTeamSetup = $root.com.triforge.protocol.proto.SetTeamSetupAction.decode(reader, reader.uint32(), undefined, long + 1);
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a LobbyCommand message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.LobbyCommand} LobbyCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LobbyCommand.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a LobbyCommand message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    LobbyCommand.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        let properties = {};
                        if (message.setName != null && Object.hasOwnProperty.call(message, "setName")) {
                            properties.action = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.SetNameAction.verify(message.setName, long + 1);
                                if (error)
                                    return "setName." + error;
                            }
                        }
                        if (message.setTeam != null && Object.hasOwnProperty.call(message, "setTeam")) {
                            if (properties.action === 1)
                                return "action: multiple values";
                            properties.action = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.SetTeamAction.verify(message.setTeam, long + 1);
                                if (error)
                                    return "setTeam." + error;
                            }
                        }
                        if (message.setSpawn != null && Object.hasOwnProperty.call(message, "setSpawn")) {
                            if (properties.action === 1)
                                return "action: multiple values";
                            properties.action = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.SetSpawnAction.verify(message.setSpawn, long + 1);
                                if (error)
                                    return "setSpawn." + error;
                            }
                        }
                        if (message.setReady != null && Object.hasOwnProperty.call(message, "setReady")) {
                            if (properties.action === 1)
                                return "action: multiple values";
                            properties.action = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.SetReadyAction.verify(message.setReady, long + 1);
                                if (error)
                                    return "setReady." + error;
                            }
                        }
                        if (message.startMatch != null && Object.hasOwnProperty.call(message, "startMatch")) {
                            if (properties.action === 1)
                                return "action: multiple values";
                            properties.action = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.StartMatchAction.verify(message.startMatch, long + 1);
                                if (error)
                                    return "startMatch." + error;
                            }
                        }
                        if (message.setTeamSetup != null && Object.hasOwnProperty.call(message, "setTeamSetup")) {
                            if (properties.action === 1)
                                return "action: multiple values";
                            properties.action = 1;
                            {
                                let error = $root.com.triforge.protocol.proto.SetTeamSetupAction.verify(message.setTeamSetup, long + 1);
                                if (error)
                                    return "setTeamSetup." + error;
                            }
                        }
                        return null;
                    };

                    /**
                     * Creates a LobbyCommand message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.LobbyCommand} LobbyCommand
                     */
                    LobbyCommand.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.LobbyCommand)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.LobbyCommand: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.LobbyCommand();
                        if (object.setName != null) {
                            if (!$util.isObject(object.setName))
                                throw TypeError(".com.triforge.protocol.proto.LobbyCommand.setName: object expected");
                            message.setName = $root.com.triforge.protocol.proto.SetNameAction.fromObject(object.setName, long + 1);
                        }
                        if (object.setTeam != null) {
                            if (!$util.isObject(object.setTeam))
                                throw TypeError(".com.triforge.protocol.proto.LobbyCommand.setTeam: object expected");
                            message.setTeam = $root.com.triforge.protocol.proto.SetTeamAction.fromObject(object.setTeam, long + 1);
                        }
                        if (object.setSpawn != null) {
                            if (!$util.isObject(object.setSpawn))
                                throw TypeError(".com.triforge.protocol.proto.LobbyCommand.setSpawn: object expected");
                            message.setSpawn = $root.com.triforge.protocol.proto.SetSpawnAction.fromObject(object.setSpawn, long + 1);
                        }
                        if (object.setReady != null) {
                            if (!$util.isObject(object.setReady))
                                throw TypeError(".com.triforge.protocol.proto.LobbyCommand.setReady: object expected");
                            message.setReady = $root.com.triforge.protocol.proto.SetReadyAction.fromObject(object.setReady, long + 1);
                        }
                        if (object.startMatch != null) {
                            if (!$util.isObject(object.startMatch))
                                throw TypeError(".com.triforge.protocol.proto.LobbyCommand.startMatch: object expected");
                            message.startMatch = $root.com.triforge.protocol.proto.StartMatchAction.fromObject(object.startMatch, long + 1);
                        }
                        if (object.setTeamSetup != null) {
                            if (!$util.isObject(object.setTeamSetup))
                                throw TypeError(".com.triforge.protocol.proto.LobbyCommand.setTeamSetup: object expected");
                            message.setTeamSetup = $root.com.triforge.protocol.proto.SetTeamSetupAction.fromObject(object.setTeamSetup, long + 1);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a LobbyCommand message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @static
                     * @param {com.triforge.protocol.proto.LobbyCommand} message LobbyCommand
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    LobbyCommand.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (message.setName != null && Object.hasOwnProperty.call(message, "setName")) {
                            object.setName = $root.com.triforge.protocol.proto.SetNameAction.toObject(message.setName, options, q + 1);
                            if (options.oneofs)
                                object.action = "setName";
                        }
                        if (message.setTeam != null && Object.hasOwnProperty.call(message, "setTeam")) {
                            object.setTeam = $root.com.triforge.protocol.proto.SetTeamAction.toObject(message.setTeam, options, q + 1);
                            if (options.oneofs)
                                object.action = "setTeam";
                        }
                        if (message.setSpawn != null && Object.hasOwnProperty.call(message, "setSpawn")) {
                            object.setSpawn = $root.com.triforge.protocol.proto.SetSpawnAction.toObject(message.setSpawn, options, q + 1);
                            if (options.oneofs)
                                object.action = "setSpawn";
                        }
                        if (message.setReady != null && Object.hasOwnProperty.call(message, "setReady")) {
                            object.setReady = $root.com.triforge.protocol.proto.SetReadyAction.toObject(message.setReady, options, q + 1);
                            if (options.oneofs)
                                object.action = "setReady";
                        }
                        if (message.startMatch != null && Object.hasOwnProperty.call(message, "startMatch")) {
                            object.startMatch = $root.com.triforge.protocol.proto.StartMatchAction.toObject(message.startMatch, options, q + 1);
                            if (options.oneofs)
                                object.action = "startMatch";
                        }
                        if (message.setTeamSetup != null && Object.hasOwnProperty.call(message, "setTeamSetup")) {
                            object.setTeamSetup = $root.com.triforge.protocol.proto.SetTeamSetupAction.toObject(message.setTeamSetup, options, q + 1);
                            if (options.oneofs)
                                object.action = "setTeamSetup";
                        }
                        return object;
                    };

                    /**
                     * Converts this LobbyCommand to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    LobbyCommand.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for LobbyCommand
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.LobbyCommand
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    LobbyCommand.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.LobbyCommand";
                    };

                    return LobbyCommand;
                })();

                proto.MatchPhaseUpdate = (function() {

                    /**
                     * Properties of a MatchPhaseUpdate.
                     * @memberof com.triforge.protocol.proto
                     * @interface IMatchPhaseUpdate
                     * @property {com.triforge.protocol.proto.MatchPhase|null} [phase] MatchPhaseUpdate phase
                     * @property {number|null} [countdownSeconds] MatchPhaseUpdate countdownSeconds
                     * @property {number|Long|null} [matchRemainingMs] MatchPhaseUpdate matchRemainingMs
                     * @property {number|Long|null} [serverTick] MatchPhaseUpdate serverTick
                     * @property {number|null} [redHqHp] MatchPhaseUpdate redHqHp
                     * @property {number|null} [blueHqHp] MatchPhaseUpdate blueHqHp
                     */

                    /**
                     * Constructs a new MatchPhaseUpdate.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a MatchPhaseUpdate.
                     * @implements IMatchPhaseUpdate
                     * @constructor
                     * @param {com.triforge.protocol.proto.IMatchPhaseUpdate=} [properties] Properties to set
                     */
                    function MatchPhaseUpdate(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * MatchPhaseUpdate phase.
                     * @member {com.triforge.protocol.proto.MatchPhase} phase
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @instance
                     */
                    MatchPhaseUpdate.prototype.phase = 0;

                    /**
                     * MatchPhaseUpdate countdownSeconds.
                     * @member {number} countdownSeconds
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @instance
                     */
                    MatchPhaseUpdate.prototype.countdownSeconds = 0;

                    /**
                     * MatchPhaseUpdate matchRemainingMs.
                     * @member {number|Long} matchRemainingMs
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @instance
                     */
                    MatchPhaseUpdate.prototype.matchRemainingMs = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * MatchPhaseUpdate serverTick.
                     * @member {number|Long} serverTick
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @instance
                     */
                    MatchPhaseUpdate.prototype.serverTick = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * MatchPhaseUpdate redHqHp.
                     * @member {number} redHqHp
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @instance
                     */
                    MatchPhaseUpdate.prototype.redHqHp = 0;

                    /**
                     * MatchPhaseUpdate blueHqHp.
                     * @member {number} blueHqHp
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @instance
                     */
                    MatchPhaseUpdate.prototype.blueHqHp = 0;

                    /**
                     * Creates a new MatchPhaseUpdate instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @static
                     * @param {com.triforge.protocol.proto.IMatchPhaseUpdate=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.MatchPhaseUpdate} MatchPhaseUpdate instance
                     */
                    MatchPhaseUpdate.create = function create(properties) {
                        return new MatchPhaseUpdate(properties);
                    };

                    /**
                     * Encodes the specified MatchPhaseUpdate message. Does not implicitly {@link com.triforge.protocol.proto.MatchPhaseUpdate.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @static
                     * @param {com.triforge.protocol.proto.IMatchPhaseUpdate} message MatchPhaseUpdate message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MatchPhaseUpdate.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.phase != null && Object.hasOwnProperty.call(message, "phase"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.phase);
                        if (message.countdownSeconds != null && Object.hasOwnProperty.call(message, "countdownSeconds"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.countdownSeconds);
                        if (message.matchRemainingMs != null && Object.hasOwnProperty.call(message, "matchRemainingMs"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.matchRemainingMs);
                        if (message.serverTick != null && Object.hasOwnProperty.call(message, "serverTick"))
                            writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.serverTick);
                        if (message.redHqHp != null && Object.hasOwnProperty.call(message, "redHqHp"))
                            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.redHqHp);
                        if (message.blueHqHp != null && Object.hasOwnProperty.call(message, "blueHqHp"))
                            writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.blueHqHp);
                        return writer;
                    };

                    /**
                     * Encodes the specified MatchPhaseUpdate message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.MatchPhaseUpdate.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @static
                     * @param {com.triforge.protocol.proto.IMatchPhaseUpdate} message MatchPhaseUpdate message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MatchPhaseUpdate.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a MatchPhaseUpdate message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.MatchPhaseUpdate} MatchPhaseUpdate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MatchPhaseUpdate.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.MatchPhaseUpdate();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.phase = reader.int32();
                                    break;
                                }
                            case 2: {
                                    message.countdownSeconds = reader.uint32();
                                    break;
                                }
                            case 3: {
                                    message.matchRemainingMs = reader.uint64();
                                    break;
                                }
                            case 4: {
                                    message.serverTick = reader.uint64();
                                    break;
                                }
                            case 5: {
                                    message.redHqHp = reader.uint32();
                                    break;
                                }
                            case 6: {
                                    message.blueHqHp = reader.uint32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MatchPhaseUpdate message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.MatchPhaseUpdate} MatchPhaseUpdate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MatchPhaseUpdate.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MatchPhaseUpdate message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MatchPhaseUpdate.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.phase != null && Object.hasOwnProperty.call(message, "phase"))
                            switch (message.phase) {
                            default:
                                return "phase: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                                break;
                            }
                        if (message.countdownSeconds != null && Object.hasOwnProperty.call(message, "countdownSeconds"))
                            if (!$util.isInteger(message.countdownSeconds))
                                return "countdownSeconds: integer expected";
                        if (message.matchRemainingMs != null && Object.hasOwnProperty.call(message, "matchRemainingMs"))
                            if (!$util.isInteger(message.matchRemainingMs) && !(message.matchRemainingMs && $util.isInteger(message.matchRemainingMs.low) && $util.isInteger(message.matchRemainingMs.high)))
                                return "matchRemainingMs: integer|Long expected";
                        if (message.serverTick != null && Object.hasOwnProperty.call(message, "serverTick"))
                            if (!$util.isInteger(message.serverTick) && !(message.serverTick && $util.isInteger(message.serverTick.low) && $util.isInteger(message.serverTick.high)))
                                return "serverTick: integer|Long expected";
                        if (message.redHqHp != null && Object.hasOwnProperty.call(message, "redHqHp"))
                            if (!$util.isInteger(message.redHqHp))
                                return "redHqHp: integer expected";
                        if (message.blueHqHp != null && Object.hasOwnProperty.call(message, "blueHqHp"))
                            if (!$util.isInteger(message.blueHqHp))
                                return "blueHqHp: integer expected";
                        return null;
                    };

                    /**
                     * Creates a MatchPhaseUpdate message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.MatchPhaseUpdate} MatchPhaseUpdate
                     */
                    MatchPhaseUpdate.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.MatchPhaseUpdate)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.MatchPhaseUpdate: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.MatchPhaseUpdate();
                        switch (object.phase) {
                        default:
                            if (typeof object.phase === "number") {
                                message.phase = object.phase;
                                break;
                            }
                            break;
                        case "LOBBY":
                        case 0:
                            message.phase = 0;
                            break;
                        case "COUNTDOWN":
                        case 1:
                            message.phase = 1;
                            break;
                        case "PLAYING":
                        case 2:
                            message.phase = 2;
                            break;
                        case "ENDED":
                        case 3:
                            message.phase = 3;
                            break;
                        }
                        if (object.countdownSeconds != null)
                            message.countdownSeconds = object.countdownSeconds >>> 0;
                        if (object.matchRemainingMs != null)
                            if ($util.Long)
                                message.matchRemainingMs = $util.Long.fromValue(object.matchRemainingMs, true);
                            else if (typeof object.matchRemainingMs === "string")
                                message.matchRemainingMs = parseInt(object.matchRemainingMs, 10);
                            else if (typeof object.matchRemainingMs === "number")
                                message.matchRemainingMs = object.matchRemainingMs;
                            else if (typeof object.matchRemainingMs === "object")
                                message.matchRemainingMs = new $util.LongBits(object.matchRemainingMs.low >>> 0, object.matchRemainingMs.high >>> 0).toNumber(true);
                        if (object.serverTick != null)
                            if ($util.Long)
                                message.serverTick = $util.Long.fromValue(object.serverTick, true);
                            else if (typeof object.serverTick === "string")
                                message.serverTick = parseInt(object.serverTick, 10);
                            else if (typeof object.serverTick === "number")
                                message.serverTick = object.serverTick;
                            else if (typeof object.serverTick === "object")
                                message.serverTick = new $util.LongBits(object.serverTick.low >>> 0, object.serverTick.high >>> 0).toNumber(true);
                        if (object.redHqHp != null)
                            message.redHqHp = object.redHqHp >>> 0;
                        if (object.blueHqHp != null)
                            message.blueHqHp = object.blueHqHp >>> 0;
                        return message;
                    };

                    /**
                     * Creates a plain object from a MatchPhaseUpdate message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @static
                     * @param {com.triforge.protocol.proto.MatchPhaseUpdate} message MatchPhaseUpdate
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MatchPhaseUpdate.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            object.phase = options.enums === String ? "LOBBY" : 0;
                            object.countdownSeconds = 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.matchRemainingMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.matchRemainingMs = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.serverTick = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.serverTick = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            object.redHqHp = 0;
                            object.blueHqHp = 0;
                        }
                        if (message.phase != null && Object.hasOwnProperty.call(message, "phase"))
                            object.phase = options.enums === String ? $root.com.triforge.protocol.proto.MatchPhase[message.phase] === undefined ? message.phase : $root.com.triforge.protocol.proto.MatchPhase[message.phase] : message.phase;
                        if (message.countdownSeconds != null && Object.hasOwnProperty.call(message, "countdownSeconds"))
                            object.countdownSeconds = message.countdownSeconds;
                        if (message.matchRemainingMs != null && Object.hasOwnProperty.call(message, "matchRemainingMs"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.matchRemainingMs = typeof message.matchRemainingMs === "number" ? BigInt(message.matchRemainingMs) : $util.Long.fromBits(message.matchRemainingMs.low >>> 0, message.matchRemainingMs.high >>> 0, true).toBigInt();
                            else if (typeof message.matchRemainingMs === "number")
                                object.matchRemainingMs = options.longs === String ? String(message.matchRemainingMs) : message.matchRemainingMs;
                            else
                                object.matchRemainingMs = options.longs === String ? $util.Long.prototype.toString.call(message.matchRemainingMs) : options.longs === Number ? new $util.LongBits(message.matchRemainingMs.low >>> 0, message.matchRemainingMs.high >>> 0).toNumber(true) : message.matchRemainingMs;
                        if (message.serverTick != null && Object.hasOwnProperty.call(message, "serverTick"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.serverTick = typeof message.serverTick === "number" ? BigInt(message.serverTick) : $util.Long.fromBits(message.serverTick.low >>> 0, message.serverTick.high >>> 0, true).toBigInt();
                            else if (typeof message.serverTick === "number")
                                object.serverTick = options.longs === String ? String(message.serverTick) : message.serverTick;
                            else
                                object.serverTick = options.longs === String ? $util.Long.prototype.toString.call(message.serverTick) : options.longs === Number ? new $util.LongBits(message.serverTick.low >>> 0, message.serverTick.high >>> 0).toNumber(true) : message.serverTick;
                        if (message.redHqHp != null && Object.hasOwnProperty.call(message, "redHqHp"))
                            object.redHqHp = message.redHqHp;
                        if (message.blueHqHp != null && Object.hasOwnProperty.call(message, "blueHqHp"))
                            object.blueHqHp = message.blueHqHp;
                        return object;
                    };

                    /**
                     * Converts this MatchPhaseUpdate to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MatchPhaseUpdate.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for MatchPhaseUpdate
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.MatchPhaseUpdate
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    MatchPhaseUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.MatchPhaseUpdate";
                    };

                    return MatchPhaseUpdate;
                })();

                proto.PlayerMatchStats = (function() {

                    /**
                     * Properties of a PlayerMatchStats.
                     * @memberof com.triforge.protocol.proto
                     * @interface IPlayerMatchStats
                     * @property {number|Long|null} [playerId] PlayerMatchStats playerId
                     * @property {string|null} [displayName] PlayerMatchStats displayName
                     * @property {com.triforge.protocol.proto.Team|null} [team] PlayerMatchStats team
                     * @property {number|null} [kills] PlayerMatchStats kills
                     * @property {number|null} [deaths] PlayerMatchStats deaths
                     * @property {number|null} [assists] PlayerMatchStats assists
                     * @property {number|null} [damageDealt] PlayerMatchStats damageDealt
                     * @property {number|null} [damageTaken] PlayerMatchStats damageTaken
                     * @property {number|null} [shotsFired] PlayerMatchStats shotsFired
                     * @property {number|null} [shotsHit] PlayerMatchStats shotsHit
                     */

                    /**
                     * Constructs a new PlayerMatchStats.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a PlayerMatchStats.
                     * @implements IPlayerMatchStats
                     * @constructor
                     * @param {com.triforge.protocol.proto.IPlayerMatchStats=} [properties] Properties to set
                     */
                    function PlayerMatchStats(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * PlayerMatchStats playerId.
                     * @member {number|Long} playerId
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @instance
                     */
                    PlayerMatchStats.prototype.playerId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * PlayerMatchStats displayName.
                     * @member {string} displayName
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @instance
                     */
                    PlayerMatchStats.prototype.displayName = "";

                    /**
                     * PlayerMatchStats team.
                     * @member {com.triforge.protocol.proto.Team} team
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @instance
                     */
                    PlayerMatchStats.prototype.team = 0;

                    /**
                     * PlayerMatchStats kills.
                     * @member {number} kills
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @instance
                     */
                    PlayerMatchStats.prototype.kills = 0;

                    /**
                     * PlayerMatchStats deaths.
                     * @member {number} deaths
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @instance
                     */
                    PlayerMatchStats.prototype.deaths = 0;

                    /**
                     * PlayerMatchStats assists.
                     * @member {number} assists
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @instance
                     */
                    PlayerMatchStats.prototype.assists = 0;

                    /**
                     * PlayerMatchStats damageDealt.
                     * @member {number} damageDealt
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @instance
                     */
                    PlayerMatchStats.prototype.damageDealt = 0;

                    /**
                     * PlayerMatchStats damageTaken.
                     * @member {number} damageTaken
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @instance
                     */
                    PlayerMatchStats.prototype.damageTaken = 0;

                    /**
                     * PlayerMatchStats shotsFired.
                     * @member {number} shotsFired
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @instance
                     */
                    PlayerMatchStats.prototype.shotsFired = 0;

                    /**
                     * PlayerMatchStats shotsHit.
                     * @member {number} shotsHit
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @instance
                     */
                    PlayerMatchStats.prototype.shotsHit = 0;

                    /**
                     * Creates a new PlayerMatchStats instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @static
                     * @param {com.triforge.protocol.proto.IPlayerMatchStats=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.PlayerMatchStats} PlayerMatchStats instance
                     */
                    PlayerMatchStats.create = function create(properties) {
                        return new PlayerMatchStats(properties);
                    };

                    /**
                     * Encodes the specified PlayerMatchStats message. Does not implicitly {@link com.triforge.protocol.proto.PlayerMatchStats.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @static
                     * @param {com.triforge.protocol.proto.IPlayerMatchStats} message PlayerMatchStats message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PlayerMatchStats.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.playerId);
                        if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.displayName);
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.team);
                        if (message.kills != null && Object.hasOwnProperty.call(message, "kills"))
                            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.kills);
                        if (message.deaths != null && Object.hasOwnProperty.call(message, "deaths"))
                            writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.deaths);
                        if (message.assists != null && Object.hasOwnProperty.call(message, "assists"))
                            writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.assists);
                        if (message.damageDealt != null && Object.hasOwnProperty.call(message, "damageDealt"))
                            writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.damageDealt);
                        if (message.damageTaken != null && Object.hasOwnProperty.call(message, "damageTaken"))
                            writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.damageTaken);
                        if (message.shotsFired != null && Object.hasOwnProperty.call(message, "shotsFired"))
                            writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.shotsFired);
                        if (message.shotsHit != null && Object.hasOwnProperty.call(message, "shotsHit"))
                            writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.shotsHit);
                        return writer;
                    };

                    /**
                     * Encodes the specified PlayerMatchStats message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.PlayerMatchStats.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @static
                     * @param {com.triforge.protocol.proto.IPlayerMatchStats} message PlayerMatchStats message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PlayerMatchStats.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a PlayerMatchStats message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.PlayerMatchStats} PlayerMatchStats
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PlayerMatchStats.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.PlayerMatchStats();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.playerId = reader.uint64();
                                    break;
                                }
                            case 2: {
                                    message.displayName = reader.string();
                                    break;
                                }
                            case 3: {
                                    message.team = reader.int32();
                                    break;
                                }
                            case 4: {
                                    message.kills = reader.uint32();
                                    break;
                                }
                            case 5: {
                                    message.deaths = reader.uint32();
                                    break;
                                }
                            case 6: {
                                    message.assists = reader.uint32();
                                    break;
                                }
                            case 7: {
                                    message.damageDealt = reader.uint32();
                                    break;
                                }
                            case 8: {
                                    message.damageTaken = reader.uint32();
                                    break;
                                }
                            case 9: {
                                    message.shotsFired = reader.uint32();
                                    break;
                                }
                            case 10: {
                                    message.shotsHit = reader.uint32();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a PlayerMatchStats message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.PlayerMatchStats} PlayerMatchStats
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PlayerMatchStats.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a PlayerMatchStats message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    PlayerMatchStats.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            if (!$util.isInteger(message.playerId) && !(message.playerId && $util.isInteger(message.playerId.low) && $util.isInteger(message.playerId.high)))
                                return "playerId: integer|Long expected";
                        if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                            if (!$util.isString(message.displayName))
                                return "displayName: string expected";
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            switch (message.team) {
                            default:
                                return "team: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                                break;
                            }
                        if (message.kills != null && Object.hasOwnProperty.call(message, "kills"))
                            if (!$util.isInteger(message.kills))
                                return "kills: integer expected";
                        if (message.deaths != null && Object.hasOwnProperty.call(message, "deaths"))
                            if (!$util.isInteger(message.deaths))
                                return "deaths: integer expected";
                        if (message.assists != null && Object.hasOwnProperty.call(message, "assists"))
                            if (!$util.isInteger(message.assists))
                                return "assists: integer expected";
                        if (message.damageDealt != null && Object.hasOwnProperty.call(message, "damageDealt"))
                            if (!$util.isInteger(message.damageDealt))
                                return "damageDealt: integer expected";
                        if (message.damageTaken != null && Object.hasOwnProperty.call(message, "damageTaken"))
                            if (!$util.isInteger(message.damageTaken))
                                return "damageTaken: integer expected";
                        if (message.shotsFired != null && Object.hasOwnProperty.call(message, "shotsFired"))
                            if (!$util.isInteger(message.shotsFired))
                                return "shotsFired: integer expected";
                        if (message.shotsHit != null && Object.hasOwnProperty.call(message, "shotsHit"))
                            if (!$util.isInteger(message.shotsHit))
                                return "shotsHit: integer expected";
                        return null;
                    };

                    /**
                     * Creates a PlayerMatchStats message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.PlayerMatchStats} PlayerMatchStats
                     */
                    PlayerMatchStats.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.PlayerMatchStats)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.PlayerMatchStats: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.PlayerMatchStats();
                        if (object.playerId != null)
                            if ($util.Long)
                                message.playerId = $util.Long.fromValue(object.playerId, true);
                            else if (typeof object.playerId === "string")
                                message.playerId = parseInt(object.playerId, 10);
                            else if (typeof object.playerId === "number")
                                message.playerId = object.playerId;
                            else if (typeof object.playerId === "object")
                                message.playerId = new $util.LongBits(object.playerId.low >>> 0, object.playerId.high >>> 0).toNumber(true);
                        if (object.displayName != null)
                            message.displayName = String(object.displayName);
                        switch (object.team) {
                        default:
                            if (typeof object.team === "number") {
                                message.team = object.team;
                                break;
                            }
                            break;
                        case "TEAM_NONE":
                        case 0:
                            message.team = 0;
                            break;
                        case "TEAM_RED":
                        case 1:
                            message.team = 1;
                            break;
                        case "TEAM_BLUE":
                        case 2:
                            message.team = 2;
                            break;
                        }
                        if (object.kills != null)
                            message.kills = object.kills >>> 0;
                        if (object.deaths != null)
                            message.deaths = object.deaths >>> 0;
                        if (object.assists != null)
                            message.assists = object.assists >>> 0;
                        if (object.damageDealt != null)
                            message.damageDealt = object.damageDealt >>> 0;
                        if (object.damageTaken != null)
                            message.damageTaken = object.damageTaken >>> 0;
                        if (object.shotsFired != null)
                            message.shotsFired = object.shotsFired >>> 0;
                        if (object.shotsHit != null)
                            message.shotsHit = object.shotsHit >>> 0;
                        return message;
                    };

                    /**
                     * Creates a plain object from a PlayerMatchStats message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @static
                     * @param {com.triforge.protocol.proto.PlayerMatchStats} message PlayerMatchStats
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    PlayerMatchStats.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.defaults) {
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.playerId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.playerId = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                            object.displayName = "";
                            object.team = options.enums === String ? "TEAM_NONE" : 0;
                            object.kills = 0;
                            object.deaths = 0;
                            object.assists = 0;
                            object.damageDealt = 0;
                            object.damageTaken = 0;
                            object.shotsFired = 0;
                            object.shotsHit = 0;
                        }
                        if (message.playerId != null && Object.hasOwnProperty.call(message, "playerId"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.playerId = typeof message.playerId === "number" ? BigInt(message.playerId) : $util.Long.fromBits(message.playerId.low >>> 0, message.playerId.high >>> 0, true).toBigInt();
                            else if (typeof message.playerId === "number")
                                object.playerId = options.longs === String ? String(message.playerId) : message.playerId;
                            else
                                object.playerId = options.longs === String ? $util.Long.prototype.toString.call(message.playerId) : options.longs === Number ? new $util.LongBits(message.playerId.low >>> 0, message.playerId.high >>> 0).toNumber(true) : message.playerId;
                        if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                            object.displayName = message.displayName;
                        if (message.team != null && Object.hasOwnProperty.call(message, "team"))
                            object.team = options.enums === String ? $root.com.triforge.protocol.proto.Team[message.team] === undefined ? message.team : $root.com.triforge.protocol.proto.Team[message.team] : message.team;
                        if (message.kills != null && Object.hasOwnProperty.call(message, "kills"))
                            object.kills = message.kills;
                        if (message.deaths != null && Object.hasOwnProperty.call(message, "deaths"))
                            object.deaths = message.deaths;
                        if (message.assists != null && Object.hasOwnProperty.call(message, "assists"))
                            object.assists = message.assists;
                        if (message.damageDealt != null && Object.hasOwnProperty.call(message, "damageDealt"))
                            object.damageDealt = message.damageDealt;
                        if (message.damageTaken != null && Object.hasOwnProperty.call(message, "damageTaken"))
                            object.damageTaken = message.damageTaken;
                        if (message.shotsFired != null && Object.hasOwnProperty.call(message, "shotsFired"))
                            object.shotsFired = message.shotsFired;
                        if (message.shotsHit != null && Object.hasOwnProperty.call(message, "shotsHit"))
                            object.shotsHit = message.shotsHit;
                        return object;
                    };

                    /**
                     * Converts this PlayerMatchStats to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    PlayerMatchStats.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for PlayerMatchStats
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.PlayerMatchStats
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    PlayerMatchStats.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.PlayerMatchStats";
                    };

                    return PlayerMatchStats;
                })();

                proto.MatchResult = (function() {

                    /**
                     * Properties of a MatchResult.
                     * @memberof com.triforge.protocol.proto
                     * @interface IMatchResult
                     * @property {com.triforge.protocol.proto.Team|null} [winningTeam] MatchResult winningTeam
                     * @property {number|null} [redScore] MatchResult redScore
                     * @property {number|null} [blueScore] MatchResult blueScore
                     * @property {Array.<com.triforge.protocol.proto.IPlayerMatchStats>|null} [stats] MatchResult stats
                     * @property {number|Long|null} [matchDurationMs] MatchResult matchDurationMs
                     */

                    /**
                     * Constructs a new MatchResult.
                     * @memberof com.triforge.protocol.proto
                     * @classdesc Represents a MatchResult.
                     * @implements IMatchResult
                     * @constructor
                     * @param {com.triforge.protocol.proto.IMatchResult=} [properties] Properties to set
                     */
                    function MatchResult(properties) {
                        this.stats = [];
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * MatchResult winningTeam.
                     * @member {com.triforge.protocol.proto.Team} winningTeam
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @instance
                     */
                    MatchResult.prototype.winningTeam = 0;

                    /**
                     * MatchResult redScore.
                     * @member {number} redScore
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @instance
                     */
                    MatchResult.prototype.redScore = 0;

                    /**
                     * MatchResult blueScore.
                     * @member {number} blueScore
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @instance
                     */
                    MatchResult.prototype.blueScore = 0;

                    /**
                     * MatchResult stats.
                     * @member {Array.<com.triforge.protocol.proto.IPlayerMatchStats>} stats
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @instance
                     */
                    MatchResult.prototype.stats = $util.emptyArray;

                    /**
                     * MatchResult matchDurationMs.
                     * @member {number|Long} matchDurationMs
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @instance
                     */
                    MatchResult.prototype.matchDurationMs = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * Creates a new MatchResult instance using the specified properties.
                     * @function create
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @static
                     * @param {com.triforge.protocol.proto.IMatchResult=} [properties] Properties to set
                     * @returns {com.triforge.protocol.proto.MatchResult} MatchResult instance
                     */
                    MatchResult.create = function create(properties) {
                        return new MatchResult(properties);
                    };

                    /**
                     * Encodes the specified MatchResult message. Does not implicitly {@link com.triforge.protocol.proto.MatchResult.verify|verify} messages.
                     * @function encode
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @static
                     * @param {com.triforge.protocol.proto.IMatchResult} message MatchResult message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MatchResult.encode = function encode(message, writer, q) {
                        if (!writer)
                            writer = $Writer.create();
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        if (message.winningTeam != null && Object.hasOwnProperty.call(message, "winningTeam"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.winningTeam);
                        if (message.redScore != null && Object.hasOwnProperty.call(message, "redScore"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.redScore);
                        if (message.blueScore != null && Object.hasOwnProperty.call(message, "blueScore"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.blueScore);
                        if (message.stats != null && message.stats.length)
                            for (let i = 0; i < message.stats.length; ++i)
                                $root.com.triforge.protocol.proto.PlayerMatchStats.encode(message.stats[i], writer.uint32(/* id 4, wireType 2 =*/34).fork(), q + 1).ldelim();
                        if (message.matchDurationMs != null && Object.hasOwnProperty.call(message, "matchDurationMs"))
                            writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.matchDurationMs);
                        return writer;
                    };

                    /**
                     * Encodes the specified MatchResult message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.MatchResult.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @static
                     * @param {com.triforge.protocol.proto.IMatchResult} message MatchResult message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    MatchResult.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                    };

                    /**
                     * Decodes a MatchResult message from the specified reader or buffer.
                     * @function decode
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {com.triforge.protocol.proto.MatchResult} MatchResult
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MatchResult.decode = function decode(reader, length, error, long) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        if (long === undefined)
                            long = 0;
                        if (long > $Reader.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.triforge.protocol.proto.MatchResult();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            if (tag === error)
                                break;
                            switch (tag >>> 3) {
                            case 1: {
                                    message.winningTeam = reader.int32();
                                    break;
                                }
                            case 2: {
                                    message.redScore = reader.uint32();
                                    break;
                                }
                            case 3: {
                                    message.blueScore = reader.uint32();
                                    break;
                                }
                            case 4: {
                                    if (!(message.stats && message.stats.length))
                                        message.stats = [];
                                    message.stats.push($root.com.triforge.protocol.proto.PlayerMatchStats.decode(reader, reader.uint32(), undefined, long + 1));
                                    break;
                                }
                            case 5: {
                                    message.matchDurationMs = reader.uint64();
                                    break;
                                }
                            default:
                                reader.skipType(tag & 7, long);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a MatchResult message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {com.triforge.protocol.proto.MatchResult} MatchResult
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    MatchResult.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a MatchResult message.
                     * @function verify
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    MatchResult.verify = function verify(message, long) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            return "maximum nesting depth exceeded";
                        if (message.winningTeam != null && Object.hasOwnProperty.call(message, "winningTeam"))
                            switch (message.winningTeam) {
                            default:
                                return "winningTeam: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                                break;
                            }
                        if (message.redScore != null && Object.hasOwnProperty.call(message, "redScore"))
                            if (!$util.isInteger(message.redScore))
                                return "redScore: integer expected";
                        if (message.blueScore != null && Object.hasOwnProperty.call(message, "blueScore"))
                            if (!$util.isInteger(message.blueScore))
                                return "blueScore: integer expected";
                        if (message.stats != null && Object.hasOwnProperty.call(message, "stats")) {
                            if (!Array.isArray(message.stats))
                                return "stats: array expected";
                            for (let i = 0; i < message.stats.length; ++i) {
                                let error = $root.com.triforge.protocol.proto.PlayerMatchStats.verify(message.stats[i], long + 1);
                                if (error)
                                    return "stats." + error;
                            }
                        }
                        if (message.matchDurationMs != null && Object.hasOwnProperty.call(message, "matchDurationMs"))
                            if (!$util.isInteger(message.matchDurationMs) && !(message.matchDurationMs && $util.isInteger(message.matchDurationMs.low) && $util.isInteger(message.matchDurationMs.high)))
                                return "matchDurationMs: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates a MatchResult message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {com.triforge.protocol.proto.MatchResult} MatchResult
                     */
                    MatchResult.fromObject = function fromObject(object, long) {
                        if (object instanceof $root.com.triforge.protocol.proto.MatchResult)
                            return object;
                        if (!$util.isObject(object))
                            throw TypeError(".com.triforge.protocol.proto.MatchResult: object expected");
                        if (long === undefined)
                            long = 0;
                        if (long > $util.recursionLimit)
                            throw Error("maximum nesting depth exceeded");
                        let message = new $root.com.triforge.protocol.proto.MatchResult();
                        switch (object.winningTeam) {
                        default:
                            if (typeof object.winningTeam === "number") {
                                message.winningTeam = object.winningTeam;
                                break;
                            }
                            break;
                        case "TEAM_NONE":
                        case 0:
                            message.winningTeam = 0;
                            break;
                        case "TEAM_RED":
                        case 1:
                            message.winningTeam = 1;
                            break;
                        case "TEAM_BLUE":
                        case 2:
                            message.winningTeam = 2;
                            break;
                        }
                        if (object.redScore != null)
                            message.redScore = object.redScore >>> 0;
                        if (object.blueScore != null)
                            message.blueScore = object.blueScore >>> 0;
                        if (object.stats) {
                            if (!Array.isArray(object.stats))
                                throw TypeError(".com.triforge.protocol.proto.MatchResult.stats: array expected");
                            message.stats = [];
                            for (let i = 0; i < object.stats.length; ++i) {
                                if (!$util.isObject(object.stats[i]))
                                    throw TypeError(".com.triforge.protocol.proto.MatchResult.stats: object expected");
                                message.stats[i] = $root.com.triforge.protocol.proto.PlayerMatchStats.fromObject(object.stats[i], long + 1);
                            }
                        }
                        if (object.matchDurationMs != null)
                            if ($util.Long)
                                message.matchDurationMs = $util.Long.fromValue(object.matchDurationMs, true);
                            else if (typeof object.matchDurationMs === "string")
                                message.matchDurationMs = parseInt(object.matchDurationMs, 10);
                            else if (typeof object.matchDurationMs === "number")
                                message.matchDurationMs = object.matchDurationMs;
                            else if (typeof object.matchDurationMs === "object")
                                message.matchDurationMs = new $util.LongBits(object.matchDurationMs.low >>> 0, object.matchDurationMs.high >>> 0).toNumber(true);
                        return message;
                    };

                    /**
                     * Creates a plain object from a MatchResult message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @static
                     * @param {com.triforge.protocol.proto.MatchResult} message MatchResult
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    MatchResult.toObject = function toObject(message, options, q) {
                        if (!options)
                            options = {};
                        if (q === undefined)
                            q = 0;
                        if (q > $util.recursionLimit)
                            throw Error("max depth exceeded");
                        let object = {};
                        if (options.arrays || options.defaults)
                            object.stats = [];
                        if (options.defaults) {
                            object.winningTeam = options.enums === String ? "TEAM_NONE" : 0;
                            object.redScore = 0;
                            object.blueScore = 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.matchDurationMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : typeof BigInt !== "undefined" && options.longs === BigInt ? long.toBigInt() : long;
                            } else
                                object.matchDurationMs = options.longs === String ? "0" : typeof BigInt !== "undefined" && options.longs === BigInt ? BigInt("0") : 0;
                        }
                        if (message.winningTeam != null && Object.hasOwnProperty.call(message, "winningTeam"))
                            object.winningTeam = options.enums === String ? $root.com.triforge.protocol.proto.Team[message.winningTeam] === undefined ? message.winningTeam : $root.com.triforge.protocol.proto.Team[message.winningTeam] : message.winningTeam;
                        if (message.redScore != null && Object.hasOwnProperty.call(message, "redScore"))
                            object.redScore = message.redScore;
                        if (message.blueScore != null && Object.hasOwnProperty.call(message, "blueScore"))
                            object.blueScore = message.blueScore;
                        if (message.stats && message.stats.length) {
                            object.stats = [];
                            for (let j = 0; j < message.stats.length; ++j)
                                object.stats[j] = $root.com.triforge.protocol.proto.PlayerMatchStats.toObject(message.stats[j], options, q + 1);
                        }
                        if (message.matchDurationMs != null && Object.hasOwnProperty.call(message, "matchDurationMs"))
                            if (typeof BigInt !== "undefined" && options.longs === BigInt)
                                object.matchDurationMs = typeof message.matchDurationMs === "number" ? BigInt(message.matchDurationMs) : $util.Long.fromBits(message.matchDurationMs.low >>> 0, message.matchDurationMs.high >>> 0, true).toBigInt();
                            else if (typeof message.matchDurationMs === "number")
                                object.matchDurationMs = options.longs === String ? String(message.matchDurationMs) : message.matchDurationMs;
                            else
                                object.matchDurationMs = options.longs === String ? $util.Long.prototype.toString.call(message.matchDurationMs) : options.longs === Number ? new $util.LongBits(message.matchDurationMs.low >>> 0, message.matchDurationMs.high >>> 0).toNumber(true) : message.matchDurationMs;
                        return object;
                    };

                    /**
                     * Converts this MatchResult to JSON.
                     * @function toJSON
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    MatchResult.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for MatchResult
                     * @function getTypeUrl
                     * @memberof com.triforge.protocol.proto.MatchResult
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    MatchResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/com.triforge.protocol.proto.MatchResult";
                    };

                    return MatchResult;
                })();

                return proto;
            })();

            return protocol;
        })();

        return triforge;
    })();

    return com;
})();

export { $root as default };
