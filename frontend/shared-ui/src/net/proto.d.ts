import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace com. */
export namespace com {

    /** Namespace triforge. */
    namespace triforge {

        /** Namespace protocol. */
        namespace protocol {

            /** Namespace proto. */
            namespace proto {

                /** Properties of a MessageEnvelope. */
                interface IMessageEnvelope {

                    /** MessageEnvelope roomId */
                    roomId?: (string|null);

                    /** MessageEnvelope tick */
                    tick?: (number|Long|null);

                    /** MessageEnvelope msgId */
                    msgId?: (number|Long|null);

                    /** MessageEnvelope clientSeq */
                    clientSeq?: (number|Long|null);

                    /** MessageEnvelope serverSeq */
                    serverSeq?: (number|Long|null);

                    /** MessageEnvelope schemaVersion */
                    schemaVersion?: (string|null);

                    /** MessageEnvelope payload */
                    payload?: (Uint8Array|null);
                }

                /** Represents a MessageEnvelope. */
                class MessageEnvelope implements IMessageEnvelope {

                    /**
                     * Constructs a new MessageEnvelope.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IMessageEnvelope);

                    /** MessageEnvelope roomId. */
                    public roomId: string;

                    /** MessageEnvelope tick. */
                    public tick: (number|Long);

                    /** MessageEnvelope msgId. */
                    public msgId: (number|Long);

                    /** MessageEnvelope clientSeq. */
                    public clientSeq: (number|Long);

                    /** MessageEnvelope serverSeq. */
                    public serverSeq: (number|Long);

                    /** MessageEnvelope schemaVersion. */
                    public schemaVersion: string;

                    /** MessageEnvelope payload. */
                    public payload: Uint8Array;

                    /**
                     * Creates a new MessageEnvelope instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns MessageEnvelope instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IMessageEnvelope): com.triforge.protocol.proto.MessageEnvelope;

                    /**
                     * Encodes the specified MessageEnvelope message. Does not implicitly {@link com.triforge.protocol.proto.MessageEnvelope.verify|verify} messages.
                     * @param message MessageEnvelope message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IMessageEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified MessageEnvelope message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.MessageEnvelope.verify|verify} messages.
                     * @param message MessageEnvelope message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IMessageEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a MessageEnvelope message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns MessageEnvelope
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.MessageEnvelope;

                    /**
                     * Decodes a MessageEnvelope message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns MessageEnvelope
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.MessageEnvelope;

                    /**
                     * Verifies a MessageEnvelope message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a MessageEnvelope message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns MessageEnvelope
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.MessageEnvelope;

                    /**
                     * Creates a plain object from a MessageEnvelope message. Also converts values to other types if specified.
                     * @param message MessageEnvelope
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.MessageEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this MessageEnvelope to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for MessageEnvelope
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a GameMessage. */
                interface IGameMessage {

                    /** GameMessage joinRequest */
                    joinRequest?: (com.triforge.protocol.proto.IJoinRequest|null);

                    /** GameMessage joinResponse */
                    joinResponse?: (com.triforge.protocol.proto.IJoinResponse|null);

                    /** GameMessage fullSnapshot */
                    fullSnapshot?: (com.triforge.protocol.proto.IFullSnapshot|null);

                    /** GameMessage deltaSnapshot */
                    deltaSnapshot?: (com.triforge.protocol.proto.IDeltaSnapshot|null);

                    /** GameMessage inputCommand */
                    inputCommand?: (com.triforge.protocol.proto.IInputCommand|null);

                    /** GameMessage gameEvent */
                    gameEvent?: (com.triforge.protocol.proto.IGameEvent|null);

                    /** GameMessage lobbyCommand */
                    lobbyCommand?: (com.triforge.protocol.proto.ILobbyCommand|null);

                    /** GameMessage roomLobbySnapshot */
                    roomLobbySnapshot?: (com.triforge.protocol.proto.IRoomLobbySnapshot|null);

                    /** GameMessage matchPhaseUpdate */
                    matchPhaseUpdate?: (com.triforge.protocol.proto.IMatchPhaseUpdate|null);

                    /** GameMessage matchResult */
                    matchResult?: (com.triforge.protocol.proto.IMatchResult|null);

                    /** GameMessage mapSnapshot */
                    mapSnapshot?: (com.triforge.protocol.proto.IMapSnapshot|null);
                }

                /** Represents a GameMessage. */
                class GameMessage implements IGameMessage {

                    /**
                     * Constructs a new GameMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IGameMessage);

                    /** GameMessage joinRequest. */
                    public joinRequest?: (com.triforge.protocol.proto.IJoinRequest|null);

                    /** GameMessage joinResponse. */
                    public joinResponse?: (com.triforge.protocol.proto.IJoinResponse|null);

                    /** GameMessage fullSnapshot. */
                    public fullSnapshot?: (com.triforge.protocol.proto.IFullSnapshot|null);

                    /** GameMessage deltaSnapshot. */
                    public deltaSnapshot?: (com.triforge.protocol.proto.IDeltaSnapshot|null);

                    /** GameMessage inputCommand. */
                    public inputCommand?: (com.triforge.protocol.proto.IInputCommand|null);

                    /** GameMessage gameEvent. */
                    public gameEvent?: (com.triforge.protocol.proto.IGameEvent|null);

                    /** GameMessage lobbyCommand. */
                    public lobbyCommand?: (com.triforge.protocol.proto.ILobbyCommand|null);

                    /** GameMessage roomLobbySnapshot. */
                    public roomLobbySnapshot?: (com.triforge.protocol.proto.IRoomLobbySnapshot|null);

                    /** GameMessage matchPhaseUpdate. */
                    public matchPhaseUpdate?: (com.triforge.protocol.proto.IMatchPhaseUpdate|null);

                    /** GameMessage matchResult. */
                    public matchResult?: (com.triforge.protocol.proto.IMatchResult|null);

                    /** GameMessage mapSnapshot. */
                    public mapSnapshot?: (com.triforge.protocol.proto.IMapSnapshot|null);

                    /** GameMessage content. */
                    public content?: ("joinRequest"|"joinResponse"|"fullSnapshot"|"deltaSnapshot"|"inputCommand"|"gameEvent"|"lobbyCommand"|"roomLobbySnapshot"|"matchPhaseUpdate"|"matchResult"|"mapSnapshot");

                    /**
                     * Creates a new GameMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GameMessage instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IGameMessage): com.triforge.protocol.proto.GameMessage;

                    /**
                     * Encodes the specified GameMessage message. Does not implicitly {@link com.triforge.protocol.proto.GameMessage.verify|verify} messages.
                     * @param message GameMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IGameMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GameMessage message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.GameMessage.verify|verify} messages.
                     * @param message GameMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IGameMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GameMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GameMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.GameMessage;

                    /**
                     * Decodes a GameMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GameMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.GameMessage;

                    /**
                     * Verifies a GameMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GameMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GameMessage
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.GameMessage;

                    /**
                     * Creates a plain object from a GameMessage message. Also converts values to other types if specified.
                     * @param message GameMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.GameMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GameMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for GameMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a JoinRequest. */
                interface IJoinRequest {

                    /** JoinRequest playerName */
                    playerName?: (string|null);
                }

                /** Represents a JoinRequest. */
                class JoinRequest implements IJoinRequest {

                    /**
                     * Constructs a new JoinRequest.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IJoinRequest);

                    /** JoinRequest playerName. */
                    public playerName: string;

                    /**
                     * Creates a new JoinRequest instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns JoinRequest instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IJoinRequest): com.triforge.protocol.proto.JoinRequest;

                    /**
                     * Encodes the specified JoinRequest message. Does not implicitly {@link com.triforge.protocol.proto.JoinRequest.verify|verify} messages.
                     * @param message JoinRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IJoinRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified JoinRequest message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.JoinRequest.verify|verify} messages.
                     * @param message JoinRequest message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IJoinRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a JoinRequest message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns JoinRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.JoinRequest;

                    /**
                     * Decodes a JoinRequest message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns JoinRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.JoinRequest;

                    /**
                     * Verifies a JoinRequest message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a JoinRequest message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns JoinRequest
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.JoinRequest;

                    /**
                     * Creates a plain object from a JoinRequest message. Also converts values to other types if specified.
                     * @param message JoinRequest
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.JoinRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this JoinRequest to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for JoinRequest
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a JoinResponse. */
                interface IJoinResponse {

                    /** JoinResponse playerId */
                    playerId?: (number|Long|null);

                    /** JoinResponse entityId */
                    entityId?: (number|Long|null);

                    /** JoinResponse initialSnapshot */
                    initialSnapshot?: (com.triforge.protocol.proto.IFullSnapshot|null);

                    /** JoinResponse map */
                    map?: (com.triforge.protocol.proto.IMapSnapshot|null);

                    /** JoinResponse lobby */
                    lobby?: (com.triforge.protocol.proto.IRoomLobbySnapshot|null);
                }

                /** Represents a JoinResponse. */
                class JoinResponse implements IJoinResponse {

                    /**
                     * Constructs a new JoinResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IJoinResponse);

                    /** JoinResponse playerId. */
                    public playerId: (number|Long);

                    /** JoinResponse entityId. */
                    public entityId: (number|Long);

                    /** JoinResponse initialSnapshot. */
                    public initialSnapshot?: (com.triforge.protocol.proto.IFullSnapshot|null);

                    /** JoinResponse map. */
                    public map?: (com.triforge.protocol.proto.IMapSnapshot|null);

                    /** JoinResponse lobby. */
                    public lobby?: (com.triforge.protocol.proto.IRoomLobbySnapshot|null);

                    /**
                     * Creates a new JoinResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns JoinResponse instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IJoinResponse): com.triforge.protocol.proto.JoinResponse;

                    /**
                     * Encodes the specified JoinResponse message. Does not implicitly {@link com.triforge.protocol.proto.JoinResponse.verify|verify} messages.
                     * @param message JoinResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IJoinResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified JoinResponse message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.JoinResponse.verify|verify} messages.
                     * @param message JoinResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IJoinResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a JoinResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns JoinResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.JoinResponse;

                    /**
                     * Decodes a JoinResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns JoinResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.JoinResponse;

                    /**
                     * Verifies a JoinResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a JoinResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns JoinResponse
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.JoinResponse;

                    /**
                     * Creates a plain object from a JoinResponse message. Also converts values to other types if specified.
                     * @param message JoinResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.JoinResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this JoinResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for JoinResponse
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Direction enum. */
                enum Direction {
                    UP = 0,
                    DOWN = 1,
                    LEFT = 2,
                    RIGHT = 3
                }

                /** TileType enum. */
                enum TileType {
                    EMPTY = 0,
                    BRICK = 1,
                    STEEL = 2,
                    WATER = 3,
                    TREE = 4,
                    WALL = 5,
                    COVER = 6,
                    HQ = 7
                }

                /** FogCellState enum. */
                enum FogCellState {
                    UNKNOWN = 0,
                    SEEN = 1,
                    VISIBLE = 2
                }

                /** Properties of a FogSnapshot. */
                interface IFogSnapshot {

                    /** FogSnapshot width */
                    width?: (number|null);

                    /** FogSnapshot height */
                    height?: (number|null);

                    /** FogSnapshot cells */
                    cells?: (Uint8Array|null);
                }

                /** Represents a FogSnapshot. */
                class FogSnapshot implements IFogSnapshot {

                    /**
                     * Constructs a new FogSnapshot.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IFogSnapshot);

                    /** FogSnapshot width. */
                    public width: number;

                    /** FogSnapshot height. */
                    public height: number;

                    /** FogSnapshot cells. */
                    public cells: Uint8Array;

                    /**
                     * Creates a new FogSnapshot instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns FogSnapshot instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IFogSnapshot): com.triforge.protocol.proto.FogSnapshot;

                    /**
                     * Encodes the specified FogSnapshot message. Does not implicitly {@link com.triforge.protocol.proto.FogSnapshot.verify|verify} messages.
                     * @param message FogSnapshot message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IFogSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified FogSnapshot message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.FogSnapshot.verify|verify} messages.
                     * @param message FogSnapshot message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IFogSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a FogSnapshot message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns FogSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.FogSnapshot;

                    /**
                     * Decodes a FogSnapshot message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns FogSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.FogSnapshot;

                    /**
                     * Verifies a FogSnapshot message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a FogSnapshot message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns FogSnapshot
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.FogSnapshot;

                    /**
                     * Creates a plain object from a FogSnapshot message. Also converts values to other types if specified.
                     * @param message FogSnapshot
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.FogSnapshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this FogSnapshot to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for FogSnapshot
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** GameEventType enum. */
                enum GameEventType {
                    PLAYER_HIT = 0,
                    PLAYER_DEATH = 1,
                    PLAYER_RESPAWN = 2,
                    MATCH_COUNTDOWN = 3,
                    MATCH_STARTED = 4,
                    MATCH_ENDED = 5,
                    LOBBY_UPDATED = 6,
                    HQ_DAMAGED = 7,
                    HQ_DESTROYED = 8
                }

                /** MatchPhase enum. */
                enum MatchPhase {
                    LOBBY = 0,
                    COUNTDOWN = 1,
                    PLAYING = 2,
                    ENDED = 3
                }

                /** Team enum. */
                enum Team {
                    TEAM_NONE = 0,
                    TEAM_RED = 1,
                    TEAM_BLUE = 2
                }

                /** SpawnRegion enum. */
                enum SpawnRegion {
                    REGION_UNSPECIFIED = 0,
                    TOP_LEFT = 1,
                    TOP_RIGHT = 2,
                    BOTTOM_LEFT = 3,
                    BOTTOM_RIGHT = 4
                }

                /** Properties of a MapSnapshot. */
                interface IMapSnapshot {

                    /** MapSnapshot width */
                    width?: (number|null);

                    /** MapSnapshot height */
                    height?: (number|null);

                    /** MapSnapshot tileSize */
                    tileSize?: (number|null);

                    /** MapSnapshot tiles */
                    tiles?: (com.triforge.protocol.proto.TileType[]|null);

                    /** MapSnapshot headquarters */
                    headquarters?: (com.triforge.protocol.proto.IHeadquartersProto[]|null);
                }

                /** Represents a MapSnapshot. */
                class MapSnapshot implements IMapSnapshot {

                    /**
                     * Constructs a new MapSnapshot.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IMapSnapshot);

                    /** MapSnapshot width. */
                    public width: number;

                    /** MapSnapshot height. */
                    public height: number;

                    /** MapSnapshot tileSize. */
                    public tileSize: number;

                    /** MapSnapshot tiles. */
                    public tiles: com.triforge.protocol.proto.TileType[];

                    /** MapSnapshot headquarters. */
                    public headquarters: com.triforge.protocol.proto.IHeadquartersProto[];

                    /**
                     * Creates a new MapSnapshot instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns MapSnapshot instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IMapSnapshot): com.triforge.protocol.proto.MapSnapshot;

                    /**
                     * Encodes the specified MapSnapshot message. Does not implicitly {@link com.triforge.protocol.proto.MapSnapshot.verify|verify} messages.
                     * @param message MapSnapshot message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IMapSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified MapSnapshot message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.MapSnapshot.verify|verify} messages.
                     * @param message MapSnapshot message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IMapSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a MapSnapshot message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns MapSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.MapSnapshot;

                    /**
                     * Decodes a MapSnapshot message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns MapSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.MapSnapshot;

                    /**
                     * Verifies a MapSnapshot message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a MapSnapshot message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns MapSnapshot
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.MapSnapshot;

                    /**
                     * Creates a plain object from a MapSnapshot message. Also converts values to other types if specified.
                     * @param message MapSnapshot
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.MapSnapshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this MapSnapshot to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for MapSnapshot
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a HeadquartersProto. */
                interface IHeadquartersProto {

                    /** HeadquartersProto team */
                    team?: (com.triforge.protocol.proto.Team|null);

                    /** HeadquartersProto x */
                    x?: (number|null);

                    /** HeadquartersProto y */
                    y?: (number|null);

                    /** HeadquartersProto width */
                    width?: (number|null);

                    /** HeadquartersProto height */
                    height?: (number|null);

                    /** HeadquartersProto maxHp */
                    maxHp?: (number|null);
                }

                /** Represents a HeadquartersProto. */
                class HeadquartersProto implements IHeadquartersProto {

                    /**
                     * Constructs a new HeadquartersProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IHeadquartersProto);

                    /** HeadquartersProto team. */
                    public team: com.triforge.protocol.proto.Team;

                    /** HeadquartersProto x. */
                    public x: number;

                    /** HeadquartersProto y. */
                    public y: number;

                    /** HeadquartersProto width. */
                    public width: number;

                    /** HeadquartersProto height. */
                    public height: number;

                    /** HeadquartersProto maxHp. */
                    public maxHp: number;

                    /**
                     * Creates a new HeadquartersProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns HeadquartersProto instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IHeadquartersProto): com.triforge.protocol.proto.HeadquartersProto;

                    /**
                     * Encodes the specified HeadquartersProto message. Does not implicitly {@link com.triforge.protocol.proto.HeadquartersProto.verify|verify} messages.
                     * @param message HeadquartersProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IHeadquartersProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified HeadquartersProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.HeadquartersProto.verify|verify} messages.
                     * @param message HeadquartersProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IHeadquartersProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a HeadquartersProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns HeadquartersProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.HeadquartersProto;

                    /**
                     * Decodes a HeadquartersProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns HeadquartersProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.HeadquartersProto;

                    /**
                     * Verifies a HeadquartersProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a HeadquartersProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns HeadquartersProto
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.HeadquartersProto;

                    /**
                     * Creates a plain object from a HeadquartersProto message. Also converts values to other types if specified.
                     * @param message HeadquartersProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.HeadquartersProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this HeadquartersProto to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for HeadquartersProto
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a TileChange. */
                interface ITileChange {

                    /** TileChange x */
                    x?: (number|null);

                    /** TileChange y */
                    y?: (number|null);

                    /** TileChange tile */
                    tile?: (com.triforge.protocol.proto.TileType|null);
                }

                /** Represents a TileChange. */
                class TileChange implements ITileChange {

                    /**
                     * Constructs a new TileChange.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ITileChange);

                    /** TileChange x. */
                    public x: number;

                    /** TileChange y. */
                    public y: number;

                    /** TileChange tile. */
                    public tile: com.triforge.protocol.proto.TileType;

                    /**
                     * Creates a new TileChange instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TileChange instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ITileChange): com.triforge.protocol.proto.TileChange;

                    /**
                     * Encodes the specified TileChange message. Does not implicitly {@link com.triforge.protocol.proto.TileChange.verify|verify} messages.
                     * @param message TileChange message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ITileChange, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TileChange message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.TileChange.verify|verify} messages.
                     * @param message TileChange message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ITileChange, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TileChange message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TileChange
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.TileChange;

                    /**
                     * Decodes a TileChange message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TileChange
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.TileChange;

                    /**
                     * Verifies a TileChange message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TileChange message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TileChange
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.TileChange;

                    /**
                     * Creates a plain object from a TileChange message. Also converts values to other types if specified.
                     * @param message TileChange
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.TileChange, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TileChange to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for TileChange
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a GameEvent. */
                interface IGameEvent {

                    /** GameEvent type */
                    type?: (com.triforge.protocol.proto.GameEventType|null);

                    /** GameEvent playerId */
                    playerId?: (number|Long|null);

                    /** GameEvent entityId */
                    entityId?: (number|Long|null);

                    /** GameEvent tick */
                    tick?: (number|Long|null);

                    /** GameEvent livesRemaining */
                    livesRemaining?: (number|null);

                    /** GameEvent team */
                    team?: (com.triforge.protocol.proto.Team|null);

                    /** GameEvent killerPlayerId */
                    killerPlayerId?: (number|Long|null);

                    /** GameEvent assistPlayerIds */
                    assistPlayerIds?: ((number|Long)[]|null);
                }

                /** Represents a GameEvent. */
                class GameEvent implements IGameEvent {

                    /**
                     * Constructs a new GameEvent.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IGameEvent);

                    /** GameEvent type. */
                    public type: com.triforge.protocol.proto.GameEventType;

                    /** GameEvent playerId. */
                    public playerId: (number|Long);

                    /** GameEvent entityId. */
                    public entityId: (number|Long);

                    /** GameEvent tick. */
                    public tick: (number|Long);

                    /** GameEvent livesRemaining. */
                    public livesRemaining: number;

                    /** GameEvent team. */
                    public team: com.triforge.protocol.proto.Team;

                    /** GameEvent killerPlayerId. */
                    public killerPlayerId: (number|Long);

                    /** GameEvent assistPlayerIds. */
                    public assistPlayerIds: (number|Long)[];

                    /**
                     * Creates a new GameEvent instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns GameEvent instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IGameEvent): com.triforge.protocol.proto.GameEvent;

                    /**
                     * Encodes the specified GameEvent message. Does not implicitly {@link com.triforge.protocol.proto.GameEvent.verify|verify} messages.
                     * @param message GameEvent message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IGameEvent, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified GameEvent message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.GameEvent.verify|verify} messages.
                     * @param message GameEvent message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IGameEvent, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a GameEvent message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns GameEvent
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.GameEvent;

                    /**
                     * Decodes a GameEvent message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns GameEvent
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.GameEvent;

                    /**
                     * Verifies a GameEvent message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a GameEvent message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns GameEvent
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.GameEvent;

                    /**
                     * Creates a plain object from a GameEvent message. Also converts values to other types if specified.
                     * @param message GameEvent
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.GameEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this GameEvent to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for GameEvent
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PlayerComponentProto. */
                interface IPlayerComponentProto {

                    /** PlayerComponentProto playerId */
                    playerId?: (number|Long|null);

                    /** PlayerComponentProto name */
                    name?: (string|null);

                    /** PlayerComponentProto score */
                    score?: (number|null);

                    /** PlayerComponentProto lives */
                    lives?: (number|null);

                    /** PlayerComponentProto team */
                    team?: (com.triforge.protocol.proto.Team|null);
                }

                /** Represents a PlayerComponentProto. */
                class PlayerComponentProto implements IPlayerComponentProto {

                    /**
                     * Constructs a new PlayerComponentProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IPlayerComponentProto);

                    /** PlayerComponentProto playerId. */
                    public playerId: (number|Long);

                    /** PlayerComponentProto name. */
                    public name: string;

                    /** PlayerComponentProto score. */
                    public score: number;

                    /** PlayerComponentProto lives. */
                    public lives: number;

                    /** PlayerComponentProto team. */
                    public team: com.triforge.protocol.proto.Team;

                    /**
                     * Creates a new PlayerComponentProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PlayerComponentProto instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IPlayerComponentProto): com.triforge.protocol.proto.PlayerComponentProto;

                    /**
                     * Encodes the specified PlayerComponentProto message. Does not implicitly {@link com.triforge.protocol.proto.PlayerComponentProto.verify|verify} messages.
                     * @param message PlayerComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IPlayerComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PlayerComponentProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.PlayerComponentProto.verify|verify} messages.
                     * @param message PlayerComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IPlayerComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PlayerComponentProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PlayerComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.PlayerComponentProto;

                    /**
                     * Decodes a PlayerComponentProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PlayerComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.PlayerComponentProto;

                    /**
                     * Verifies a PlayerComponentProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PlayerComponentProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PlayerComponentProto
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.PlayerComponentProto;

                    /**
                     * Creates a plain object from a PlayerComponentProto message. Also converts values to other types if specified.
                     * @param message PlayerComponentProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.PlayerComponentProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PlayerComponentProto to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PlayerComponentProto
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PositionComponentProto. */
                interface IPositionComponentProto {

                    /** PositionComponentProto x */
                    x?: (number|null);

                    /** PositionComponentProto y */
                    y?: (number|null);
                }

                /** Represents a PositionComponentProto. */
                class PositionComponentProto implements IPositionComponentProto {

                    /**
                     * Constructs a new PositionComponentProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IPositionComponentProto);

                    /** PositionComponentProto x. */
                    public x: number;

                    /** PositionComponentProto y. */
                    public y: number;

                    /**
                     * Creates a new PositionComponentProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PositionComponentProto instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IPositionComponentProto): com.triforge.protocol.proto.PositionComponentProto;

                    /**
                     * Encodes the specified PositionComponentProto message. Does not implicitly {@link com.triforge.protocol.proto.PositionComponentProto.verify|verify} messages.
                     * @param message PositionComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IPositionComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PositionComponentProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.PositionComponentProto.verify|verify} messages.
                     * @param message PositionComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IPositionComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PositionComponentProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PositionComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.PositionComponentProto;

                    /**
                     * Decodes a PositionComponentProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PositionComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.PositionComponentProto;

                    /**
                     * Verifies a PositionComponentProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PositionComponentProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PositionComponentProto
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.PositionComponentProto;

                    /**
                     * Creates a plain object from a PositionComponentProto message. Also converts values to other types if specified.
                     * @param message PositionComponentProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.PositionComponentProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PositionComponentProto to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PositionComponentProto
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a DirectionComponentProto. */
                interface IDirectionComponentProto {

                    /** DirectionComponentProto direction */
                    direction?: (com.triforge.protocol.proto.Direction|null);
                }

                /** Represents a DirectionComponentProto. */
                class DirectionComponentProto implements IDirectionComponentProto {

                    /**
                     * Constructs a new DirectionComponentProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IDirectionComponentProto);

                    /** DirectionComponentProto direction. */
                    public direction: com.triforge.protocol.proto.Direction;

                    /**
                     * Creates a new DirectionComponentProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DirectionComponentProto instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IDirectionComponentProto): com.triforge.protocol.proto.DirectionComponentProto;

                    /**
                     * Encodes the specified DirectionComponentProto message. Does not implicitly {@link com.triforge.protocol.proto.DirectionComponentProto.verify|verify} messages.
                     * @param message DirectionComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IDirectionComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DirectionComponentProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.DirectionComponentProto.verify|verify} messages.
                     * @param message DirectionComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IDirectionComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DirectionComponentProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DirectionComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.DirectionComponentProto;

                    /**
                     * Decodes a DirectionComponentProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DirectionComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.DirectionComponentProto;

                    /**
                     * Verifies a DirectionComponentProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DirectionComponentProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DirectionComponentProto
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.DirectionComponentProto;

                    /**
                     * Creates a plain object from a DirectionComponentProto message. Also converts values to other types if specified.
                     * @param message DirectionComponentProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.DirectionComponentProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DirectionComponentProto to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DirectionComponentProto
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a TankComponentProto. */
                interface ITankComponentProto {

                    /** TankComponentProto speed */
                    speed?: (number|null);

                    /** TankComponentProto shootCooldownTicks */
                    shootCooldownTicks?: (number|Long|null);

                    /** TankComponentProto cooldownRemainingTicks */
                    cooldownRemainingTicks?: (number|Long|null);
                }

                /** Represents a TankComponentProto. */
                class TankComponentProto implements ITankComponentProto {

                    /**
                     * Constructs a new TankComponentProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ITankComponentProto);

                    /** TankComponentProto speed. */
                    public speed: number;

                    /** TankComponentProto shootCooldownTicks. */
                    public shootCooldownTicks: (number|Long);

                    /** TankComponentProto cooldownRemainingTicks. */
                    public cooldownRemainingTicks: (number|Long);

                    /**
                     * Creates a new TankComponentProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TankComponentProto instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ITankComponentProto): com.triforge.protocol.proto.TankComponentProto;

                    /**
                     * Encodes the specified TankComponentProto message. Does not implicitly {@link com.triforge.protocol.proto.TankComponentProto.verify|verify} messages.
                     * @param message TankComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ITankComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TankComponentProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.TankComponentProto.verify|verify} messages.
                     * @param message TankComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ITankComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TankComponentProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TankComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.TankComponentProto;

                    /**
                     * Decodes a TankComponentProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TankComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.TankComponentProto;

                    /**
                     * Verifies a TankComponentProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TankComponentProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TankComponentProto
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.TankComponentProto;

                    /**
                     * Creates a plain object from a TankComponentProto message. Also converts values to other types if specified.
                     * @param message TankComponentProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.TankComponentProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TankComponentProto to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for TankComponentProto
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BulletComponentProto. */
                interface IBulletComponentProto {

                    /** BulletComponentProto ownerEntityId */
                    ownerEntityId?: (number|Long|null);

                    /** BulletComponentProto speed */
                    speed?: (number|null);

                    /** BulletComponentProto dx */
                    dx?: (number|null);

                    /** BulletComponentProto dy */
                    dy?: (number|null);
                }

                /** Represents a BulletComponentProto. */
                class BulletComponentProto implements IBulletComponentProto {

                    /**
                     * Constructs a new BulletComponentProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBulletComponentProto);

                    /** BulletComponentProto ownerEntityId. */
                    public ownerEntityId: (number|Long);

                    /** BulletComponentProto speed. */
                    public speed: number;

                    /** BulletComponentProto dx. */
                    public dx: number;

                    /** BulletComponentProto dy. */
                    public dy: number;

                    /**
                     * Creates a new BulletComponentProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BulletComponentProto instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBulletComponentProto): com.triforge.protocol.proto.BulletComponentProto;

                    /**
                     * Encodes the specified BulletComponentProto message. Does not implicitly {@link com.triforge.protocol.proto.BulletComponentProto.verify|verify} messages.
                     * @param message BulletComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBulletComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BulletComponentProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BulletComponentProto.verify|verify} messages.
                     * @param message BulletComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBulletComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BulletComponentProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BulletComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BulletComponentProto;

                    /**
                     * Decodes a BulletComponentProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BulletComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BulletComponentProto;

                    /**
                     * Verifies a BulletComponentProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BulletComponentProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BulletComponentProto
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BulletComponentProto;

                    /**
                     * Creates a plain object from a BulletComponentProto message. Also converts values to other types if specified.
                     * @param message BulletComponentProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BulletComponentProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BulletComponentProto to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BulletComponentProto
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an EntityProto. */
                interface IEntityProto {

                    /** EntityProto entityId */
                    entityId?: (number|Long|null);

                    /** EntityProto player */
                    player?: (com.triforge.protocol.proto.IPlayerComponentProto|null);

                    /** EntityProto position */
                    position?: (com.triforge.protocol.proto.IPositionComponentProto|null);

                    /** EntityProto direction */
                    direction?: (com.triforge.protocol.proto.IDirectionComponentProto|null);

                    /** EntityProto tank */
                    tank?: (com.triforge.protocol.proto.ITankComponentProto|null);

                    /** EntityProto bullet */
                    bullet?: (com.triforge.protocol.proto.IBulletComponentProto|null);
                }

                /** Represents an EntityProto. */
                class EntityProto implements IEntityProto {

                    /**
                     * Constructs a new EntityProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IEntityProto);

                    /** EntityProto entityId. */
                    public entityId: (number|Long);

                    /** EntityProto player. */
                    public player?: (com.triforge.protocol.proto.IPlayerComponentProto|null);

                    /** EntityProto position. */
                    public position?: (com.triforge.protocol.proto.IPositionComponentProto|null);

                    /** EntityProto direction. */
                    public direction?: (com.triforge.protocol.proto.IDirectionComponentProto|null);

                    /** EntityProto tank. */
                    public tank?: (com.triforge.protocol.proto.ITankComponentProto|null);

                    /** EntityProto bullet. */
                    public bullet?: (com.triforge.protocol.proto.IBulletComponentProto|null);

                    /**
                     * Creates a new EntityProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns EntityProto instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IEntityProto): com.triforge.protocol.proto.EntityProto;

                    /**
                     * Encodes the specified EntityProto message. Does not implicitly {@link com.triforge.protocol.proto.EntityProto.verify|verify} messages.
                     * @param message EntityProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IEntityProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified EntityProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.EntityProto.verify|verify} messages.
                     * @param message EntityProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IEntityProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an EntityProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns EntityProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.EntityProto;

                    /**
                     * Decodes an EntityProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns EntityProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.EntityProto;

                    /**
                     * Verifies an EntityProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an EntityProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns EntityProto
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.EntityProto;

                    /**
                     * Creates a plain object from an EntityProto message. Also converts values to other types if specified.
                     * @param message EntityProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.EntityProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this EntityProto to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for EntityProto
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a FullSnapshot. */
                interface IFullSnapshot {

                    /** FullSnapshot tick */
                    tick?: (number|Long|null);

                    /** FullSnapshot entities */
                    entities?: (com.triforge.protocol.proto.IEntityProto[]|null);

                    /** FullSnapshot fog */
                    fog?: (com.triforge.protocol.proto.IFogSnapshot|null);
                }

                /** Represents a FullSnapshot. */
                class FullSnapshot implements IFullSnapshot {

                    /**
                     * Constructs a new FullSnapshot.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IFullSnapshot);

                    /** FullSnapshot tick. */
                    public tick: (number|Long);

                    /** FullSnapshot entities. */
                    public entities: com.triforge.protocol.proto.IEntityProto[];

                    /** FullSnapshot fog. */
                    public fog?: (com.triforge.protocol.proto.IFogSnapshot|null);

                    /**
                     * Creates a new FullSnapshot instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns FullSnapshot instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IFullSnapshot): com.triforge.protocol.proto.FullSnapshot;

                    /**
                     * Encodes the specified FullSnapshot message. Does not implicitly {@link com.triforge.protocol.proto.FullSnapshot.verify|verify} messages.
                     * @param message FullSnapshot message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IFullSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified FullSnapshot message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.FullSnapshot.verify|verify} messages.
                     * @param message FullSnapshot message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IFullSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a FullSnapshot message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns FullSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.FullSnapshot;

                    /**
                     * Decodes a FullSnapshot message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns FullSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.FullSnapshot;

                    /**
                     * Verifies a FullSnapshot message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a FullSnapshot message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns FullSnapshot
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.FullSnapshot;

                    /**
                     * Creates a plain object from a FullSnapshot message. Also converts values to other types if specified.
                     * @param message FullSnapshot
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.FullSnapshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this FullSnapshot to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for FullSnapshot
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a DeltaSnapshot. */
                interface IDeltaSnapshot {

                    /** DeltaSnapshot tick */
                    tick?: (number|Long|null);

                    /** DeltaSnapshot updatedEntities */
                    updatedEntities?: (com.triforge.protocol.proto.IEntityProto[]|null);

                    /** DeltaSnapshot removedEntityIds */
                    removedEntityIds?: ((number|Long)[]|null);

                    /** DeltaSnapshot tileChanges */
                    tileChanges?: (com.triforge.protocol.proto.ITileChange[]|null);

                    /** DeltaSnapshot fog */
                    fog?: (com.triforge.protocol.proto.IFogSnapshot|null);
                }

                /** Represents a DeltaSnapshot. */
                class DeltaSnapshot implements IDeltaSnapshot {

                    /**
                     * Constructs a new DeltaSnapshot.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IDeltaSnapshot);

                    /** DeltaSnapshot tick. */
                    public tick: (number|Long);

                    /** DeltaSnapshot updatedEntities. */
                    public updatedEntities: com.triforge.protocol.proto.IEntityProto[];

                    /** DeltaSnapshot removedEntityIds. */
                    public removedEntityIds: (number|Long)[];

                    /** DeltaSnapshot tileChanges. */
                    public tileChanges: com.triforge.protocol.proto.ITileChange[];

                    /** DeltaSnapshot fog. */
                    public fog?: (com.triforge.protocol.proto.IFogSnapshot|null);

                    /**
                     * Creates a new DeltaSnapshot instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DeltaSnapshot instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IDeltaSnapshot): com.triforge.protocol.proto.DeltaSnapshot;

                    /**
                     * Encodes the specified DeltaSnapshot message. Does not implicitly {@link com.triforge.protocol.proto.DeltaSnapshot.verify|verify} messages.
                     * @param message DeltaSnapshot message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IDeltaSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DeltaSnapshot message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.DeltaSnapshot.verify|verify} messages.
                     * @param message DeltaSnapshot message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IDeltaSnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DeltaSnapshot message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DeltaSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.DeltaSnapshot;

                    /**
                     * Decodes a DeltaSnapshot message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DeltaSnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.DeltaSnapshot;

                    /**
                     * Verifies a DeltaSnapshot message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DeltaSnapshot message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DeltaSnapshot
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.DeltaSnapshot;

                    /**
                     * Creates a plain object from a DeltaSnapshot message. Also converts values to other types if specified.
                     * @param message DeltaSnapshot
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.DeltaSnapshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DeltaSnapshot to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DeltaSnapshot
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an InputCommand. */
                interface IInputCommand {

                    /** InputCommand moveUp */
                    moveUp?: (boolean|null);

                    /** InputCommand moveDown */
                    moveDown?: (boolean|null);

                    /** InputCommand moveLeft */
                    moveLeft?: (boolean|null);

                    /** InputCommand moveRight */
                    moveRight?: (boolean|null);

                    /** InputCommand shoot */
                    shoot?: (boolean|null);
                }

                /** Represents an InputCommand. */
                class InputCommand implements IInputCommand {

                    /**
                     * Constructs a new InputCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IInputCommand);

                    /** InputCommand moveUp. */
                    public moveUp: boolean;

                    /** InputCommand moveDown. */
                    public moveDown: boolean;

                    /** InputCommand moveLeft. */
                    public moveLeft: boolean;

                    /** InputCommand moveRight. */
                    public moveRight: boolean;

                    /** InputCommand shoot. */
                    public shoot: boolean;

                    /**
                     * Creates a new InputCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns InputCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IInputCommand): com.triforge.protocol.proto.InputCommand;

                    /**
                     * Encodes the specified InputCommand message. Does not implicitly {@link com.triforge.protocol.proto.InputCommand.verify|verify} messages.
                     * @param message InputCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IInputCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified InputCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.InputCommand.verify|verify} messages.
                     * @param message InputCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IInputCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an InputCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns InputCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.InputCommand;

                    /**
                     * Decodes an InputCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns InputCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.InputCommand;

                    /**
                     * Verifies an InputCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an InputCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns InputCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.InputCommand;

                    /**
                     * Creates a plain object from an InputCommand message. Also converts values to other types if specified.
                     * @param message InputCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.InputCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this InputCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for InputCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a LobbyPlayer. */
                interface ILobbyPlayer {

                    /** LobbyPlayer playerId */
                    playerId?: (number|Long|null);

                    /** LobbyPlayer displayName */
                    displayName?: (string|null);

                    /** LobbyPlayer team */
                    team?: (com.triforge.protocol.proto.Team|null);

                    /** LobbyPlayer spawnRegion */
                    spawnRegion?: (com.triforge.protocol.proto.SpawnRegion|null);

                    /** LobbyPlayer ready */
                    ready?: (boolean|null);

                    /** LobbyPlayer isHost */
                    isHost?: (boolean|null);

                    /** LobbyPlayer isTeamCaptain */
                    isTeamCaptain?: (boolean|null);
                }

                /** Represents a LobbyPlayer. */
                class LobbyPlayer implements ILobbyPlayer {

                    /**
                     * Constructs a new LobbyPlayer.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ILobbyPlayer);

                    /** LobbyPlayer playerId. */
                    public playerId: (number|Long);

                    /** LobbyPlayer displayName. */
                    public displayName: string;

                    /** LobbyPlayer team. */
                    public team: com.triforge.protocol.proto.Team;

                    /** LobbyPlayer spawnRegion. */
                    public spawnRegion: com.triforge.protocol.proto.SpawnRegion;

                    /** LobbyPlayer ready. */
                    public ready: boolean;

                    /** LobbyPlayer isHost. */
                    public isHost: boolean;

                    /** LobbyPlayer isTeamCaptain. */
                    public isTeamCaptain: boolean;

                    /**
                     * Creates a new LobbyPlayer instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns LobbyPlayer instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ILobbyPlayer): com.triforge.protocol.proto.LobbyPlayer;

                    /**
                     * Encodes the specified LobbyPlayer message. Does not implicitly {@link com.triforge.protocol.proto.LobbyPlayer.verify|verify} messages.
                     * @param message LobbyPlayer message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ILobbyPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified LobbyPlayer message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.LobbyPlayer.verify|verify} messages.
                     * @param message LobbyPlayer message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ILobbyPlayer, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a LobbyPlayer message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns LobbyPlayer
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.LobbyPlayer;

                    /**
                     * Decodes a LobbyPlayer message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns LobbyPlayer
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.LobbyPlayer;

                    /**
                     * Verifies a LobbyPlayer message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a LobbyPlayer message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns LobbyPlayer
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.LobbyPlayer;

                    /**
                     * Creates a plain object from a LobbyPlayer message. Also converts values to other types if specified.
                     * @param message LobbyPlayer
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.LobbyPlayer, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this LobbyPlayer to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for LobbyPlayer
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a TeamSetup. */
                interface ITeamSetup {

                    /** TeamSetup team */
                    team?: (com.triforge.protocol.proto.Team|null);

                    /** TeamSetup captainPlayerId */
                    captainPlayerId?: (number|Long|null);

                    /** TeamSetup spawnRegion */
                    spawnRegion?: (com.triforge.protocol.proto.SpawnRegion|null);

                    /** TeamSetup hqRegion */
                    hqRegion?: (com.triforge.protocol.proto.SpawnRegion|null);
                }

                /** Represents a TeamSetup. */
                class TeamSetup implements ITeamSetup {

                    /**
                     * Constructs a new TeamSetup.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ITeamSetup);

                    /** TeamSetup team. */
                    public team: com.triforge.protocol.proto.Team;

                    /** TeamSetup captainPlayerId. */
                    public captainPlayerId: (number|Long);

                    /** TeamSetup spawnRegion. */
                    public spawnRegion: com.triforge.protocol.proto.SpawnRegion;

                    /** TeamSetup hqRegion. */
                    public hqRegion: com.triforge.protocol.proto.SpawnRegion;

                    /**
                     * Creates a new TeamSetup instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TeamSetup instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ITeamSetup): com.triforge.protocol.proto.TeamSetup;

                    /**
                     * Encodes the specified TeamSetup message. Does not implicitly {@link com.triforge.protocol.proto.TeamSetup.verify|verify} messages.
                     * @param message TeamSetup message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ITeamSetup, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TeamSetup message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.TeamSetup.verify|verify} messages.
                     * @param message TeamSetup message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ITeamSetup, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TeamSetup message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TeamSetup
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.TeamSetup;

                    /**
                     * Decodes a TeamSetup message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TeamSetup
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.TeamSetup;

                    /**
                     * Verifies a TeamSetup message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TeamSetup message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TeamSetup
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.TeamSetup;

                    /**
                     * Creates a plain object from a TeamSetup message. Also converts values to other types if specified.
                     * @param message TeamSetup
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.TeamSetup, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TeamSetup to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for TeamSetup
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a RoomLobbySnapshot. */
                interface IRoomLobbySnapshot {

                    /** RoomLobbySnapshot roomId */
                    roomId?: (string|null);

                    /** RoomLobbySnapshot roomName */
                    roomName?: (string|null);

                    /** RoomLobbySnapshot phase */
                    phase?: (com.triforge.protocol.proto.MatchPhase|null);

                    /** RoomLobbySnapshot players */
                    players?: (com.triforge.protocol.proto.ILobbyPlayer[]|null);

                    /** RoomLobbySnapshot minPlayers */
                    minPlayers?: (number|null);

                    /** RoomLobbySnapshot canStart */
                    canStart?: (boolean|null);

                    /** RoomLobbySnapshot teamSetups */
                    teamSetups?: (com.triforge.protocol.proto.ITeamSetup[]|null);
                }

                /** Represents a RoomLobbySnapshot. */
                class RoomLobbySnapshot implements IRoomLobbySnapshot {

                    /**
                     * Constructs a new RoomLobbySnapshot.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IRoomLobbySnapshot);

                    /** RoomLobbySnapshot roomId. */
                    public roomId: string;

                    /** RoomLobbySnapshot roomName. */
                    public roomName: string;

                    /** RoomLobbySnapshot phase. */
                    public phase: com.triforge.protocol.proto.MatchPhase;

                    /** RoomLobbySnapshot players. */
                    public players: com.triforge.protocol.proto.ILobbyPlayer[];

                    /** RoomLobbySnapshot minPlayers. */
                    public minPlayers: number;

                    /** RoomLobbySnapshot canStart. */
                    public canStart: boolean;

                    /** RoomLobbySnapshot teamSetups. */
                    public teamSetups: com.triforge.protocol.proto.ITeamSetup[];

                    /**
                     * Creates a new RoomLobbySnapshot instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns RoomLobbySnapshot instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IRoomLobbySnapshot): com.triforge.protocol.proto.RoomLobbySnapshot;

                    /**
                     * Encodes the specified RoomLobbySnapshot message. Does not implicitly {@link com.triforge.protocol.proto.RoomLobbySnapshot.verify|verify} messages.
                     * @param message RoomLobbySnapshot message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IRoomLobbySnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified RoomLobbySnapshot message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.RoomLobbySnapshot.verify|verify} messages.
                     * @param message RoomLobbySnapshot message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IRoomLobbySnapshot, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a RoomLobbySnapshot message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns RoomLobbySnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.RoomLobbySnapshot;

                    /**
                     * Decodes a RoomLobbySnapshot message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns RoomLobbySnapshot
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.RoomLobbySnapshot;

                    /**
                     * Verifies a RoomLobbySnapshot message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a RoomLobbySnapshot message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns RoomLobbySnapshot
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.RoomLobbySnapshot;

                    /**
                     * Creates a plain object from a RoomLobbySnapshot message. Also converts values to other types if specified.
                     * @param message RoomLobbySnapshot
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.RoomLobbySnapshot, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this RoomLobbySnapshot to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for RoomLobbySnapshot
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SetNameAction. */
                interface ISetNameAction {

                    /** SetNameAction displayName */
                    displayName?: (string|null);
                }

                /** Represents a SetNameAction. */
                class SetNameAction implements ISetNameAction {

                    /**
                     * Constructs a new SetNameAction.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ISetNameAction);

                    /** SetNameAction displayName. */
                    public displayName: string;

                    /**
                     * Creates a new SetNameAction instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SetNameAction instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ISetNameAction): com.triforge.protocol.proto.SetNameAction;

                    /**
                     * Encodes the specified SetNameAction message. Does not implicitly {@link com.triforge.protocol.proto.SetNameAction.verify|verify} messages.
                     * @param message SetNameAction message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ISetNameAction, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SetNameAction message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.SetNameAction.verify|verify} messages.
                     * @param message SetNameAction message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ISetNameAction, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SetNameAction message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SetNameAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.SetNameAction;

                    /**
                     * Decodes a SetNameAction message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SetNameAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.SetNameAction;

                    /**
                     * Verifies a SetNameAction message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SetNameAction message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SetNameAction
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.SetNameAction;

                    /**
                     * Creates a plain object from a SetNameAction message. Also converts values to other types if specified.
                     * @param message SetNameAction
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.SetNameAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SetNameAction to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SetNameAction
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SetTeamAction. */
                interface ISetTeamAction {

                    /** SetTeamAction team */
                    team?: (com.triforge.protocol.proto.Team|null);
                }

                /** Represents a SetTeamAction. */
                class SetTeamAction implements ISetTeamAction {

                    /**
                     * Constructs a new SetTeamAction.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ISetTeamAction);

                    /** SetTeamAction team. */
                    public team: com.triforge.protocol.proto.Team;

                    /**
                     * Creates a new SetTeamAction instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SetTeamAction instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ISetTeamAction): com.triforge.protocol.proto.SetTeamAction;

                    /**
                     * Encodes the specified SetTeamAction message. Does not implicitly {@link com.triforge.protocol.proto.SetTeamAction.verify|verify} messages.
                     * @param message SetTeamAction message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ISetTeamAction, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SetTeamAction message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.SetTeamAction.verify|verify} messages.
                     * @param message SetTeamAction message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ISetTeamAction, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SetTeamAction message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SetTeamAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.SetTeamAction;

                    /**
                     * Decodes a SetTeamAction message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SetTeamAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.SetTeamAction;

                    /**
                     * Verifies a SetTeamAction message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SetTeamAction message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SetTeamAction
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.SetTeamAction;

                    /**
                     * Creates a plain object from a SetTeamAction message. Also converts values to other types if specified.
                     * @param message SetTeamAction
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.SetTeamAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SetTeamAction to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SetTeamAction
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SetSpawnAction. */
                interface ISetSpawnAction {

                    /** SetSpawnAction region */
                    region?: (com.triforge.protocol.proto.SpawnRegion|null);
                }

                /** Represents a SetSpawnAction. */
                class SetSpawnAction implements ISetSpawnAction {

                    /**
                     * Constructs a new SetSpawnAction.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ISetSpawnAction);

                    /** SetSpawnAction region. */
                    public region: com.triforge.protocol.proto.SpawnRegion;

                    /**
                     * Creates a new SetSpawnAction instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SetSpawnAction instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ISetSpawnAction): com.triforge.protocol.proto.SetSpawnAction;

                    /**
                     * Encodes the specified SetSpawnAction message. Does not implicitly {@link com.triforge.protocol.proto.SetSpawnAction.verify|verify} messages.
                     * @param message SetSpawnAction message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ISetSpawnAction, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SetSpawnAction message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.SetSpawnAction.verify|verify} messages.
                     * @param message SetSpawnAction message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ISetSpawnAction, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SetSpawnAction message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SetSpawnAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.SetSpawnAction;

                    /**
                     * Decodes a SetSpawnAction message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SetSpawnAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.SetSpawnAction;

                    /**
                     * Verifies a SetSpawnAction message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SetSpawnAction message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SetSpawnAction
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.SetSpawnAction;

                    /**
                     * Creates a plain object from a SetSpawnAction message. Also converts values to other types if specified.
                     * @param message SetSpawnAction
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.SetSpawnAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SetSpawnAction to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SetSpawnAction
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SetTeamSetupAction. */
                interface ISetTeamSetupAction {

                    /** SetTeamSetupAction spawnRegion */
                    spawnRegion?: (com.triforge.protocol.proto.SpawnRegion|null);

                    /** SetTeamSetupAction hqRegion */
                    hqRegion?: (com.triforge.protocol.proto.SpawnRegion|null);
                }

                /** Represents a SetTeamSetupAction. */
                class SetTeamSetupAction implements ISetTeamSetupAction {

                    /**
                     * Constructs a new SetTeamSetupAction.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ISetTeamSetupAction);

                    /** SetTeamSetupAction spawnRegion. */
                    public spawnRegion: com.triforge.protocol.proto.SpawnRegion;

                    /** SetTeamSetupAction hqRegion. */
                    public hqRegion: com.triforge.protocol.proto.SpawnRegion;

                    /**
                     * Creates a new SetTeamSetupAction instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SetTeamSetupAction instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ISetTeamSetupAction): com.triforge.protocol.proto.SetTeamSetupAction;

                    /**
                     * Encodes the specified SetTeamSetupAction message. Does not implicitly {@link com.triforge.protocol.proto.SetTeamSetupAction.verify|verify} messages.
                     * @param message SetTeamSetupAction message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ISetTeamSetupAction, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SetTeamSetupAction message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.SetTeamSetupAction.verify|verify} messages.
                     * @param message SetTeamSetupAction message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ISetTeamSetupAction, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SetTeamSetupAction message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SetTeamSetupAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.SetTeamSetupAction;

                    /**
                     * Decodes a SetTeamSetupAction message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SetTeamSetupAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.SetTeamSetupAction;

                    /**
                     * Verifies a SetTeamSetupAction message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SetTeamSetupAction message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SetTeamSetupAction
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.SetTeamSetupAction;

                    /**
                     * Creates a plain object from a SetTeamSetupAction message. Also converts values to other types if specified.
                     * @param message SetTeamSetupAction
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.SetTeamSetupAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SetTeamSetupAction to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SetTeamSetupAction
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a SetReadyAction. */
                interface ISetReadyAction {

                    /** SetReadyAction ready */
                    ready?: (boolean|null);
                }

                /** Represents a SetReadyAction. */
                class SetReadyAction implements ISetReadyAction {

                    /**
                     * Constructs a new SetReadyAction.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ISetReadyAction);

                    /** SetReadyAction ready. */
                    public ready: boolean;

                    /**
                     * Creates a new SetReadyAction instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns SetReadyAction instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ISetReadyAction): com.triforge.protocol.proto.SetReadyAction;

                    /**
                     * Encodes the specified SetReadyAction message. Does not implicitly {@link com.triforge.protocol.proto.SetReadyAction.verify|verify} messages.
                     * @param message SetReadyAction message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ISetReadyAction, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified SetReadyAction message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.SetReadyAction.verify|verify} messages.
                     * @param message SetReadyAction message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ISetReadyAction, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a SetReadyAction message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns SetReadyAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.SetReadyAction;

                    /**
                     * Decodes a SetReadyAction message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns SetReadyAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.SetReadyAction;

                    /**
                     * Verifies a SetReadyAction message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a SetReadyAction message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns SetReadyAction
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.SetReadyAction;

                    /**
                     * Creates a plain object from a SetReadyAction message. Also converts values to other types if specified.
                     * @param message SetReadyAction
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.SetReadyAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this SetReadyAction to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for SetReadyAction
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a StartMatchAction. */
                interface IStartMatchAction {
                }

                /** Represents a StartMatchAction. */
                class StartMatchAction implements IStartMatchAction {

                    /**
                     * Constructs a new StartMatchAction.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IStartMatchAction);

                    /**
                     * Creates a new StartMatchAction instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns StartMatchAction instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IStartMatchAction): com.triforge.protocol.proto.StartMatchAction;

                    /**
                     * Encodes the specified StartMatchAction message. Does not implicitly {@link com.triforge.protocol.proto.StartMatchAction.verify|verify} messages.
                     * @param message StartMatchAction message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IStartMatchAction, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified StartMatchAction message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.StartMatchAction.verify|verify} messages.
                     * @param message StartMatchAction message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IStartMatchAction, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a StartMatchAction message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns StartMatchAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.StartMatchAction;

                    /**
                     * Decodes a StartMatchAction message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns StartMatchAction
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.StartMatchAction;

                    /**
                     * Verifies a StartMatchAction message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a StartMatchAction message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns StartMatchAction
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.StartMatchAction;

                    /**
                     * Creates a plain object from a StartMatchAction message. Also converts values to other types if specified.
                     * @param message StartMatchAction
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.StartMatchAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this StartMatchAction to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for StartMatchAction
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a LobbyCommand. */
                interface ILobbyCommand {

                    /** LobbyCommand setName */
                    setName?: (com.triforge.protocol.proto.ISetNameAction|null);

                    /** LobbyCommand setTeam */
                    setTeam?: (com.triforge.protocol.proto.ISetTeamAction|null);

                    /** LobbyCommand setSpawn */
                    setSpawn?: (com.triforge.protocol.proto.ISetSpawnAction|null);

                    /** LobbyCommand setReady */
                    setReady?: (com.triforge.protocol.proto.ISetReadyAction|null);

                    /** LobbyCommand startMatch */
                    startMatch?: (com.triforge.protocol.proto.IStartMatchAction|null);

                    /** LobbyCommand setTeamSetup */
                    setTeamSetup?: (com.triforge.protocol.proto.ISetTeamSetupAction|null);
                }

                /** Represents a LobbyCommand. */
                class LobbyCommand implements ILobbyCommand {

                    /**
                     * Constructs a new LobbyCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ILobbyCommand);

                    /** LobbyCommand setName. */
                    public setName?: (com.triforge.protocol.proto.ISetNameAction|null);

                    /** LobbyCommand setTeam. */
                    public setTeam?: (com.triforge.protocol.proto.ISetTeamAction|null);

                    /** LobbyCommand setSpawn. */
                    public setSpawn?: (com.triforge.protocol.proto.ISetSpawnAction|null);

                    /** LobbyCommand setReady. */
                    public setReady?: (com.triforge.protocol.proto.ISetReadyAction|null);

                    /** LobbyCommand startMatch. */
                    public startMatch?: (com.triforge.protocol.proto.IStartMatchAction|null);

                    /** LobbyCommand setTeamSetup. */
                    public setTeamSetup?: (com.triforge.protocol.proto.ISetTeamSetupAction|null);

                    /** LobbyCommand action. */
                    public action?: ("setName"|"setTeam"|"setSpawn"|"setReady"|"startMatch"|"setTeamSetup");

                    /**
                     * Creates a new LobbyCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns LobbyCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ILobbyCommand): com.triforge.protocol.proto.LobbyCommand;

                    /**
                     * Encodes the specified LobbyCommand message. Does not implicitly {@link com.triforge.protocol.proto.LobbyCommand.verify|verify} messages.
                     * @param message LobbyCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ILobbyCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified LobbyCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.LobbyCommand.verify|verify} messages.
                     * @param message LobbyCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ILobbyCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a LobbyCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns LobbyCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.LobbyCommand;

                    /**
                     * Decodes a LobbyCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns LobbyCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.LobbyCommand;

                    /**
                     * Verifies a LobbyCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a LobbyCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns LobbyCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.LobbyCommand;

                    /**
                     * Creates a plain object from a LobbyCommand message. Also converts values to other types if specified.
                     * @param message LobbyCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.LobbyCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this LobbyCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for LobbyCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a MatchPhaseUpdate. */
                interface IMatchPhaseUpdate {

                    /** MatchPhaseUpdate phase */
                    phase?: (com.triforge.protocol.proto.MatchPhase|null);

                    /** MatchPhaseUpdate countdownSeconds */
                    countdownSeconds?: (number|null);

                    /** MatchPhaseUpdate matchRemainingMs */
                    matchRemainingMs?: (number|Long|null);

                    /** MatchPhaseUpdate serverTick */
                    serverTick?: (number|Long|null);

                    /** MatchPhaseUpdate redHqHp */
                    redHqHp?: (number|null);

                    /** MatchPhaseUpdate blueHqHp */
                    blueHqHp?: (number|null);
                }

                /** Represents a MatchPhaseUpdate. */
                class MatchPhaseUpdate implements IMatchPhaseUpdate {

                    /**
                     * Constructs a new MatchPhaseUpdate.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IMatchPhaseUpdate);

                    /** MatchPhaseUpdate phase. */
                    public phase: com.triforge.protocol.proto.MatchPhase;

                    /** MatchPhaseUpdate countdownSeconds. */
                    public countdownSeconds: number;

                    /** MatchPhaseUpdate matchRemainingMs. */
                    public matchRemainingMs: (number|Long);

                    /** MatchPhaseUpdate serverTick. */
                    public serverTick: (number|Long);

                    /** MatchPhaseUpdate redHqHp. */
                    public redHqHp: number;

                    /** MatchPhaseUpdate blueHqHp. */
                    public blueHqHp: number;

                    /**
                     * Creates a new MatchPhaseUpdate instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns MatchPhaseUpdate instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IMatchPhaseUpdate): com.triforge.protocol.proto.MatchPhaseUpdate;

                    /**
                     * Encodes the specified MatchPhaseUpdate message. Does not implicitly {@link com.triforge.protocol.proto.MatchPhaseUpdate.verify|verify} messages.
                     * @param message MatchPhaseUpdate message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IMatchPhaseUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified MatchPhaseUpdate message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.MatchPhaseUpdate.verify|verify} messages.
                     * @param message MatchPhaseUpdate message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IMatchPhaseUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a MatchPhaseUpdate message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns MatchPhaseUpdate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.MatchPhaseUpdate;

                    /**
                     * Decodes a MatchPhaseUpdate message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns MatchPhaseUpdate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.MatchPhaseUpdate;

                    /**
                     * Verifies a MatchPhaseUpdate message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a MatchPhaseUpdate message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns MatchPhaseUpdate
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.MatchPhaseUpdate;

                    /**
                     * Creates a plain object from a MatchPhaseUpdate message. Also converts values to other types if specified.
                     * @param message MatchPhaseUpdate
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.MatchPhaseUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this MatchPhaseUpdate to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for MatchPhaseUpdate
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PlayerMatchStats. */
                interface IPlayerMatchStats {

                    /** PlayerMatchStats playerId */
                    playerId?: (number|Long|null);

                    /** PlayerMatchStats displayName */
                    displayName?: (string|null);

                    /** PlayerMatchStats team */
                    team?: (com.triforge.protocol.proto.Team|null);

                    /** PlayerMatchStats kills */
                    kills?: (number|null);

                    /** PlayerMatchStats deaths */
                    deaths?: (number|null);

                    /** PlayerMatchStats assists */
                    assists?: (number|null);

                    /** PlayerMatchStats damageDealt */
                    damageDealt?: (number|null);

                    /** PlayerMatchStats damageTaken */
                    damageTaken?: (number|null);

                    /** PlayerMatchStats shotsFired */
                    shotsFired?: (number|null);

                    /** PlayerMatchStats shotsHit */
                    shotsHit?: (number|null);
                }

                /** Represents a PlayerMatchStats. */
                class PlayerMatchStats implements IPlayerMatchStats {

                    /**
                     * Constructs a new PlayerMatchStats.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IPlayerMatchStats);

                    /** PlayerMatchStats playerId. */
                    public playerId: (number|Long);

                    /** PlayerMatchStats displayName. */
                    public displayName: string;

                    /** PlayerMatchStats team. */
                    public team: com.triforge.protocol.proto.Team;

                    /** PlayerMatchStats kills. */
                    public kills: number;

                    /** PlayerMatchStats deaths. */
                    public deaths: number;

                    /** PlayerMatchStats assists. */
                    public assists: number;

                    /** PlayerMatchStats damageDealt. */
                    public damageDealt: number;

                    /** PlayerMatchStats damageTaken. */
                    public damageTaken: number;

                    /** PlayerMatchStats shotsFired. */
                    public shotsFired: number;

                    /** PlayerMatchStats shotsHit. */
                    public shotsHit: number;

                    /**
                     * Creates a new PlayerMatchStats instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PlayerMatchStats instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IPlayerMatchStats): com.triforge.protocol.proto.PlayerMatchStats;

                    /**
                     * Encodes the specified PlayerMatchStats message. Does not implicitly {@link com.triforge.protocol.proto.PlayerMatchStats.verify|verify} messages.
                     * @param message PlayerMatchStats message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IPlayerMatchStats, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PlayerMatchStats message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.PlayerMatchStats.verify|verify} messages.
                     * @param message PlayerMatchStats message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IPlayerMatchStats, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PlayerMatchStats message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PlayerMatchStats
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.PlayerMatchStats;

                    /**
                     * Decodes a PlayerMatchStats message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PlayerMatchStats
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.PlayerMatchStats;

                    /**
                     * Verifies a PlayerMatchStats message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PlayerMatchStats message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PlayerMatchStats
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.PlayerMatchStats;

                    /**
                     * Creates a plain object from a PlayerMatchStats message. Also converts values to other types if specified.
                     * @param message PlayerMatchStats
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.PlayerMatchStats, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PlayerMatchStats to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PlayerMatchStats
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a MatchResult. */
                interface IMatchResult {

                    /** MatchResult winningTeam */
                    winningTeam?: (com.triforge.protocol.proto.Team|null);

                    /** MatchResult redScore */
                    redScore?: (number|null);

                    /** MatchResult blueScore */
                    blueScore?: (number|null);

                    /** MatchResult stats */
                    stats?: (com.triforge.protocol.proto.IPlayerMatchStats[]|null);

                    /** MatchResult matchDurationMs */
                    matchDurationMs?: (number|Long|null);
                }

                /** Represents a MatchResult. */
                class MatchResult implements IMatchResult {

                    /**
                     * Constructs a new MatchResult.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IMatchResult);

                    /** MatchResult winningTeam. */
                    public winningTeam: com.triforge.protocol.proto.Team;

                    /** MatchResult redScore. */
                    public redScore: number;

                    /** MatchResult blueScore. */
                    public blueScore: number;

                    /** MatchResult stats. */
                    public stats: com.triforge.protocol.proto.IPlayerMatchStats[];

                    /** MatchResult matchDurationMs. */
                    public matchDurationMs: (number|Long);

                    /**
                     * Creates a new MatchResult instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns MatchResult instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IMatchResult): com.triforge.protocol.proto.MatchResult;

                    /**
                     * Encodes the specified MatchResult message. Does not implicitly {@link com.triforge.protocol.proto.MatchResult.verify|verify} messages.
                     * @param message MatchResult message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IMatchResult, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified MatchResult message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.MatchResult.verify|verify} messages.
                     * @param message MatchResult message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IMatchResult, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a MatchResult message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns MatchResult
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.MatchResult;

                    /**
                     * Decodes a MatchResult message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns MatchResult
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.MatchResult;

                    /**
                     * Verifies a MatchResult message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a MatchResult message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns MatchResult
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.MatchResult;

                    /**
                     * Creates a plain object from a MatchResult message. Also converts values to other types if specified.
                     * @param message MatchResult
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.MatchResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this MatchResult to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for MatchResult
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }
        }
    }
}
