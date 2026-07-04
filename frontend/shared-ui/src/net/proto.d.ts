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

                    /** GameMessage tq */
                    tq?: (com.triforge.protocol.proto.ITreasureQuestMessage|null);

                    /** GameMessage lobbyCommandRejected */
                    lobbyCommandRejected?: (com.triforge.protocol.proto.ILobbyCommandRejected|null);

                    /** GameMessage chatCommand */
                    chatCommand?: (com.triforge.protocol.proto.IChatCommand|null);

                    /** GameMessage chatMessage */
                    chatMessage?: (com.triforge.protocol.proto.IChatMessage|null);

                    /** GameMessage oaq */
                    oaq?: (com.triforge.protocol.proto.IOAnQuanMessage|null);

                    /** GameMessage bugminer */
                    bugminer?: (com.triforge.protocol.proto.IBugMinerMessage|null);
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

                    /** GameMessage tq. */
                    public tq?: (com.triforge.protocol.proto.ITreasureQuestMessage|null);

                    /** GameMessage lobbyCommandRejected. */
                    public lobbyCommandRejected?: (com.triforge.protocol.proto.ILobbyCommandRejected|null);

                    /** GameMessage chatCommand. */
                    public chatCommand?: (com.triforge.protocol.proto.IChatCommand|null);

                    /** GameMessage chatMessage. */
                    public chatMessage?: (com.triforge.protocol.proto.IChatMessage|null);

                    /** GameMessage oaq. */
                    public oaq?: (com.triforge.protocol.proto.IOAnQuanMessage|null);

                    /** GameMessage bugminer. */
                    public bugminer?: (com.triforge.protocol.proto.IBugMinerMessage|null);

                    /** GameMessage content. */
                    public content?: ("joinRequest"|"joinResponse"|"fullSnapshot"|"deltaSnapshot"|"inputCommand"|"gameEvent"|"lobbyCommand"|"roomLobbySnapshot"|"matchPhaseUpdate"|"matchResult"|"mapSnapshot"|"tq"|"lobbyCommandRejected"|"chatCommand"|"chatMessage"|"oaq"|"bugminer");

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

                /** Properties of a ChatCommand. */
                interface IChatCommand {

                    /** ChatCommand text */
                    text?: (string|null);
                }

                /** Represents a ChatCommand. */
                class ChatCommand implements IChatCommand {

                    /**
                     * Constructs a new ChatCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IChatCommand);

                    /** ChatCommand text. */
                    public text: string;

                    /**
                     * Creates a new ChatCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ChatCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IChatCommand): com.triforge.protocol.proto.ChatCommand;

                    /**
                     * Encodes the specified ChatCommand message. Does not implicitly {@link com.triforge.protocol.proto.ChatCommand.verify|verify} messages.
                     * @param message ChatCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IChatCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ChatCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.ChatCommand.verify|verify} messages.
                     * @param message ChatCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IChatCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ChatCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ChatCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.ChatCommand;

                    /**
                     * Decodes a ChatCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ChatCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.ChatCommand;

                    /**
                     * Verifies a ChatCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ChatCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ChatCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.ChatCommand;

                    /**
                     * Creates a plain object from a ChatCommand message. Also converts values to other types if specified.
                     * @param message ChatCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.ChatCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ChatCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ChatCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ChatMessage. */
                interface IChatMessage {

                    /** ChatMessage senderPlayerId */
                    senderPlayerId?: (number|Long|null);

                    /** ChatMessage senderName */
                    senderName?: (string|null);

                    /** ChatMessage text */
                    text?: (string|null);

                    /** ChatMessage tick */
                    tick?: (number|Long|null);
                }

                /** Represents a ChatMessage. */
                class ChatMessage implements IChatMessage {

                    /**
                     * Constructs a new ChatMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IChatMessage);

                    /** ChatMessage senderPlayerId. */
                    public senderPlayerId: (number|Long);

                    /** ChatMessage senderName. */
                    public senderName: string;

                    /** ChatMessage text. */
                    public text: string;

                    /** ChatMessage tick. */
                    public tick: (number|Long);

                    /**
                     * Creates a new ChatMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ChatMessage instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IChatMessage): com.triforge.protocol.proto.ChatMessage;

                    /**
                     * Encodes the specified ChatMessage message. Does not implicitly {@link com.triforge.protocol.proto.ChatMessage.verify|verify} messages.
                     * @param message ChatMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IChatMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ChatMessage message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.ChatMessage.verify|verify} messages.
                     * @param message ChatMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IChatMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ChatMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ChatMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.ChatMessage;

                    /**
                     * Decodes a ChatMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ChatMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.ChatMessage;

                    /**
                     * Verifies a ChatMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ChatMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ChatMessage
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.ChatMessage;

                    /**
                     * Creates a plain object from a ChatMessage message. Also converts values to other types if specified.
                     * @param message ChatMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.ChatMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ChatMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ChatMessage
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

                    /** MapSnapshot heights */
                    heights?: (number[]|null);
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

                    /** MapSnapshot heights. */
                    public heights: number[];

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

                    /** TileChange height */
                    height?: (number|null);
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

                    /** TileChange height. */
                    public height: number;

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

                    /** PositionComponentProto z */
                    z?: (number|null);
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

                    /** PositionComponentProto z. */
                    public z: number;

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

                /** Properties of an OrientationComponentProto. */
                interface IOrientationComponentProto {

                    /** OrientationComponentProto yaw */
                    yaw?: (number|null);

                    /** OrientationComponentProto pitch */
                    pitch?: (number|null);
                }

                /** Represents an OrientationComponentProto. */
                class OrientationComponentProto implements IOrientationComponentProto {

                    /**
                     * Constructs a new OrientationComponentProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IOrientationComponentProto);

                    /** OrientationComponentProto yaw. */
                    public yaw: number;

                    /** OrientationComponentProto pitch. */
                    public pitch: number;

                    /**
                     * Creates a new OrientationComponentProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns OrientationComponentProto instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IOrientationComponentProto): com.triforge.protocol.proto.OrientationComponentProto;

                    /**
                     * Encodes the specified OrientationComponentProto message. Does not implicitly {@link com.triforge.protocol.proto.OrientationComponentProto.verify|verify} messages.
                     * @param message OrientationComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IOrientationComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified OrientationComponentProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.OrientationComponentProto.verify|verify} messages.
                     * @param message OrientationComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IOrientationComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an OrientationComponentProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns OrientationComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.OrientationComponentProto;

                    /**
                     * Decodes an OrientationComponentProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns OrientationComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.OrientationComponentProto;

                    /**
                     * Verifies an OrientationComponentProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an OrientationComponentProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns OrientationComponentProto
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.OrientationComponentProto;

                    /**
                     * Creates a plain object from an OrientationComponentProto message. Also converts values to other types if specified.
                     * @param message OrientationComponentProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.OrientationComponentProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this OrientationComponentProto to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for OrientationComponentProto
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

                    /** BulletComponentProto dz */
                    dz?: (number|null);
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

                    /** BulletComponentProto dz. */
                    public dz: number;

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

                    /** EntityProto questAvatar */
                    questAvatar?: (com.triforge.protocol.proto.IQuestAvatarComponentProto|null);

                    /** EntityProto orientation */
                    orientation?: (com.triforge.protocol.proto.IOrientationComponentProto|null);
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

                    /** EntityProto questAvatar. */
                    public questAvatar?: (com.triforge.protocol.proto.IQuestAvatarComponentProto|null);

                    /** EntityProto orientation. */
                    public orientation?: (com.triforge.protocol.proto.IOrientationComponentProto|null);

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

                    /** InputCommand moveForward */
                    moveForward?: (boolean|null);

                    /** InputCommand moveBackward */
                    moveBackward?: (boolean|null);

                    /** InputCommand turnLeft */
                    turnLeft?: (boolean|null);

                    /** InputCommand turnRight */
                    turnRight?: (boolean|null);

                    /** InputCommand aimUp */
                    aimUp?: (boolean|null);

                    /** InputCommand aimDown */
                    aimDown?: (boolean|null);

                    /** InputCommand lockTarget */
                    lockTarget?: (boolean|null);
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

                    /** InputCommand moveForward. */
                    public moveForward: boolean;

                    /** InputCommand moveBackward. */
                    public moveBackward: boolean;

                    /** InputCommand turnLeft. */
                    public turnLeft: boolean;

                    /** InputCommand turnRight. */
                    public turnRight: boolean;

                    /** InputCommand aimUp. */
                    public aimUp: boolean;

                    /** InputCommand aimDown. */
                    public aimDown: boolean;

                    /** InputCommand lockTarget. */
                    public lockTarget: boolean;

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

                /** LobbyRejectReason enum. */
                enum LobbyRejectReason {
                    LOBBY_REJECT_UNSPECIFIED = 0,
                    NOT_IN_LOBBY_PHASE = 1,
                    PLAYER_NOT_FOUND = 2,
                    INVALID_NAME = 3,
                    INVALID_TEAM = 4,
                    TEAM_BALANCE = 5,
                    NOT_ON_PLAYABLE_TEAM = 6,
                    NOT_TEAM_CAPTAIN = 7,
                    INVALID_SPAWN_REGION = 8,
                    TEAM_SETUP_INCOMPLETE = 9
                }

                /** Properties of a LobbyCommandRejected. */
                interface ILobbyCommandRejected {

                    /** LobbyCommandRejected playerId */
                    playerId?: (number|Long|null);

                    /** LobbyCommandRejected reason */
                    reason?: (com.triforge.protocol.proto.LobbyRejectReason|null);
                }

                /** Represents a LobbyCommandRejected. */
                class LobbyCommandRejected implements ILobbyCommandRejected {

                    /**
                     * Constructs a new LobbyCommandRejected.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ILobbyCommandRejected);

                    /** LobbyCommandRejected playerId. */
                    public playerId: (number|Long);

                    /** LobbyCommandRejected reason. */
                    public reason: com.triforge.protocol.proto.LobbyRejectReason;

                    /**
                     * Creates a new LobbyCommandRejected instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns LobbyCommandRejected instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ILobbyCommandRejected): com.triforge.protocol.proto.LobbyCommandRejected;

                    /**
                     * Encodes the specified LobbyCommandRejected message. Does not implicitly {@link com.triforge.protocol.proto.LobbyCommandRejected.verify|verify} messages.
                     * @param message LobbyCommandRejected message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ILobbyCommandRejected, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified LobbyCommandRejected message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.LobbyCommandRejected.verify|verify} messages.
                     * @param message LobbyCommandRejected message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ILobbyCommandRejected, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a LobbyCommandRejected message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns LobbyCommandRejected
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.LobbyCommandRejected;

                    /**
                     * Decodes a LobbyCommandRejected message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns LobbyCommandRejected
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.LobbyCommandRejected;

                    /**
                     * Verifies a LobbyCommandRejected message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a LobbyCommandRejected message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns LobbyCommandRejected
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.LobbyCommandRejected;

                    /**
                     * Creates a plain object from a LobbyCommandRejected message. Also converts values to other types if specified.
                     * @param message LobbyCommandRejected
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.LobbyCommandRejected, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this LobbyCommandRejected to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for LobbyCommandRejected
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

                /** ItemType enum. */
                enum ItemType {
                    ITEM_NONE = 0,
                    ITEM_SHIELD = 1,
                    ITEM_SPEED = 2,
                    ITEM_FAKE_MAP = 3,
                    ITEM_TREASURE_LOCK = 4
                }

                /** QuizOutcome enum. */
                enum QuizOutcome {
                    QUIZ_PENDING = 0,
                    QUIZ_PASS = 1,
                    QUIZ_FAIL = 2
                }

                /** EncounterState enum. */
                enum EncounterState {
                    ENC_OFFERED = 0,
                    ENC_ACCEPTED = 1,
                    ENC_DECLINED = 2,
                    ENC_CANCELLED = 3
                }

                /** Properties of a QuestAvatarComponentProto. */
                interface IQuestAvatarComponentProto {

                    /** QuestAvatarComponentProto playerId */
                    playerId?: (number|Long|null);

                    /** QuestAvatarComponentProto name */
                    name?: (string|null);

                    /** QuestAvatarComponentProto score */
                    score?: (number|null);

                    /** QuestAvatarComponentProto currentCheckpoint */
                    currentCheckpoint?: (string|null);

                    /** QuestAvatarComponentProto checkpointsCleared */
                    checkpointsCleared?: (number|null);

                    /** QuestAvatarComponentProto shielded */
                    shielded?: (boolean|null);

                    /** QuestAvatarComponentProto pvpCooldown */
                    pvpCooldown?: (boolean|null);

                    /** QuestAvatarComponentProto stealImmune */
                    stealImmune?: (boolean|null);

                    /** QuestAvatarComponentProto inDuel */
                    inDuel?: (boolean|null);
                }

                /** Represents a QuestAvatarComponentProto. */
                class QuestAvatarComponentProto implements IQuestAvatarComponentProto {

                    /**
                     * Constructs a new QuestAvatarComponentProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IQuestAvatarComponentProto);

                    /** QuestAvatarComponentProto playerId. */
                    public playerId: (number|Long);

                    /** QuestAvatarComponentProto name. */
                    public name: string;

                    /** QuestAvatarComponentProto score. */
                    public score: number;

                    /** QuestAvatarComponentProto currentCheckpoint. */
                    public currentCheckpoint: string;

                    /** QuestAvatarComponentProto checkpointsCleared. */
                    public checkpointsCleared: number;

                    /** QuestAvatarComponentProto shielded. */
                    public shielded: boolean;

                    /** QuestAvatarComponentProto pvpCooldown. */
                    public pvpCooldown: boolean;

                    /** QuestAvatarComponentProto stealImmune. */
                    public stealImmune: boolean;

                    /** QuestAvatarComponentProto inDuel. */
                    public inDuel: boolean;

                    /**
                     * Creates a new QuestAvatarComponentProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns QuestAvatarComponentProto instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IQuestAvatarComponentProto): com.triforge.protocol.proto.QuestAvatarComponentProto;

                    /**
                     * Encodes the specified QuestAvatarComponentProto message. Does not implicitly {@link com.triforge.protocol.proto.QuestAvatarComponentProto.verify|verify} messages.
                     * @param message QuestAvatarComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IQuestAvatarComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified QuestAvatarComponentProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.QuestAvatarComponentProto.verify|verify} messages.
                     * @param message QuestAvatarComponentProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IQuestAvatarComponentProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a QuestAvatarComponentProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns QuestAvatarComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.QuestAvatarComponentProto;

                    /**
                     * Decodes a QuestAvatarComponentProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns QuestAvatarComponentProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.QuestAvatarComponentProto;

                    /**
                     * Verifies a QuestAvatarComponentProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a QuestAvatarComponentProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns QuestAvatarComponentProto
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.QuestAvatarComponentProto;

                    /**
                     * Creates a plain object from a QuestAvatarComponentProto message. Also converts values to other types if specified.
                     * @param message QuestAvatarComponentProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.QuestAvatarComponentProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this QuestAvatarComponentProto to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for QuestAvatarComponentProto
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an InventoryItemProto. */
                interface IInventoryItemProto {

                    /** InventoryItemProto item */
                    item?: (com.triforge.protocol.proto.ItemType|null);

                    /** InventoryItemProto count */
                    count?: (number|null);
                }

                /** Represents an InventoryItemProto. */
                class InventoryItemProto implements IInventoryItemProto {

                    /**
                     * Constructs a new InventoryItemProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IInventoryItemProto);

                    /** InventoryItemProto item. */
                    public item: com.triforge.protocol.proto.ItemType;

                    /** InventoryItemProto count. */
                    public count: number;

                    /**
                     * Creates a new InventoryItemProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns InventoryItemProto instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IInventoryItemProto): com.triforge.protocol.proto.InventoryItemProto;

                    /**
                     * Encodes the specified InventoryItemProto message. Does not implicitly {@link com.triforge.protocol.proto.InventoryItemProto.verify|verify} messages.
                     * @param message InventoryItemProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IInventoryItemProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified InventoryItemProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.InventoryItemProto.verify|verify} messages.
                     * @param message InventoryItemProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IInventoryItemProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an InventoryItemProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns InventoryItemProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.InventoryItemProto;

                    /**
                     * Decodes an InventoryItemProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns InventoryItemProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.InventoryItemProto;

                    /**
                     * Verifies an InventoryItemProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an InventoryItemProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns InventoryItemProto
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.InventoryItemProto;

                    /**
                     * Creates a plain object from an InventoryItemProto message. Also converts values to other types if specified.
                     * @param message InventoryItemProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.InventoryItemProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this InventoryItemProto to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for InventoryItemProto
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a QuizQuestionProto. */
                interface IQuizQuestionProto {

                    /** QuizQuestionProto questionId */
                    questionId?: (string|null);

                    /** QuizQuestionProto text */
                    text?: (string|null);

                    /** QuizQuestionProto options */
                    options?: (string[]|null);

                    /** QuizQuestionProto timeLimitSec */
                    timeLimitSec?: (number|null);

                    /** QuizQuestionProto points */
                    points?: (number|null);
                }

                /** Represents a QuizQuestionProto. */
                class QuizQuestionProto implements IQuizQuestionProto {

                    /**
                     * Constructs a new QuizQuestionProto.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IQuizQuestionProto);

                    /** QuizQuestionProto questionId. */
                    public questionId: string;

                    /** QuizQuestionProto text. */
                    public text: string;

                    /** QuizQuestionProto options. */
                    public options: string[];

                    /** QuizQuestionProto timeLimitSec. */
                    public timeLimitSec: number;

                    /** QuizQuestionProto points. */
                    public points: number;

                    /**
                     * Creates a new QuizQuestionProto instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns QuizQuestionProto instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IQuizQuestionProto): com.triforge.protocol.proto.QuizQuestionProto;

                    /**
                     * Encodes the specified QuizQuestionProto message. Does not implicitly {@link com.triforge.protocol.proto.QuizQuestionProto.verify|verify} messages.
                     * @param message QuizQuestionProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IQuizQuestionProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified QuizQuestionProto message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.QuizQuestionProto.verify|verify} messages.
                     * @param message QuizQuestionProto message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IQuizQuestionProto, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a QuizQuestionProto message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns QuizQuestionProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.QuizQuestionProto;

                    /**
                     * Decodes a QuizQuestionProto message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns QuizQuestionProto
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.QuizQuestionProto;

                    /**
                     * Verifies a QuizQuestionProto message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a QuizQuestionProto message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns QuizQuestionProto
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.QuizQuestionProto;

                    /**
                     * Creates a plain object from a QuizQuestionProto message. Also converts values to other types if specified.
                     * @param message QuizQuestionProto
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.QuizQuestionProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this QuizQuestionProto to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for QuizQuestionProto
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a QuizAnswer. */
                interface IQuizAnswer {

                    /** QuizAnswer questionId */
                    questionId?: (string|null);

                    /** QuizAnswer selectedIndex */
                    selectedIndex?: (number|null);
                }

                /** Represents a QuizAnswer. */
                class QuizAnswer implements IQuizAnswer {

                    /**
                     * Constructs a new QuizAnswer.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IQuizAnswer);

                    /** QuizAnswer questionId. */
                    public questionId: string;

                    /** QuizAnswer selectedIndex. */
                    public selectedIndex: number;

                    /**
                     * Creates a new QuizAnswer instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns QuizAnswer instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IQuizAnswer): com.triforge.protocol.proto.QuizAnswer;

                    /**
                     * Encodes the specified QuizAnswer message. Does not implicitly {@link com.triforge.protocol.proto.QuizAnswer.verify|verify} messages.
                     * @param message QuizAnswer message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IQuizAnswer, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified QuizAnswer message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.QuizAnswer.verify|verify} messages.
                     * @param message QuizAnswer message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IQuizAnswer, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a QuizAnswer message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns QuizAnswer
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.QuizAnswer;

                    /**
                     * Decodes a QuizAnswer message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns QuizAnswer
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.QuizAnswer;

                    /**
                     * Verifies a QuizAnswer message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a QuizAnswer message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns QuizAnswer
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.QuizAnswer;

                    /**
                     * Creates a plain object from a QuizAnswer message. Also converts values to other types if specified.
                     * @param message QuizAnswer
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.QuizAnswer, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this QuizAnswer to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for QuizAnswer
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a HintReveal. */
                interface IHintReveal {

                    /** HintReveal text */
                    text?: (string|null);

                    /** HintReveal nextCheckpointIds */
                    nextCheckpointIds?: (string[]|null);

                    /** HintReveal x */
                    x?: (number|null);

                    /** HintReveal y */
                    y?: (number|null);
                }

                /** Represents a HintReveal. */
                class HintReveal implements IHintReveal {

                    /**
                     * Constructs a new HintReveal.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IHintReveal);

                    /** HintReveal text. */
                    public text: string;

                    /** HintReveal nextCheckpointIds. */
                    public nextCheckpointIds: string[];

                    /** HintReveal x. */
                    public x: number;

                    /** HintReveal y. */
                    public y: number;

                    /**
                     * Creates a new HintReveal instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns HintReveal instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IHintReveal): com.triforge.protocol.proto.HintReveal;

                    /**
                     * Encodes the specified HintReveal message. Does not implicitly {@link com.triforge.protocol.proto.HintReveal.verify|verify} messages.
                     * @param message HintReveal message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IHintReveal, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified HintReveal message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.HintReveal.verify|verify} messages.
                     * @param message HintReveal message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IHintReveal, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a HintReveal message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns HintReveal
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.HintReveal;

                    /**
                     * Decodes a HintReveal message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns HintReveal
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.HintReveal;

                    /**
                     * Verifies a HintReveal message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a HintReveal message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns HintReveal
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.HintReveal;

                    /**
                     * Creates a plain object from a HintReveal message. Also converts values to other types if specified.
                     * @param message HintReveal
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.HintReveal, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this HintReveal to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for HintReveal
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an InteractCommand. */
                interface IInteractCommand {

                    /** InteractCommand checkpointId */
                    checkpointId?: (string|null);
                }

                /** Represents an InteractCommand. */
                class InteractCommand implements IInteractCommand {

                    /**
                     * Constructs a new InteractCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IInteractCommand);

                    /** InteractCommand checkpointId. */
                    public checkpointId: string;

                    /**
                     * Creates a new InteractCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns InteractCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IInteractCommand): com.triforge.protocol.proto.InteractCommand;

                    /**
                     * Encodes the specified InteractCommand message. Does not implicitly {@link com.triforge.protocol.proto.InteractCommand.verify|verify} messages.
                     * @param message InteractCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IInteractCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified InteractCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.InteractCommand.verify|verify} messages.
                     * @param message InteractCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IInteractCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an InteractCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns InteractCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.InteractCommand;

                    /**
                     * Decodes an InteractCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns InteractCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.InteractCommand;

                    /**
                     * Verifies an InteractCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an InteractCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns InteractCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.InteractCommand;

                    /**
                     * Creates a plain object from an InteractCommand message. Also converts values to other types if specified.
                     * @param message InteractCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.InteractCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this InteractCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for InteractCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a QuizPrompt. */
                interface IQuizPrompt {

                    /** QuizPrompt quizId */
                    quizId?: (string|null);

                    /** QuizPrompt checkpointId */
                    checkpointId?: (string|null);

                    /** QuizPrompt questions */
                    questions?: (com.triforge.protocol.proto.IQuizQuestionProto[]|null);

                    /** QuizPrompt passThreshold */
                    passThreshold?: (number|null);

                    /** QuizPrompt deadlineTick */
                    deadlineTick?: (number|Long|null);
                }

                /** Represents a QuizPrompt. */
                class QuizPrompt implements IQuizPrompt {

                    /**
                     * Constructs a new QuizPrompt.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IQuizPrompt);

                    /** QuizPrompt quizId. */
                    public quizId: string;

                    /** QuizPrompt checkpointId. */
                    public checkpointId: string;

                    /** QuizPrompt questions. */
                    public questions: com.triforge.protocol.proto.IQuizQuestionProto[];

                    /** QuizPrompt passThreshold. */
                    public passThreshold: number;

                    /** QuizPrompt deadlineTick. */
                    public deadlineTick: (number|Long);

                    /**
                     * Creates a new QuizPrompt instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns QuizPrompt instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IQuizPrompt): com.triforge.protocol.proto.QuizPrompt;

                    /**
                     * Encodes the specified QuizPrompt message. Does not implicitly {@link com.triforge.protocol.proto.QuizPrompt.verify|verify} messages.
                     * @param message QuizPrompt message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IQuizPrompt, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified QuizPrompt message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.QuizPrompt.verify|verify} messages.
                     * @param message QuizPrompt message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IQuizPrompt, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a QuizPrompt message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns QuizPrompt
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.QuizPrompt;

                    /**
                     * Decodes a QuizPrompt message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns QuizPrompt
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.QuizPrompt;

                    /**
                     * Verifies a QuizPrompt message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a QuizPrompt message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns QuizPrompt
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.QuizPrompt;

                    /**
                     * Creates a plain object from a QuizPrompt message. Also converts values to other types if specified.
                     * @param message QuizPrompt
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.QuizPrompt, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this QuizPrompt to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for QuizPrompt
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a QuizSubmit. */
                interface IQuizSubmit {

                    /** QuizSubmit quizId */
                    quizId?: (string|null);

                    /** QuizSubmit answers */
                    answers?: (com.triforge.protocol.proto.IQuizAnswer[]|null);
                }

                /** Represents a QuizSubmit. */
                class QuizSubmit implements IQuizSubmit {

                    /**
                     * Constructs a new QuizSubmit.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IQuizSubmit);

                    /** QuizSubmit quizId. */
                    public quizId: string;

                    /** QuizSubmit answers. */
                    public answers: com.triforge.protocol.proto.IQuizAnswer[];

                    /**
                     * Creates a new QuizSubmit instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns QuizSubmit instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IQuizSubmit): com.triforge.protocol.proto.QuizSubmit;

                    /**
                     * Encodes the specified QuizSubmit message. Does not implicitly {@link com.triforge.protocol.proto.QuizSubmit.verify|verify} messages.
                     * @param message QuizSubmit message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IQuizSubmit, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified QuizSubmit message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.QuizSubmit.verify|verify} messages.
                     * @param message QuizSubmit message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IQuizSubmit, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a QuizSubmit message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns QuizSubmit
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.QuizSubmit;

                    /**
                     * Decodes a QuizSubmit message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns QuizSubmit
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.QuizSubmit;

                    /**
                     * Verifies a QuizSubmit message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a QuizSubmit message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns QuizSubmit
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.QuizSubmit;

                    /**
                     * Creates a plain object from a QuizSubmit message. Also converts values to other types if specified.
                     * @param message QuizSubmit
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.QuizSubmit, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this QuizSubmit to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for QuizSubmit
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a QuizResult. */
                interface IQuizResult {

                    /** QuizResult quizId */
                    quizId?: (string|null);

                    /** QuizResult outcome */
                    outcome?: (com.triforge.protocol.proto.QuizOutcome|null);

                    /** QuizResult correctCount */
                    correctCount?: (number|null);

                    /** QuizResult totalQuestions */
                    totalQuestions?: (number|null);

                    /** QuizResult pointsEarned */
                    pointsEarned?: (number|null);

                    /** QuizResult totalScore */
                    totalScore?: (number|null);
                }

                /** Represents a QuizResult. */
                class QuizResult implements IQuizResult {

                    /**
                     * Constructs a new QuizResult.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IQuizResult);

                    /** QuizResult quizId. */
                    public quizId: string;

                    /** QuizResult outcome. */
                    public outcome: com.triforge.protocol.proto.QuizOutcome;

                    /** QuizResult correctCount. */
                    public correctCount: number;

                    /** QuizResult totalQuestions. */
                    public totalQuestions: number;

                    /** QuizResult pointsEarned. */
                    public pointsEarned: number;

                    /** QuizResult totalScore. */
                    public totalScore: number;

                    /**
                     * Creates a new QuizResult instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns QuizResult instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IQuizResult): com.triforge.protocol.proto.QuizResult;

                    /**
                     * Encodes the specified QuizResult message. Does not implicitly {@link com.triforge.protocol.proto.QuizResult.verify|verify} messages.
                     * @param message QuizResult message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IQuizResult, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified QuizResult message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.QuizResult.verify|verify} messages.
                     * @param message QuizResult message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IQuizResult, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a QuizResult message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns QuizResult
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.QuizResult;

                    /**
                     * Decodes a QuizResult message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns QuizResult
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.QuizResult;

                    /**
                     * Verifies a QuizResult message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a QuizResult message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns QuizResult
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.QuizResult;

                    /**
                     * Creates a plain object from a QuizResult message. Also converts values to other types if specified.
                     * @param message QuizResult
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.QuizResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this QuizResult to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for QuizResult
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an EncounterOffer. */
                interface IEncounterOffer {

                    /** EncounterOffer encounterId */
                    encounterId?: (string|null);

                    /** EncounterOffer opponentPlayerId */
                    opponentPlayerId?: (number|Long|null);

                    /** EncounterOffer opponentName */
                    opponentName?: (string|null);

                    /** EncounterOffer state */
                    state?: (com.triforge.protocol.proto.EncounterState|null);

                    /** EncounterOffer deadlineTick */
                    deadlineTick?: (number|Long|null);
                }

                /** Represents an EncounterOffer. */
                class EncounterOffer implements IEncounterOffer {

                    /**
                     * Constructs a new EncounterOffer.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IEncounterOffer);

                    /** EncounterOffer encounterId. */
                    public encounterId: string;

                    /** EncounterOffer opponentPlayerId. */
                    public opponentPlayerId: (number|Long);

                    /** EncounterOffer opponentName. */
                    public opponentName: string;

                    /** EncounterOffer state. */
                    public state: com.triforge.protocol.proto.EncounterState;

                    /** EncounterOffer deadlineTick. */
                    public deadlineTick: (number|Long);

                    /**
                     * Creates a new EncounterOffer instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns EncounterOffer instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IEncounterOffer): com.triforge.protocol.proto.EncounterOffer;

                    /**
                     * Encodes the specified EncounterOffer message. Does not implicitly {@link com.triforge.protocol.proto.EncounterOffer.verify|verify} messages.
                     * @param message EncounterOffer message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IEncounterOffer, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified EncounterOffer message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.EncounterOffer.verify|verify} messages.
                     * @param message EncounterOffer message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IEncounterOffer, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an EncounterOffer message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns EncounterOffer
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.EncounterOffer;

                    /**
                     * Decodes an EncounterOffer message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns EncounterOffer
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.EncounterOffer;

                    /**
                     * Verifies an EncounterOffer message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an EncounterOffer message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns EncounterOffer
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.EncounterOffer;

                    /**
                     * Creates a plain object from an EncounterOffer message. Also converts values to other types if specified.
                     * @param message EncounterOffer
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.EncounterOffer, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this EncounterOffer to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for EncounterOffer
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a ChallengeResponse. */
                interface IChallengeResponse {

                    /** ChallengeResponse encounterId */
                    encounterId?: (string|null);

                    /** ChallengeResponse accept */
                    accept?: (boolean|null);
                }

                /** Represents a ChallengeResponse. */
                class ChallengeResponse implements IChallengeResponse {

                    /**
                     * Constructs a new ChallengeResponse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IChallengeResponse);

                    /** ChallengeResponse encounterId. */
                    public encounterId: string;

                    /** ChallengeResponse accept. */
                    public accept: boolean;

                    /**
                     * Creates a new ChallengeResponse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ChallengeResponse instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IChallengeResponse): com.triforge.protocol.proto.ChallengeResponse;

                    /**
                     * Encodes the specified ChallengeResponse message. Does not implicitly {@link com.triforge.protocol.proto.ChallengeResponse.verify|verify} messages.
                     * @param message ChallengeResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IChallengeResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ChallengeResponse message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.ChallengeResponse.verify|verify} messages.
                     * @param message ChallengeResponse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IChallengeResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ChallengeResponse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ChallengeResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.ChallengeResponse;

                    /**
                     * Decodes a ChallengeResponse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ChallengeResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.ChallengeResponse;

                    /**
                     * Verifies a ChallengeResponse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ChallengeResponse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ChallengeResponse
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.ChallengeResponse;

                    /**
                     * Creates a plain object from a ChallengeResponse message. Also converts values to other types if specified.
                     * @param message ChallengeResponse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.ChallengeResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ChallengeResponse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ChallengeResponse
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a DuelPrompt. */
                interface IDuelPrompt {

                    /** DuelPrompt duelId */
                    duelId?: (string|null);

                    /** DuelPrompt opponentPlayerId */
                    opponentPlayerId?: (number|Long|null);

                    /** DuelPrompt opponentName */
                    opponentName?: (string|null);

                    /** DuelPrompt questions */
                    questions?: (com.triforge.protocol.proto.IQuizQuestionProto[]|null);

                    /** DuelPrompt deadlineTick */
                    deadlineTick?: (number|Long|null);
                }

                /** Represents a DuelPrompt. */
                class DuelPrompt implements IDuelPrompt {

                    /**
                     * Constructs a new DuelPrompt.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IDuelPrompt);

                    /** DuelPrompt duelId. */
                    public duelId: string;

                    /** DuelPrompt opponentPlayerId. */
                    public opponentPlayerId: (number|Long);

                    /** DuelPrompt opponentName. */
                    public opponentName: string;

                    /** DuelPrompt questions. */
                    public questions: com.triforge.protocol.proto.IQuizQuestionProto[];

                    /** DuelPrompt deadlineTick. */
                    public deadlineTick: (number|Long);

                    /**
                     * Creates a new DuelPrompt instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DuelPrompt instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IDuelPrompt): com.triforge.protocol.proto.DuelPrompt;

                    /**
                     * Encodes the specified DuelPrompt message. Does not implicitly {@link com.triforge.protocol.proto.DuelPrompt.verify|verify} messages.
                     * @param message DuelPrompt message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IDuelPrompt, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DuelPrompt message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.DuelPrompt.verify|verify} messages.
                     * @param message DuelPrompt message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IDuelPrompt, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DuelPrompt message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DuelPrompt
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.DuelPrompt;

                    /**
                     * Decodes a DuelPrompt message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DuelPrompt
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.DuelPrompt;

                    /**
                     * Verifies a DuelPrompt message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DuelPrompt message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DuelPrompt
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.DuelPrompt;

                    /**
                     * Creates a plain object from a DuelPrompt message. Also converts values to other types if specified.
                     * @param message DuelPrompt
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.DuelPrompt, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DuelPrompt to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DuelPrompt
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a DuelSubmit. */
                interface IDuelSubmit {

                    /** DuelSubmit duelId */
                    duelId?: (string|null);

                    /** DuelSubmit answers */
                    answers?: (com.triforge.protocol.proto.IQuizAnswer[]|null);
                }

                /** Represents a DuelSubmit. */
                class DuelSubmit implements IDuelSubmit {

                    /**
                     * Constructs a new DuelSubmit.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IDuelSubmit);

                    /** DuelSubmit duelId. */
                    public duelId: string;

                    /** DuelSubmit answers. */
                    public answers: com.triforge.protocol.proto.IQuizAnswer[];

                    /**
                     * Creates a new DuelSubmit instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DuelSubmit instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IDuelSubmit): com.triforge.protocol.proto.DuelSubmit;

                    /**
                     * Encodes the specified DuelSubmit message. Does not implicitly {@link com.triforge.protocol.proto.DuelSubmit.verify|verify} messages.
                     * @param message DuelSubmit message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IDuelSubmit, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DuelSubmit message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.DuelSubmit.verify|verify} messages.
                     * @param message DuelSubmit message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IDuelSubmit, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DuelSubmit message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DuelSubmit
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.DuelSubmit;

                    /**
                     * Decodes a DuelSubmit message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DuelSubmit
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.DuelSubmit;

                    /**
                     * Verifies a DuelSubmit message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DuelSubmit message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DuelSubmit
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.DuelSubmit;

                    /**
                     * Creates a plain object from a DuelSubmit message. Also converts values to other types if specified.
                     * @param message DuelSubmit
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.DuelSubmit, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DuelSubmit to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DuelSubmit
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a DuelResult. */
                interface IDuelResult {

                    /** DuelResult duelId */
                    duelId?: (string|null);

                    /** DuelResult winnerPlayerId */
                    winnerPlayerId?: (number|Long|null);

                    /** DuelResult tie */
                    tie?: (boolean|null);

                    /** DuelResult yourCorrect */
                    yourCorrect?: (number|null);

                    /** DuelResult opponentCorrect */
                    opponentCorrect?: (number|null);

                    /** DuelResult scoreDelta */
                    scoreDelta?: (number|null);

                    /** DuelResult totalScore */
                    totalScore?: (number|null);
                }

                /** Represents a DuelResult. */
                class DuelResult implements IDuelResult {

                    /**
                     * Constructs a new DuelResult.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IDuelResult);

                    /** DuelResult duelId. */
                    public duelId: string;

                    /** DuelResult winnerPlayerId. */
                    public winnerPlayerId: (number|Long);

                    /** DuelResult tie. */
                    public tie: boolean;

                    /** DuelResult yourCorrect. */
                    public yourCorrect: number;

                    /** DuelResult opponentCorrect. */
                    public opponentCorrect: number;

                    /** DuelResult scoreDelta. */
                    public scoreDelta: number;

                    /** DuelResult totalScore. */
                    public totalScore: number;

                    /**
                     * Creates a new DuelResult instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns DuelResult instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IDuelResult): com.triforge.protocol.proto.DuelResult;

                    /**
                     * Encodes the specified DuelResult message. Does not implicitly {@link com.triforge.protocol.proto.DuelResult.verify|verify} messages.
                     * @param message DuelResult message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IDuelResult, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified DuelResult message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.DuelResult.verify|verify} messages.
                     * @param message DuelResult message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IDuelResult, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a DuelResult message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns DuelResult
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.DuelResult;

                    /**
                     * Decodes a DuelResult message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns DuelResult
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.DuelResult;

                    /**
                     * Verifies a DuelResult message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a DuelResult message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns DuelResult
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.DuelResult;

                    /**
                     * Creates a plain object from a DuelResult message. Also converts values to other types if specified.
                     * @param message DuelResult
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.DuelResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this DuelResult to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for DuelResult
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an ItemUse. */
                interface IItemUse {

                    /** ItemUse item */
                    item?: (com.triforge.protocol.proto.ItemType|null);

                    /** ItemUse targetPlayerId */
                    targetPlayerId?: (number|Long|null);
                }

                /** Represents an ItemUse. */
                class ItemUse implements IItemUse {

                    /**
                     * Constructs a new ItemUse.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IItemUse);

                    /** ItemUse item. */
                    public item: com.triforge.protocol.proto.ItemType;

                    /** ItemUse targetPlayerId. */
                    public targetPlayerId: (number|Long);

                    /**
                     * Creates a new ItemUse instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ItemUse instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IItemUse): com.triforge.protocol.proto.ItemUse;

                    /**
                     * Encodes the specified ItemUse message. Does not implicitly {@link com.triforge.protocol.proto.ItemUse.verify|verify} messages.
                     * @param message ItemUse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IItemUse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ItemUse message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.ItemUse.verify|verify} messages.
                     * @param message ItemUse message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IItemUse, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an ItemUse message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ItemUse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.ItemUse;

                    /**
                     * Decodes an ItemUse message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ItemUse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.ItemUse;

                    /**
                     * Verifies an ItemUse message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an ItemUse message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ItemUse
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.ItemUse;

                    /**
                     * Creates a plain object from an ItemUse message. Also converts values to other types if specified.
                     * @param message ItemUse
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.ItemUse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ItemUse to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ItemUse
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an InventoryUpdate. */
                interface IInventoryUpdate {

                    /** InventoryUpdate items */
                    items?: (com.triforge.protocol.proto.IInventoryItemProto[]|null);
                }

                /** Represents an InventoryUpdate. */
                class InventoryUpdate implements IInventoryUpdate {

                    /**
                     * Constructs a new InventoryUpdate.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IInventoryUpdate);

                    /** InventoryUpdate items. */
                    public items: com.triforge.protocol.proto.IInventoryItemProto[];

                    /**
                     * Creates a new InventoryUpdate instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns InventoryUpdate instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IInventoryUpdate): com.triforge.protocol.proto.InventoryUpdate;

                    /**
                     * Encodes the specified InventoryUpdate message. Does not implicitly {@link com.triforge.protocol.proto.InventoryUpdate.verify|verify} messages.
                     * @param message InventoryUpdate message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IInventoryUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified InventoryUpdate message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.InventoryUpdate.verify|verify} messages.
                     * @param message InventoryUpdate message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IInventoryUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an InventoryUpdate message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns InventoryUpdate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.InventoryUpdate;

                    /**
                     * Decodes an InventoryUpdate message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns InventoryUpdate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.InventoryUpdate;

                    /**
                     * Verifies an InventoryUpdate message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an InventoryUpdate message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns InventoryUpdate
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.InventoryUpdate;

                    /**
                     * Creates a plain object from an InventoryUpdate message. Also converts values to other types if specified.
                     * @param message InventoryUpdate
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.InventoryUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this InventoryUpdate to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for InventoryUpdate
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a LeaderboardEntry. */
                interface ILeaderboardEntry {

                    /** LeaderboardEntry playerId */
                    playerId?: (number|Long|null);

                    /** LeaderboardEntry name */
                    name?: (string|null);

                    /** LeaderboardEntry power */
                    power?: (number|null);

                    /** LeaderboardEntry score */
                    score?: (number|null);

                    /** LeaderboardEntry checkpointsCleared */
                    checkpointsCleared?: (number|null);

                    /** LeaderboardEntry rank */
                    rank?: (number|null);
                }

                /** Represents a LeaderboardEntry. */
                class LeaderboardEntry implements ILeaderboardEntry {

                    /**
                     * Constructs a new LeaderboardEntry.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ILeaderboardEntry);

                    /** LeaderboardEntry playerId. */
                    public playerId: (number|Long);

                    /** LeaderboardEntry name. */
                    public name: string;

                    /** LeaderboardEntry power. */
                    public power: number;

                    /** LeaderboardEntry score. */
                    public score: number;

                    /** LeaderboardEntry checkpointsCleared. */
                    public checkpointsCleared: number;

                    /** LeaderboardEntry rank. */
                    public rank: number;

                    /**
                     * Creates a new LeaderboardEntry instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns LeaderboardEntry instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ILeaderboardEntry): com.triforge.protocol.proto.LeaderboardEntry;

                    /**
                     * Encodes the specified LeaderboardEntry message. Does not implicitly {@link com.triforge.protocol.proto.LeaderboardEntry.verify|verify} messages.
                     * @param message LeaderboardEntry message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ILeaderboardEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified LeaderboardEntry message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.LeaderboardEntry.verify|verify} messages.
                     * @param message LeaderboardEntry message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ILeaderboardEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a LeaderboardEntry message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns LeaderboardEntry
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.LeaderboardEntry;

                    /**
                     * Decodes a LeaderboardEntry message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns LeaderboardEntry
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.LeaderboardEntry;

                    /**
                     * Verifies a LeaderboardEntry message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a LeaderboardEntry message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns LeaderboardEntry
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.LeaderboardEntry;

                    /**
                     * Creates a plain object from a LeaderboardEntry message. Also converts values to other types if specified.
                     * @param message LeaderboardEntry
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.LeaderboardEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this LeaderboardEntry to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for LeaderboardEntry
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a Leaderboard. */
                interface ILeaderboard {

                    /** Leaderboard entries */
                    entries?: (com.triforge.protocol.proto.ILeaderboardEntry[]|null);

                    /** Leaderboard finalStandings */
                    finalStandings?: (boolean|null);
                }

                /** Represents a Leaderboard. */
                class Leaderboard implements ILeaderboard {

                    /**
                     * Constructs a new Leaderboard.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ILeaderboard);

                    /** Leaderboard entries. */
                    public entries: com.triforge.protocol.proto.ILeaderboardEntry[];

                    /** Leaderboard finalStandings. */
                    public finalStandings: boolean;

                    /**
                     * Creates a new Leaderboard instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Leaderboard instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ILeaderboard): com.triforge.protocol.proto.Leaderboard;

                    /**
                     * Encodes the specified Leaderboard message. Does not implicitly {@link com.triforge.protocol.proto.Leaderboard.verify|verify} messages.
                     * @param message Leaderboard message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ILeaderboard, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Leaderboard message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.Leaderboard.verify|verify} messages.
                     * @param message Leaderboard message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ILeaderboard, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Leaderboard message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Leaderboard
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.Leaderboard;

                    /**
                     * Decodes a Leaderboard message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Leaderboard
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.Leaderboard;

                    /**
                     * Verifies a Leaderboard message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Leaderboard message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Leaderboard
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.Leaderboard;

                    /**
                     * Creates a plain object from a Leaderboard message. Also converts values to other types if specified.
                     * @param message Leaderboard
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.Leaderboard, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Leaderboard to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for Leaderboard
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of an ExpeditionComplete. */
                interface IExpeditionComplete {

                    /** ExpeditionComplete winnerPlayerId */
                    winnerPlayerId?: (number|Long|null);

                    /** ExpeditionComplete winnerName */
                    winnerName?: (string|null);

                    /** ExpeditionComplete youWon */
                    youWon?: (boolean|null);
                }

                /** Represents an ExpeditionComplete. */
                class ExpeditionComplete implements IExpeditionComplete {

                    /**
                     * Constructs a new ExpeditionComplete.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IExpeditionComplete);

                    /** ExpeditionComplete winnerPlayerId. */
                    public winnerPlayerId: (number|Long);

                    /** ExpeditionComplete winnerName. */
                    public winnerName: string;

                    /** ExpeditionComplete youWon. */
                    public youWon: boolean;

                    /**
                     * Creates a new ExpeditionComplete instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ExpeditionComplete instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IExpeditionComplete): com.triforge.protocol.proto.ExpeditionComplete;

                    /**
                     * Encodes the specified ExpeditionComplete message. Does not implicitly {@link com.triforge.protocol.proto.ExpeditionComplete.verify|verify} messages.
                     * @param message ExpeditionComplete message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IExpeditionComplete, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ExpeditionComplete message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.ExpeditionComplete.verify|verify} messages.
                     * @param message ExpeditionComplete message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IExpeditionComplete, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes an ExpeditionComplete message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ExpeditionComplete
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.ExpeditionComplete;

                    /**
                     * Decodes an ExpeditionComplete message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ExpeditionComplete
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.ExpeditionComplete;

                    /**
                     * Verifies an ExpeditionComplete message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates an ExpeditionComplete message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ExpeditionComplete
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.ExpeditionComplete;

                    /**
                     * Creates a plain object from an ExpeditionComplete message. Also converts values to other types if specified.
                     * @param message ExpeditionComplete
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.ExpeditionComplete, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ExpeditionComplete to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ExpeditionComplete
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a PlayerStateUpdate. */
                interface IPlayerStateUpdate {

                    /** PlayerStateUpdate score */
                    score?: (number|null);

                    /** PlayerStateUpdate currentCheckpoint */
                    currentCheckpoint?: (string|null);

                    /** PlayerStateUpdate checkpointsCleared */
                    checkpointsCleared?: (number|null);

                    /** PlayerStateUpdate shielded */
                    shielded?: (boolean|null);

                    /** PlayerStateUpdate pvpCooldown */
                    pvpCooldown?: (boolean|null);

                    /** PlayerStateUpdate stealImmune */
                    stealImmune?: (boolean|null);

                    /** PlayerStateUpdate inventory */
                    inventory?: (com.triforge.protocol.proto.IInventoryItemProto[]|null);
                }

                /** Represents a PlayerStateUpdate. */
                class PlayerStateUpdate implements IPlayerStateUpdate {

                    /**
                     * Constructs a new PlayerStateUpdate.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IPlayerStateUpdate);

                    /** PlayerStateUpdate score. */
                    public score: number;

                    /** PlayerStateUpdate currentCheckpoint. */
                    public currentCheckpoint: string;

                    /** PlayerStateUpdate checkpointsCleared. */
                    public checkpointsCleared: number;

                    /** PlayerStateUpdate shielded. */
                    public shielded: boolean;

                    /** PlayerStateUpdate pvpCooldown. */
                    public pvpCooldown: boolean;

                    /** PlayerStateUpdate stealImmune. */
                    public stealImmune: boolean;

                    /** PlayerStateUpdate inventory. */
                    public inventory: com.triforge.protocol.proto.IInventoryItemProto[];

                    /**
                     * Creates a new PlayerStateUpdate instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns PlayerStateUpdate instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IPlayerStateUpdate): com.triforge.protocol.proto.PlayerStateUpdate;

                    /**
                     * Encodes the specified PlayerStateUpdate message. Does not implicitly {@link com.triforge.protocol.proto.PlayerStateUpdate.verify|verify} messages.
                     * @param message PlayerStateUpdate message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IPlayerStateUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified PlayerStateUpdate message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.PlayerStateUpdate.verify|verify} messages.
                     * @param message PlayerStateUpdate message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IPlayerStateUpdate, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a PlayerStateUpdate message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns PlayerStateUpdate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.PlayerStateUpdate;

                    /**
                     * Decodes a PlayerStateUpdate message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns PlayerStateUpdate
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.PlayerStateUpdate;

                    /**
                     * Verifies a PlayerStateUpdate message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a PlayerStateUpdate message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns PlayerStateUpdate
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.PlayerStateUpdate;

                    /**
                     * Creates a plain object from a PlayerStateUpdate message. Also converts values to other types if specified.
                     * @param message PlayerStateUpdate
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.PlayerStateUpdate, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this PlayerStateUpdate to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for PlayerStateUpdate
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a TreasureQuestMessage. */
                interface ITreasureQuestMessage {

                    /** TreasureQuestMessage interact */
                    interact?: (com.triforge.protocol.proto.IInteractCommand|null);

                    /** TreasureQuestMessage hintReveal */
                    hintReveal?: (com.triforge.protocol.proto.IHintReveal|null);

                    /** TreasureQuestMessage quizPrompt */
                    quizPrompt?: (com.triforge.protocol.proto.IQuizPrompt|null);

                    /** TreasureQuestMessage quizSubmit */
                    quizSubmit?: (com.triforge.protocol.proto.IQuizSubmit|null);

                    /** TreasureQuestMessage quizResult */
                    quizResult?: (com.triforge.protocol.proto.IQuizResult|null);

                    /** TreasureQuestMessage encounterOffer */
                    encounterOffer?: (com.triforge.protocol.proto.IEncounterOffer|null);

                    /** TreasureQuestMessage challengeResponse */
                    challengeResponse?: (com.triforge.protocol.proto.IChallengeResponse|null);

                    /** TreasureQuestMessage duelPrompt */
                    duelPrompt?: (com.triforge.protocol.proto.IDuelPrompt|null);

                    /** TreasureQuestMessage duelSubmit */
                    duelSubmit?: (com.triforge.protocol.proto.IDuelSubmit|null);

                    /** TreasureQuestMessage duelResult */
                    duelResult?: (com.triforge.protocol.proto.IDuelResult|null);

                    /** TreasureQuestMessage itemUse */
                    itemUse?: (com.triforge.protocol.proto.IItemUse|null);

                    /** TreasureQuestMessage inventoryUpdate */
                    inventoryUpdate?: (com.triforge.protocol.proto.IInventoryUpdate|null);

                    /** TreasureQuestMessage leaderboard */
                    leaderboard?: (com.triforge.protocol.proto.ILeaderboard|null);

                    /** TreasureQuestMessage expeditionComplete */
                    expeditionComplete?: (com.triforge.protocol.proto.IExpeditionComplete|null);

                    /** TreasureQuestMessage playerStateUpdate */
                    playerStateUpdate?: (com.triforge.protocol.proto.IPlayerStateUpdate|null);
                }

                /** Represents a TreasureQuestMessage. */
                class TreasureQuestMessage implements ITreasureQuestMessage {

                    /**
                     * Constructs a new TreasureQuestMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.ITreasureQuestMessage);

                    /** TreasureQuestMessage interact. */
                    public interact?: (com.triforge.protocol.proto.IInteractCommand|null);

                    /** TreasureQuestMessage hintReveal. */
                    public hintReveal?: (com.triforge.protocol.proto.IHintReveal|null);

                    /** TreasureQuestMessage quizPrompt. */
                    public quizPrompt?: (com.triforge.protocol.proto.IQuizPrompt|null);

                    /** TreasureQuestMessage quizSubmit. */
                    public quizSubmit?: (com.triforge.protocol.proto.IQuizSubmit|null);

                    /** TreasureQuestMessage quizResult. */
                    public quizResult?: (com.triforge.protocol.proto.IQuizResult|null);

                    /** TreasureQuestMessage encounterOffer. */
                    public encounterOffer?: (com.triforge.protocol.proto.IEncounterOffer|null);

                    /** TreasureQuestMessage challengeResponse. */
                    public challengeResponse?: (com.triforge.protocol.proto.IChallengeResponse|null);

                    /** TreasureQuestMessage duelPrompt. */
                    public duelPrompt?: (com.triforge.protocol.proto.IDuelPrompt|null);

                    /** TreasureQuestMessage duelSubmit. */
                    public duelSubmit?: (com.triforge.protocol.proto.IDuelSubmit|null);

                    /** TreasureQuestMessage duelResult. */
                    public duelResult?: (com.triforge.protocol.proto.IDuelResult|null);

                    /** TreasureQuestMessage itemUse. */
                    public itemUse?: (com.triforge.protocol.proto.IItemUse|null);

                    /** TreasureQuestMessage inventoryUpdate. */
                    public inventoryUpdate?: (com.triforge.protocol.proto.IInventoryUpdate|null);

                    /** TreasureQuestMessage leaderboard. */
                    public leaderboard?: (com.triforge.protocol.proto.ILeaderboard|null);

                    /** TreasureQuestMessage expeditionComplete. */
                    public expeditionComplete?: (com.triforge.protocol.proto.IExpeditionComplete|null);

                    /** TreasureQuestMessage playerStateUpdate. */
                    public playerStateUpdate?: (com.triforge.protocol.proto.IPlayerStateUpdate|null);

                    /** TreasureQuestMessage content. */
                    public content?: ("interact"|"hintReveal"|"quizPrompt"|"quizSubmit"|"quizResult"|"encounterOffer"|"challengeResponse"|"duelPrompt"|"duelSubmit"|"duelResult"|"itemUse"|"inventoryUpdate"|"leaderboard"|"expeditionComplete"|"playerStateUpdate");

                    /**
                     * Creates a new TreasureQuestMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns TreasureQuestMessage instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.ITreasureQuestMessage): com.triforge.protocol.proto.TreasureQuestMessage;

                    /**
                     * Encodes the specified TreasureQuestMessage message. Does not implicitly {@link com.triforge.protocol.proto.TreasureQuestMessage.verify|verify} messages.
                     * @param message TreasureQuestMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.ITreasureQuestMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified TreasureQuestMessage message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.TreasureQuestMessage.verify|verify} messages.
                     * @param message TreasureQuestMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.ITreasureQuestMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a TreasureQuestMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns TreasureQuestMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.TreasureQuestMessage;

                    /**
                     * Decodes a TreasureQuestMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns TreasureQuestMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.TreasureQuestMessage;

                    /**
                     * Verifies a TreasureQuestMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a TreasureQuestMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns TreasureQuestMessage
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.TreasureQuestMessage;

                    /**
                     * Creates a plain object from a TreasureQuestMessage message. Also converts values to other types if specified.
                     * @param message TreasureQuestMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.TreasureQuestMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this TreasureQuestMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for TreasureQuestMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** OAQDirection enum. */
                enum OAQDirection {
                    OAQ_DIR_UNSPECIFIED = 0,
                    OAQ_CLOCKWISE = 1,
                    OAQ_COUNTER_CLOCKWISE = 2
                }

                /** OAQStepType enum. */
                enum OAQStepType {
                    OAQ_STEP_UNSPECIFIED = 0,
                    OAQ_PICKUP = 1,
                    OAQ_SOW = 2,
                    OAQ_CAPTURE = 3,
                    OAQ_BORROW = 4,
                    OAQ_SWEEP = 5
                }

                /** Properties of a OAQMoveCommand. */
                interface IOAQMoveCommand {

                    /** OAQMoveCommand pitIndex */
                    pitIndex?: (number|null);

                    /** OAQMoveCommand direction */
                    direction?: (com.triforge.protocol.proto.OAQDirection|null);
                }

                /** Represents a OAQMoveCommand. */
                class OAQMoveCommand implements IOAQMoveCommand {

                    /**
                     * Constructs a new OAQMoveCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IOAQMoveCommand);

                    /** OAQMoveCommand pitIndex. */
                    public pitIndex: number;

                    /** OAQMoveCommand direction. */
                    public direction: com.triforge.protocol.proto.OAQDirection;

                    /**
                     * Creates a new OAQMoveCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns OAQMoveCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IOAQMoveCommand): com.triforge.protocol.proto.OAQMoveCommand;

                    /**
                     * Encodes the specified OAQMoveCommand message. Does not implicitly {@link com.triforge.protocol.proto.OAQMoveCommand.verify|verify} messages.
                     * @param message OAQMoveCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IOAQMoveCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified OAQMoveCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.OAQMoveCommand.verify|verify} messages.
                     * @param message OAQMoveCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IOAQMoveCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a OAQMoveCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns OAQMoveCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.OAQMoveCommand;

                    /**
                     * Decodes a OAQMoveCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns OAQMoveCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.OAQMoveCommand;

                    /**
                     * Verifies a OAQMoveCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a OAQMoveCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns OAQMoveCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.OAQMoveCommand;

                    /**
                     * Creates a plain object from a OAQMoveCommand message. Also converts values to other types if specified.
                     * @param message OAQMoveCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.OAQMoveCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this OAQMoveCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for OAQMoveCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a OAQMoveRejected. */
                interface IOAQMoveRejected {

                    /** OAQMoveRejected pitIndex */
                    pitIndex?: (number|null);

                    /** OAQMoveRejected direction */
                    direction?: (com.triforge.protocol.proto.OAQDirection|null);

                    /** OAQMoveRejected reason */
                    reason?: (string|null);
                }

                /** Represents a OAQMoveRejected. */
                class OAQMoveRejected implements IOAQMoveRejected {

                    /**
                     * Constructs a new OAQMoveRejected.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IOAQMoveRejected);

                    /** OAQMoveRejected pitIndex. */
                    public pitIndex: number;

                    /** OAQMoveRejected direction. */
                    public direction: com.triforge.protocol.proto.OAQDirection;

                    /** OAQMoveRejected reason. */
                    public reason: string;

                    /**
                     * Creates a new OAQMoveRejected instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns OAQMoveRejected instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IOAQMoveRejected): com.triforge.protocol.proto.OAQMoveRejected;

                    /**
                     * Encodes the specified OAQMoveRejected message. Does not implicitly {@link com.triforge.protocol.proto.OAQMoveRejected.verify|verify} messages.
                     * @param message OAQMoveRejected message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IOAQMoveRejected, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified OAQMoveRejected message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.OAQMoveRejected.verify|verify} messages.
                     * @param message OAQMoveRejected message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IOAQMoveRejected, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a OAQMoveRejected message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns OAQMoveRejected
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.OAQMoveRejected;

                    /**
                     * Decodes a OAQMoveRejected message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns OAQMoveRejected
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.OAQMoveRejected;

                    /**
                     * Verifies a OAQMoveRejected message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a OAQMoveRejected message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns OAQMoveRejected
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.OAQMoveRejected;

                    /**
                     * Creates a plain object from a OAQMoveRejected message. Also converts values to other types if specified.
                     * @param message OAQMoveRejected
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.OAQMoveRejected, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this OAQMoveRejected to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for OAQMoveRejected
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a OAQScore. */
                interface IOAQScore {

                    /** OAQScore playerId */
                    playerId?: (number|Long|null);

                    /** OAQScore seat */
                    seat?: (number|null);

                    /** OAQScore capturedDan */
                    capturedDan?: (number|null);

                    /** OAQScore capturedQuan */
                    capturedQuan?: (number|null);

                    /** OAQScore points */
                    points?: (number|null);
                }

                /** Represents a OAQScore. */
                class OAQScore implements IOAQScore {

                    /**
                     * Constructs a new OAQScore.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IOAQScore);

                    /** OAQScore playerId. */
                    public playerId: (number|Long);

                    /** OAQScore seat. */
                    public seat: number;

                    /** OAQScore capturedDan. */
                    public capturedDan: number;

                    /** OAQScore capturedQuan. */
                    public capturedQuan: number;

                    /** OAQScore points. */
                    public points: number;

                    /**
                     * Creates a new OAQScore instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns OAQScore instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IOAQScore): com.triforge.protocol.proto.OAQScore;

                    /**
                     * Encodes the specified OAQScore message. Does not implicitly {@link com.triforge.protocol.proto.OAQScore.verify|verify} messages.
                     * @param message OAQScore message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IOAQScore, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified OAQScore message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.OAQScore.verify|verify} messages.
                     * @param message OAQScore message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IOAQScore, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a OAQScore message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns OAQScore
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.OAQScore;

                    /**
                     * Decodes a OAQScore message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns OAQScore
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.OAQScore;

                    /**
                     * Verifies a OAQScore message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a OAQScore message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns OAQScore
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.OAQScore;

                    /**
                     * Creates a plain object from a OAQScore message. Also converts values to other types if specified.
                     * @param message OAQScore
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.OAQScore, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this OAQScore to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for OAQScore
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a OAQBoardState. */
                interface IOAQBoardState {

                    /** OAQBoardState pitStones */
                    pitStones?: (number[]|null);

                    /** OAQBoardState quanPieces */
                    quanPieces?: (number[]|null);

                    /** OAQBoardState currentPlayerId */
                    currentPlayerId?: (number|Long|null);

                    /** OAQBoardState scores */
                    scores?: (com.triforge.protocol.proto.IOAQScore[]|null);

                    /** OAQBoardState turnTicksRemaining */
                    turnTicksRemaining?: (number|null);

                    /** OAQBoardState gameOver */
                    gameOver?: (boolean|null);

                    /** OAQBoardState winnerPlayerId */
                    winnerPlayerId?: (number|Long|null);
                }

                /** Represents a OAQBoardState. */
                class OAQBoardState implements IOAQBoardState {

                    /**
                     * Constructs a new OAQBoardState.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IOAQBoardState);

                    /** OAQBoardState pitStones. */
                    public pitStones: number[];

                    /** OAQBoardState quanPieces. */
                    public quanPieces: number[];

                    /** OAQBoardState currentPlayerId. */
                    public currentPlayerId: (number|Long);

                    /** OAQBoardState scores. */
                    public scores: com.triforge.protocol.proto.IOAQScore[];

                    /** OAQBoardState turnTicksRemaining. */
                    public turnTicksRemaining: number;

                    /** OAQBoardState gameOver. */
                    public gameOver: boolean;

                    /** OAQBoardState winnerPlayerId. */
                    public winnerPlayerId: (number|Long);

                    /**
                     * Creates a new OAQBoardState instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns OAQBoardState instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IOAQBoardState): com.triforge.protocol.proto.OAQBoardState;

                    /**
                     * Encodes the specified OAQBoardState message. Does not implicitly {@link com.triforge.protocol.proto.OAQBoardState.verify|verify} messages.
                     * @param message OAQBoardState message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IOAQBoardState, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified OAQBoardState message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.OAQBoardState.verify|verify} messages.
                     * @param message OAQBoardState message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IOAQBoardState, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a OAQBoardState message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns OAQBoardState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.OAQBoardState;

                    /**
                     * Decodes a OAQBoardState message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns OAQBoardState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.OAQBoardState;

                    /**
                     * Verifies a OAQBoardState message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a OAQBoardState message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns OAQBoardState
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.OAQBoardState;

                    /**
                     * Creates a plain object from a OAQBoardState message. Also converts values to other types if specified.
                     * @param message OAQBoardState
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.OAQBoardState, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this OAQBoardState to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for OAQBoardState
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a OAQStep. */
                interface IOAQStep {

                    /** OAQStep type */
                    type?: (com.triforge.protocol.proto.OAQStepType|null);

                    /** OAQStep pitIndex */
                    pitIndex?: (number|null);

                    /** OAQStep stones */
                    stones?: (number|null);

                    /** OAQStep quanPieces */
                    quanPieces?: (number|null);

                    /** OAQStep toSeat */
                    toSeat?: (number|null);
                }

                /** Represents a OAQStep. */
                class OAQStep implements IOAQStep {

                    /**
                     * Constructs a new OAQStep.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IOAQStep);

                    /** OAQStep type. */
                    public type: com.triforge.protocol.proto.OAQStepType;

                    /** OAQStep pitIndex. */
                    public pitIndex: number;

                    /** OAQStep stones. */
                    public stones: number;

                    /** OAQStep quanPieces. */
                    public quanPieces: number;

                    /** OAQStep toSeat. */
                    public toSeat: number;

                    /**
                     * Creates a new OAQStep instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns OAQStep instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IOAQStep): com.triforge.protocol.proto.OAQStep;

                    /**
                     * Encodes the specified OAQStep message. Does not implicitly {@link com.triforge.protocol.proto.OAQStep.verify|verify} messages.
                     * @param message OAQStep message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IOAQStep, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified OAQStep message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.OAQStep.verify|verify} messages.
                     * @param message OAQStep message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IOAQStep, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a OAQStep message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns OAQStep
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.OAQStep;

                    /**
                     * Decodes a OAQStep message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns OAQStep
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.OAQStep;

                    /**
                     * Verifies a OAQStep message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a OAQStep message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns OAQStep
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.OAQStep;

                    /**
                     * Creates a plain object from a OAQStep message. Also converts values to other types if specified.
                     * @param message OAQStep
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.OAQStep, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this OAQStep to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for OAQStep
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a OAQMoveResult. */
                interface IOAQMoveResult {

                    /** OAQMoveResult playerId */
                    playerId?: (number|Long|null);

                    /** OAQMoveResult steps */
                    steps?: (com.triforge.protocol.proto.IOAQStep[]|null);
                }

                /** Represents a OAQMoveResult. */
                class OAQMoveResult implements IOAQMoveResult {

                    /**
                     * Constructs a new OAQMoveResult.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IOAQMoveResult);

                    /** OAQMoveResult playerId. */
                    public playerId: (number|Long);

                    /** OAQMoveResult steps. */
                    public steps: com.triforge.protocol.proto.IOAQStep[];

                    /**
                     * Creates a new OAQMoveResult instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns OAQMoveResult instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IOAQMoveResult): com.triforge.protocol.proto.OAQMoveResult;

                    /**
                     * Encodes the specified OAQMoveResult message. Does not implicitly {@link com.triforge.protocol.proto.OAQMoveResult.verify|verify} messages.
                     * @param message OAQMoveResult message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IOAQMoveResult, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified OAQMoveResult message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.OAQMoveResult.verify|verify} messages.
                     * @param message OAQMoveResult message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IOAQMoveResult, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a OAQMoveResult message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns OAQMoveResult
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.OAQMoveResult;

                    /**
                     * Decodes a OAQMoveResult message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns OAQMoveResult
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.OAQMoveResult;

                    /**
                     * Verifies a OAQMoveResult message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a OAQMoveResult message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns OAQMoveResult
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.OAQMoveResult;

                    /**
                     * Creates a plain object from a OAQMoveResult message. Also converts values to other types if specified.
                     * @param message OAQMoveResult
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.OAQMoveResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this OAQMoveResult to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for OAQMoveResult
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a OAnQuanMessage. */
                interface IOAnQuanMessage {

                    /** OAnQuanMessage move */
                    move?: (com.triforge.protocol.proto.IOAQMoveCommand|null);

                    /** OAnQuanMessage board */
                    board?: (com.triforge.protocol.proto.IOAQBoardState|null);

                    /** OAnQuanMessage moveResult */
                    moveResult?: (com.triforge.protocol.proto.IOAQMoveResult|null);

                    /** OAnQuanMessage moveRejected */
                    moveRejected?: (com.triforge.protocol.proto.IOAQMoveRejected|null);
                }

                /** Represents a OAnQuanMessage. */
                class OAnQuanMessage implements IOAnQuanMessage {

                    /**
                     * Constructs a new OAnQuanMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IOAnQuanMessage);

                    /** OAnQuanMessage move. */
                    public move?: (com.triforge.protocol.proto.IOAQMoveCommand|null);

                    /** OAnQuanMessage board. */
                    public board?: (com.triforge.protocol.proto.IOAQBoardState|null);

                    /** OAnQuanMessage moveResult. */
                    public moveResult?: (com.triforge.protocol.proto.IOAQMoveResult|null);

                    /** OAnQuanMessage moveRejected. */
                    public moveRejected?: (com.triforge.protocol.proto.IOAQMoveRejected|null);

                    /** OAnQuanMessage content. */
                    public content?: ("move"|"board"|"moveResult"|"moveRejected");

                    /**
                     * Creates a new OAnQuanMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns OAnQuanMessage instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IOAnQuanMessage): com.triforge.protocol.proto.OAnQuanMessage;

                    /**
                     * Encodes the specified OAnQuanMessage message. Does not implicitly {@link com.triforge.protocol.proto.OAnQuanMessage.verify|verify} messages.
                     * @param message OAnQuanMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IOAnQuanMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified OAnQuanMessage message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.OAnQuanMessage.verify|verify} messages.
                     * @param message OAnQuanMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IOAnQuanMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a OAnQuanMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns OAnQuanMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.OAnQuanMessage;

                    /**
                     * Decodes a OAnQuanMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns OAnQuanMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.OAnQuanMessage;

                    /**
                     * Verifies a OAnQuanMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a OAnQuanMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns OAnQuanMessage
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.OAnQuanMessage;

                    /**
                     * Creates a plain object from a OAnQuanMessage message. Also converts values to other types if specified.
                     * @param message OAnQuanMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.OAnQuanMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this OAnQuanMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for OAnQuanMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** BugMinerItemType enum. */
                enum BugMinerItemType {
                    BM_ITEM_NONE = 0,
                    BM_ITEM_GOLD = 1,
                    BM_ITEM_BIG_GOLD = 2,
                    BM_ITEM_DIAMOND = 3,
                    BM_ITEM_ROCK = 4,
                    BM_ITEM_MYSTERY_BAG = 5,
                    BM_ITEM_POISON = 6,
                    BM_ITEM_MOUSE = 7,
                    BM_ITEM_PIG = 8,
                    BM_ITEM_STRENGTH_DRINK = 9
                }

                /** BugMinerHookState enum. */
                enum BugMinerHookState {
                    BM_HOOK_RETRACTED = 0,
                    BM_HOOK_SWINGING = 1,
                    BM_HOOK_EXTENDING = 2,
                    BM_HOOK_RETRACTING = 3
                }

                /** Properties of a BugMinerPlacedItem. */
                interface IBugMinerPlacedItem {

                    /** BugMinerPlacedItem id */
                    id?: (string|null);

                    /** BugMinerPlacedItem type */
                    type?: (com.triforge.protocol.proto.BugMinerItemType|null);

                    /** BugMinerPlacedItem x */
                    x?: (number|null);

                    /** BugMinerPlacedItem y */
                    y?: (number|null);

                    /** BugMinerPlacedItem collected */
                    collected?: (boolean|null);

                    /** BugMinerPlacedItem scale */
                    scale?: (number|null);
                }

                /** Represents a BugMinerPlacedItem. */
                class BugMinerPlacedItem implements IBugMinerPlacedItem {

                    /**
                     * Constructs a new BugMinerPlacedItem.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBugMinerPlacedItem);

                    /** BugMinerPlacedItem id. */
                    public id: string;

                    /** BugMinerPlacedItem type. */
                    public type: com.triforge.protocol.proto.BugMinerItemType;

                    /** BugMinerPlacedItem x. */
                    public x: number;

                    /** BugMinerPlacedItem y. */
                    public y: number;

                    /** BugMinerPlacedItem collected. */
                    public collected: boolean;

                    /** BugMinerPlacedItem scale. */
                    public scale: number;

                    /**
                     * Creates a new BugMinerPlacedItem instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BugMinerPlacedItem instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBugMinerPlacedItem): com.triforge.protocol.proto.BugMinerPlacedItem;

                    /**
                     * Encodes the specified BugMinerPlacedItem message. Does not implicitly {@link com.triforge.protocol.proto.BugMinerPlacedItem.verify|verify} messages.
                     * @param message BugMinerPlacedItem message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBugMinerPlacedItem, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BugMinerPlacedItem message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BugMinerPlacedItem.verify|verify} messages.
                     * @param message BugMinerPlacedItem message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBugMinerPlacedItem, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BugMinerPlacedItem message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BugMinerPlacedItem
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BugMinerPlacedItem;

                    /**
                     * Decodes a BugMinerPlacedItem message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BugMinerPlacedItem
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BugMinerPlacedItem;

                    /**
                     * Verifies a BugMinerPlacedItem message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BugMinerPlacedItem message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BugMinerPlacedItem
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BugMinerPlacedItem;

                    /**
                     * Creates a plain object from a BugMinerPlacedItem message. Also converts values to other types if specified.
                     * @param message BugMinerPlacedItem
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BugMinerPlacedItem, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BugMinerPlacedItem to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BugMinerPlacedItem
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BugMinerHookData. */
                interface IBugMinerHookData {

                    /** BugMinerHookData angle */
                    angle?: (number|null);

                    /** BugMinerHookData length */
                    length?: (number|null);

                    /** BugMinerHookData state */
                    state?: (com.triforge.protocol.proto.BugMinerHookState|null);

                    /** BugMinerHookData attachedItemId */
                    attachedItemId?: (string|null);

                    /** BugMinerHookData swingDirection */
                    swingDirection?: (number|null);
                }

                /** Represents a BugMinerHookData. */
                class BugMinerHookData implements IBugMinerHookData {

                    /**
                     * Constructs a new BugMinerHookData.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBugMinerHookData);

                    /** BugMinerHookData angle. */
                    public angle: number;

                    /** BugMinerHookData length. */
                    public length: number;

                    /** BugMinerHookData state. */
                    public state: com.triforge.protocol.proto.BugMinerHookState;

                    /** BugMinerHookData attachedItemId. */
                    public attachedItemId: string;

                    /** BugMinerHookData swingDirection. */
                    public swingDirection: number;

                    /**
                     * Creates a new BugMinerHookData instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BugMinerHookData instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBugMinerHookData): com.triforge.protocol.proto.BugMinerHookData;

                    /**
                     * Encodes the specified BugMinerHookData message. Does not implicitly {@link com.triforge.protocol.proto.BugMinerHookData.verify|verify} messages.
                     * @param message BugMinerHookData message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBugMinerHookData, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BugMinerHookData message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BugMinerHookData.verify|verify} messages.
                     * @param message BugMinerHookData message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBugMinerHookData, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BugMinerHookData message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BugMinerHookData
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BugMinerHookData;

                    /**
                     * Decodes a BugMinerHookData message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BugMinerHookData
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BugMinerHookData;

                    /**
                     * Verifies a BugMinerHookData message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BugMinerHookData message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BugMinerHookData
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BugMinerHookData;

                    /**
                     * Creates a plain object from a BugMinerHookData message. Also converts values to other types if specified.
                     * @param message BugMinerHookData
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BugMinerHookData, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BugMinerHookData to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BugMinerHookData
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BugMinerChallengeState. */
                interface IBugMinerChallengeState {

                    /** BugMinerChallengeState designerId */
                    designerId?: (number|Long|null);

                    /** BugMinerChallengeState playerId */
                    playerId?: (number|Long|null);

                    /** BugMinerChallengeState levelId */
                    levelId?: (string|null);

                    /** BugMinerChallengeState timeLimit */
                    timeLimit?: (number|null);

                    /** BugMinerChallengeState timeRemaining */
                    timeRemaining?: (number|null);

                    /** BugMinerChallengeState targetScore */
                    targetScore?: (number|null);

                    /** BugMinerChallengeState score */
                    score?: (number|null);

                    /** BugMinerChallengeState items */
                    items?: (com.triforge.protocol.proto.IBugMinerPlacedItem[]|null);

                    /** BugMinerChallengeState hook */
                    hook?: (com.triforge.protocol.proto.IBugMinerHookData|null);

                    /** BugMinerChallengeState setupLocked */
                    setupLocked?: (boolean|null);

                    /** BugMinerChallengeState finished */
                    finished?: (boolean|null);

                    /** BugMinerChallengeState endReason */
                    endReason?: (string|null);

                    /** BugMinerChallengeState strengthBuffRemaining */
                    strengthBuffRemaining?: (number|null);
                }

                /** Represents a BugMinerChallengeState. */
                class BugMinerChallengeState implements IBugMinerChallengeState {

                    /**
                     * Constructs a new BugMinerChallengeState.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBugMinerChallengeState);

                    /** BugMinerChallengeState designerId. */
                    public designerId: (number|Long);

                    /** BugMinerChallengeState playerId. */
                    public playerId: (number|Long);

                    /** BugMinerChallengeState levelId. */
                    public levelId: string;

                    /** BugMinerChallengeState timeLimit. */
                    public timeLimit: number;

                    /** BugMinerChallengeState timeRemaining. */
                    public timeRemaining: number;

                    /** BugMinerChallengeState targetScore. */
                    public targetScore: number;

                    /** BugMinerChallengeState score. */
                    public score: number;

                    /** BugMinerChallengeState items. */
                    public items: com.triforge.protocol.proto.IBugMinerPlacedItem[];

                    /** BugMinerChallengeState hook. */
                    public hook?: (com.triforge.protocol.proto.IBugMinerHookData|null);

                    /** BugMinerChallengeState setupLocked. */
                    public setupLocked: boolean;

                    /** BugMinerChallengeState finished. */
                    public finished: boolean;

                    /** BugMinerChallengeState endReason. */
                    public endReason: string;

                    /** BugMinerChallengeState strengthBuffRemaining. */
                    public strengthBuffRemaining: number;

                    /**
                     * Creates a new BugMinerChallengeState instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BugMinerChallengeState instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBugMinerChallengeState): com.triforge.protocol.proto.BugMinerChallengeState;

                    /**
                     * Encodes the specified BugMinerChallengeState message. Does not implicitly {@link com.triforge.protocol.proto.BugMinerChallengeState.verify|verify} messages.
                     * @param message BugMinerChallengeState message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBugMinerChallengeState, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BugMinerChallengeState message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BugMinerChallengeState.verify|verify} messages.
                     * @param message BugMinerChallengeState message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBugMinerChallengeState, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BugMinerChallengeState message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BugMinerChallengeState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BugMinerChallengeState;

                    /**
                     * Decodes a BugMinerChallengeState message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BugMinerChallengeState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BugMinerChallengeState;

                    /**
                     * Verifies a BugMinerChallengeState message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BugMinerChallengeState message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BugMinerChallengeState
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BugMinerChallengeState;

                    /**
                     * Creates a plain object from a BugMinerChallengeState message. Also converts values to other types if specified.
                     * @param message BugMinerChallengeState
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BugMinerChallengeState, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BugMinerChallengeState to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BugMinerChallengeState
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BugMinerClientEvent. */
                interface IBugMinerClientEvent {

                    /** BugMinerClientEvent eventType */
                    eventType?: (string|null);

                    /** BugMinerClientEvent playerId */
                    playerId?: (number|Long|null);

                    /** BugMinerClientEvent playerAId */
                    playerAId?: (number|Long|null);

                    /** BugMinerClientEvent playerBId */
                    playerBId?: (number|Long|null);

                    /** BugMinerClientEvent thiefId */
                    thiefId?: (number|Long|null);

                    /** BugMinerClientEvent victimId */
                    victimId?: (number|Long|null);

                    /** BugMinerClientEvent itemId */
                    itemId?: (string|null);

                    /** BugMinerClientEvent value */
                    value?: (number|null);
                }

                /** Represents a BugMinerClientEvent. */
                class BugMinerClientEvent implements IBugMinerClientEvent {

                    /**
                     * Constructs a new BugMinerClientEvent.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBugMinerClientEvent);

                    /** BugMinerClientEvent eventType. */
                    public eventType: string;

                    /** BugMinerClientEvent playerId. */
                    public playerId: (number|Long);

                    /** BugMinerClientEvent playerAId. */
                    public playerAId: (number|Long);

                    /** BugMinerClientEvent playerBId. */
                    public playerBId: (number|Long);

                    /** BugMinerClientEvent thiefId. */
                    public thiefId: (number|Long);

                    /** BugMinerClientEvent victimId. */
                    public victimId: (number|Long);

                    /** BugMinerClientEvent itemId. */
                    public itemId: string;

                    /** BugMinerClientEvent value. */
                    public value: number;

                    /**
                     * Creates a new BugMinerClientEvent instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BugMinerClientEvent instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBugMinerClientEvent): com.triforge.protocol.proto.BugMinerClientEvent;

                    /**
                     * Encodes the specified BugMinerClientEvent message. Does not implicitly {@link com.triforge.protocol.proto.BugMinerClientEvent.verify|verify} messages.
                     * @param message BugMinerClientEvent message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBugMinerClientEvent, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BugMinerClientEvent message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BugMinerClientEvent.verify|verify} messages.
                     * @param message BugMinerClientEvent message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBugMinerClientEvent, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BugMinerClientEvent message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BugMinerClientEvent
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BugMinerClientEvent;

                    /**
                     * Decodes a BugMinerClientEvent message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BugMinerClientEvent
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BugMinerClientEvent;

                    /**
                     * Verifies a BugMinerClientEvent message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BugMinerClientEvent message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BugMinerClientEvent
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BugMinerClientEvent;

                    /**
                     * Creates a plain object from a BugMinerClientEvent message. Also converts values to other types if specified.
                     * @param message BugMinerClientEvent
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BugMinerClientEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BugMinerClientEvent to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BugMinerClientEvent
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BugMinerBoardState. */
                interface IBugMinerBoardState {

                    /** BugMinerBoardState forPlayerA */
                    forPlayerA?: (com.triforge.protocol.proto.IBugMinerChallengeState|null);

                    /** BugMinerBoardState forPlayerB */
                    forPlayerB?: (com.triforge.protocol.proto.IBugMinerChallengeState|null);

                    /** BugMinerBoardState fairMode */
                    fairMode?: (com.triforge.protocol.proto.IBugMinerFairModeConfig|null);

                    /** BugMinerBoardState battle */
                    battle?: (com.triforge.protocol.proto.IBugMinerBattleState|null);

                    /** BugMinerBoardState events */
                    events?: (com.triforge.protocol.proto.IBugMinerClientEvent[]|null);

                    /** BugMinerBoardState playCountdown */
                    playCountdown?: (number|null);

                    /** BugMinerBoardState paused */
                    paused?: (boolean|null);

                    /** BugMinerBoardState winnerId */
                    winnerId?: (number|Long|null);

                    /** BugMinerBoardState matchEndReason */
                    matchEndReason?: (string|null);
                }

                /** Represents a BugMinerBoardState. */
                class BugMinerBoardState implements IBugMinerBoardState {

                    /**
                     * Constructs a new BugMinerBoardState.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBugMinerBoardState);

                    /** BugMinerBoardState forPlayerA. */
                    public forPlayerA?: (com.triforge.protocol.proto.IBugMinerChallengeState|null);

                    /** BugMinerBoardState forPlayerB. */
                    public forPlayerB?: (com.triforge.protocol.proto.IBugMinerChallengeState|null);

                    /** BugMinerBoardState fairMode. */
                    public fairMode?: (com.triforge.protocol.proto.IBugMinerFairModeConfig|null);

                    /** BugMinerBoardState battle. */
                    public battle?: (com.triforge.protocol.proto.IBugMinerBattleState|null);

                    /** BugMinerBoardState events. */
                    public events: com.triforge.protocol.proto.IBugMinerClientEvent[];

                    /** BugMinerBoardState playCountdown. */
                    public playCountdown: number;

                    /** BugMinerBoardState paused. */
                    public paused: boolean;

                    /** BugMinerBoardState winnerId. */
                    public winnerId: (number|Long);

                    /** BugMinerBoardState matchEndReason. */
                    public matchEndReason: string;

                    /**
                     * Creates a new BugMinerBoardState instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BugMinerBoardState instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBugMinerBoardState): com.triforge.protocol.proto.BugMinerBoardState;

                    /**
                     * Encodes the specified BugMinerBoardState message. Does not implicitly {@link com.triforge.protocol.proto.BugMinerBoardState.verify|verify} messages.
                     * @param message BugMinerBoardState message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBugMinerBoardState, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BugMinerBoardState message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BugMinerBoardState.verify|verify} messages.
                     * @param message BugMinerBoardState message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBugMinerBoardState, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BugMinerBoardState message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BugMinerBoardState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BugMinerBoardState;

                    /**
                     * Decodes a BugMinerBoardState message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BugMinerBoardState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BugMinerBoardState;

                    /**
                     * Verifies a BugMinerBoardState message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BugMinerBoardState message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BugMinerBoardState
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BugMinerBoardState;

                    /**
                     * Creates a plain object from a BugMinerBoardState message. Also converts values to other types if specified.
                     * @param message BugMinerBoardState
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BugMinerBoardState, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BugMinerBoardState to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BugMinerBoardState
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BugMinerFairModeConfig. */
                interface IBugMinerFairModeConfig {

                    /** BugMinerFairModeConfig enabled */
                    enabled?: (boolean|null);

                    /** BugMinerFairModeConfig battle */
                    battle?: (boolean|null);

                    /** BugMinerFairModeConfig levelId */
                    levelId?: (string|null);

                    /** BugMinerFairModeConfig timeLimit */
                    timeLimit?: (number|null);
                }

                /** Represents a BugMinerFairModeConfig. */
                class BugMinerFairModeConfig implements IBugMinerFairModeConfig {

                    /**
                     * Constructs a new BugMinerFairModeConfig.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBugMinerFairModeConfig);

                    /** BugMinerFairModeConfig enabled. */
                    public enabled: boolean;

                    /** BugMinerFairModeConfig battle. */
                    public battle: boolean;

                    /** BugMinerFairModeConfig levelId. */
                    public levelId: string;

                    /** BugMinerFairModeConfig timeLimit. */
                    public timeLimit: number;

                    /**
                     * Creates a new BugMinerFairModeConfig instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BugMinerFairModeConfig instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBugMinerFairModeConfig): com.triforge.protocol.proto.BugMinerFairModeConfig;

                    /**
                     * Encodes the specified BugMinerFairModeConfig message. Does not implicitly {@link com.triforge.protocol.proto.BugMinerFairModeConfig.verify|verify} messages.
                     * @param message BugMinerFairModeConfig message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBugMinerFairModeConfig, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BugMinerFairModeConfig message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BugMinerFairModeConfig.verify|verify} messages.
                     * @param message BugMinerFairModeConfig message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBugMinerFairModeConfig, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BugMinerFairModeConfig message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BugMinerFairModeConfig
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BugMinerFairModeConfig;

                    /**
                     * Decodes a BugMinerFairModeConfig message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BugMinerFairModeConfig
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BugMinerFairModeConfig;

                    /**
                     * Verifies a BugMinerFairModeConfig message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BugMinerFairModeConfig message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BugMinerFairModeConfig
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BugMinerFairModeConfig;

                    /**
                     * Creates a plain object from a BugMinerFairModeConfig message. Also converts values to other types if specified.
                     * @param message BugMinerFairModeConfig
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BugMinerFairModeConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BugMinerFairModeConfig to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BugMinerFairModeConfig
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BugMinerBattleState. */
                interface IBugMinerBattleState {

                    /** BugMinerBattleState levelId */
                    levelId?: (string|null);

                    /** BugMinerBattleState timeLimit */
                    timeLimit?: (number|null);

                    /** BugMinerBattleState timeRemaining */
                    timeRemaining?: (number|null);

                    /** BugMinerBattleState targetScore */
                    targetScore?: (number|null);

                    /** BugMinerBattleState items */
                    items?: (com.triforge.protocol.proto.IBugMinerPlacedItem[]|null);

                    /** BugMinerBattleState playerAId */
                    playerAId?: (number|Long|null);

                    /** BugMinerBattleState playerBId */
                    playerBId?: (number|Long|null);

                    /** BugMinerBattleState hookA */
                    hookA?: (com.triforge.protocol.proto.IBugMinerHookData|null);

                    /** BugMinerBattleState hookB */
                    hookB?: (com.triforge.protocol.proto.IBugMinerHookData|null);

                    /** BugMinerBattleState scoreA */
                    scoreA?: (number|null);

                    /** BugMinerBattleState scoreB */
                    scoreB?: (number|null);

                    /** BugMinerBattleState finished */
                    finished?: (boolean|null);

                    /** BugMinerBattleState winnerId */
                    winnerId?: (number|Long|null);

                    /** BugMinerBattleState endReason */
                    endReason?: (string|null);

                    /** BugMinerBattleState strengthBuffA */
                    strengthBuffA?: (number|null);

                    /** BugMinerBattleState strengthBuffB */
                    strengthBuffB?: (number|null);
                }

                /** Represents a BugMinerBattleState. */
                class BugMinerBattleState implements IBugMinerBattleState {

                    /**
                     * Constructs a new BugMinerBattleState.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBugMinerBattleState);

                    /** BugMinerBattleState levelId. */
                    public levelId: string;

                    /** BugMinerBattleState timeLimit. */
                    public timeLimit: number;

                    /** BugMinerBattleState timeRemaining. */
                    public timeRemaining: number;

                    /** BugMinerBattleState targetScore. */
                    public targetScore: number;

                    /** BugMinerBattleState items. */
                    public items: com.triforge.protocol.proto.IBugMinerPlacedItem[];

                    /** BugMinerBattleState playerAId. */
                    public playerAId: (number|Long);

                    /** BugMinerBattleState playerBId. */
                    public playerBId: (number|Long);

                    /** BugMinerBattleState hookA. */
                    public hookA?: (com.triforge.protocol.proto.IBugMinerHookData|null);

                    /** BugMinerBattleState hookB. */
                    public hookB?: (com.triforge.protocol.proto.IBugMinerHookData|null);

                    /** BugMinerBattleState scoreA. */
                    public scoreA: number;

                    /** BugMinerBattleState scoreB. */
                    public scoreB: number;

                    /** BugMinerBattleState finished. */
                    public finished: boolean;

                    /** BugMinerBattleState winnerId. */
                    public winnerId: (number|Long);

                    /** BugMinerBattleState endReason. */
                    public endReason: string;

                    /** BugMinerBattleState strengthBuffA. */
                    public strengthBuffA: number;

                    /** BugMinerBattleState strengthBuffB. */
                    public strengthBuffB: number;

                    /**
                     * Creates a new BugMinerBattleState instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BugMinerBattleState instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBugMinerBattleState): com.triforge.protocol.proto.BugMinerBattleState;

                    /**
                     * Encodes the specified BugMinerBattleState message. Does not implicitly {@link com.triforge.protocol.proto.BugMinerBattleState.verify|verify} messages.
                     * @param message BugMinerBattleState message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBugMinerBattleState, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BugMinerBattleState message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BugMinerBattleState.verify|verify} messages.
                     * @param message BugMinerBattleState message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBugMinerBattleState, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BugMinerBattleState message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BugMinerBattleState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BugMinerBattleState;

                    /**
                     * Decodes a BugMinerBattleState message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BugMinerBattleState
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BugMinerBattleState;

                    /**
                     * Verifies a BugMinerBattleState message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BugMinerBattleState message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BugMinerBattleState
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BugMinerBattleState;

                    /**
                     * Creates a plain object from a BugMinerBattleState message. Also converts values to other types if specified.
                     * @param message BugMinerBattleState
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BugMinerBattleState, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BugMinerBattleState to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BugMinerBattleState
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BMSetLevelCommand. */
                interface IBMSetLevelCommand {

                    /** BMSetLevelCommand levelId */
                    levelId?: (string|null);
                }

                /** Represents a BMSetLevelCommand. */
                class BMSetLevelCommand implements IBMSetLevelCommand {

                    /**
                     * Constructs a new BMSetLevelCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBMSetLevelCommand);

                    /** BMSetLevelCommand levelId. */
                    public levelId: string;

                    /**
                     * Creates a new BMSetLevelCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BMSetLevelCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBMSetLevelCommand): com.triforge.protocol.proto.BMSetLevelCommand;

                    /**
                     * Encodes the specified BMSetLevelCommand message. Does not implicitly {@link com.triforge.protocol.proto.BMSetLevelCommand.verify|verify} messages.
                     * @param message BMSetLevelCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBMSetLevelCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BMSetLevelCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BMSetLevelCommand.verify|verify} messages.
                     * @param message BMSetLevelCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBMSetLevelCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BMSetLevelCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BMSetLevelCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BMSetLevelCommand;

                    /**
                     * Decodes a BMSetLevelCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BMSetLevelCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BMSetLevelCommand;

                    /**
                     * Verifies a BMSetLevelCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BMSetLevelCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BMSetLevelCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BMSetLevelCommand;

                    /**
                     * Creates a plain object from a BMSetLevelCommand message. Also converts values to other types if specified.
                     * @param message BMSetLevelCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BMSetLevelCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BMSetLevelCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BMSetLevelCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BMSetTimeLimitCommand. */
                interface IBMSetTimeLimitCommand {

                    /** BMSetTimeLimitCommand timeLimit */
                    timeLimit?: (number|null);
                }

                /** Represents a BMSetTimeLimitCommand. */
                class BMSetTimeLimitCommand implements IBMSetTimeLimitCommand {

                    /**
                     * Constructs a new BMSetTimeLimitCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBMSetTimeLimitCommand);

                    /** BMSetTimeLimitCommand timeLimit. */
                    public timeLimit: number;

                    /**
                     * Creates a new BMSetTimeLimitCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BMSetTimeLimitCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBMSetTimeLimitCommand): com.triforge.protocol.proto.BMSetTimeLimitCommand;

                    /**
                     * Encodes the specified BMSetTimeLimitCommand message. Does not implicitly {@link com.triforge.protocol.proto.BMSetTimeLimitCommand.verify|verify} messages.
                     * @param message BMSetTimeLimitCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBMSetTimeLimitCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BMSetTimeLimitCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BMSetTimeLimitCommand.verify|verify} messages.
                     * @param message BMSetTimeLimitCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBMSetTimeLimitCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BMSetTimeLimitCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BMSetTimeLimitCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BMSetTimeLimitCommand;

                    /**
                     * Decodes a BMSetTimeLimitCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BMSetTimeLimitCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BMSetTimeLimitCommand;

                    /**
                     * Verifies a BMSetTimeLimitCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BMSetTimeLimitCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BMSetTimeLimitCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BMSetTimeLimitCommand;

                    /**
                     * Creates a plain object from a BMSetTimeLimitCommand message. Also converts values to other types if specified.
                     * @param message BMSetTimeLimitCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BMSetTimeLimitCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BMSetTimeLimitCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BMSetTimeLimitCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BMPlaceItemCommand. */
                interface IBMPlaceItemCommand {

                    /** BMPlaceItemCommand itemId */
                    itemId?: (string|null);

                    /** BMPlaceItemCommand x */
                    x?: (number|null);

                    /** BMPlaceItemCommand y */
                    y?: (number|null);
                }

                /** Represents a BMPlaceItemCommand. */
                class BMPlaceItemCommand implements IBMPlaceItemCommand {

                    /**
                     * Constructs a new BMPlaceItemCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBMPlaceItemCommand);

                    /** BMPlaceItemCommand itemId. */
                    public itemId: string;

                    /** BMPlaceItemCommand x. */
                    public x: number;

                    /** BMPlaceItemCommand y. */
                    public y: number;

                    /**
                     * Creates a new BMPlaceItemCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BMPlaceItemCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBMPlaceItemCommand): com.triforge.protocol.proto.BMPlaceItemCommand;

                    /**
                     * Encodes the specified BMPlaceItemCommand message. Does not implicitly {@link com.triforge.protocol.proto.BMPlaceItemCommand.verify|verify} messages.
                     * @param message BMPlaceItemCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBMPlaceItemCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BMPlaceItemCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BMPlaceItemCommand.verify|verify} messages.
                     * @param message BMPlaceItemCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBMPlaceItemCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BMPlaceItemCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BMPlaceItemCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BMPlaceItemCommand;

                    /**
                     * Decodes a BMPlaceItemCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BMPlaceItemCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BMPlaceItemCommand;

                    /**
                     * Verifies a BMPlaceItemCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BMPlaceItemCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BMPlaceItemCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BMPlaceItemCommand;

                    /**
                     * Creates a plain object from a BMPlaceItemCommand message. Also converts values to other types if specified.
                     * @param message BMPlaceItemCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BMPlaceItemCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BMPlaceItemCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BMPlaceItemCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BMAutoArrangeCommand. */
                interface IBMAutoArrangeCommand {
                }

                /** Represents a BMAutoArrangeCommand. */
                class BMAutoArrangeCommand implements IBMAutoArrangeCommand {

                    /**
                     * Constructs a new BMAutoArrangeCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBMAutoArrangeCommand);

                    /**
                     * Creates a new BMAutoArrangeCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BMAutoArrangeCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBMAutoArrangeCommand): com.triforge.protocol.proto.BMAutoArrangeCommand;

                    /**
                     * Encodes the specified BMAutoArrangeCommand message. Does not implicitly {@link com.triforge.protocol.proto.BMAutoArrangeCommand.verify|verify} messages.
                     * @param message BMAutoArrangeCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBMAutoArrangeCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BMAutoArrangeCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BMAutoArrangeCommand.verify|verify} messages.
                     * @param message BMAutoArrangeCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBMAutoArrangeCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BMAutoArrangeCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BMAutoArrangeCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BMAutoArrangeCommand;

                    /**
                     * Decodes a BMAutoArrangeCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BMAutoArrangeCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BMAutoArrangeCommand;

                    /**
                     * Verifies a BMAutoArrangeCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BMAutoArrangeCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BMAutoArrangeCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BMAutoArrangeCommand;

                    /**
                     * Creates a plain object from a BMAutoArrangeCommand message. Also converts values to other types if specified.
                     * @param message BMAutoArrangeCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BMAutoArrangeCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BMAutoArrangeCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BMAutoArrangeCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BMLockMapCommand. */
                interface IBMLockMapCommand {
                }

                /** Represents a BMLockMapCommand. */
                class BMLockMapCommand implements IBMLockMapCommand {

                    /**
                     * Constructs a new BMLockMapCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBMLockMapCommand);

                    /**
                     * Creates a new BMLockMapCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BMLockMapCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBMLockMapCommand): com.triforge.protocol.proto.BMLockMapCommand;

                    /**
                     * Encodes the specified BMLockMapCommand message. Does not implicitly {@link com.triforge.protocol.proto.BMLockMapCommand.verify|verify} messages.
                     * @param message BMLockMapCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBMLockMapCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BMLockMapCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BMLockMapCommand.verify|verify} messages.
                     * @param message BMLockMapCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBMLockMapCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BMLockMapCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BMLockMapCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BMLockMapCommand;

                    /**
                     * Decodes a BMLockMapCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BMLockMapCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BMLockMapCommand;

                    /**
                     * Verifies a BMLockMapCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BMLockMapCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BMLockMapCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BMLockMapCommand;

                    /**
                     * Creates a plain object from a BMLockMapCommand message. Also converts values to other types if specified.
                     * @param message BMLockMapCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BMLockMapCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BMLockMapCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BMLockMapCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BMFireHookCommand. */
                interface IBMFireHookCommand {
                }

                /** Represents a BMFireHookCommand. */
                class BMFireHookCommand implements IBMFireHookCommand {

                    /**
                     * Constructs a new BMFireHookCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBMFireHookCommand);

                    /**
                     * Creates a new BMFireHookCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BMFireHookCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBMFireHookCommand): com.triforge.protocol.proto.BMFireHookCommand;

                    /**
                     * Encodes the specified BMFireHookCommand message. Does not implicitly {@link com.triforge.protocol.proto.BMFireHookCommand.verify|verify} messages.
                     * @param message BMFireHookCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBMFireHookCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BMFireHookCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BMFireHookCommand.verify|verify} messages.
                     * @param message BMFireHookCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBMFireHookCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BMFireHookCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BMFireHookCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BMFireHookCommand;

                    /**
                     * Decodes a BMFireHookCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BMFireHookCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BMFireHookCommand;

                    /**
                     * Verifies a BMFireHookCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BMFireHookCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BMFireHookCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BMFireHookCommand;

                    /**
                     * Creates a plain object from a BMFireHookCommand message. Also converts values to other types if specified.
                     * @param message BMFireHookCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BMFireHookCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BMFireHookCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BMFireHookCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BMConfigureFairModeCommand. */
                interface IBMConfigureFairModeCommand {

                    /** BMConfigureFairModeCommand enabled */
                    enabled?: (boolean|null);

                    /** BMConfigureFairModeCommand battle */
                    battle?: (boolean|null);

                    /** BMConfigureFairModeCommand levelId */
                    levelId?: (string|null);

                    /** BMConfigureFairModeCommand timeLimit */
                    timeLimit?: (number|null);
                }

                /** Represents a BMConfigureFairModeCommand. */
                class BMConfigureFairModeCommand implements IBMConfigureFairModeCommand {

                    /**
                     * Constructs a new BMConfigureFairModeCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBMConfigureFairModeCommand);

                    /** BMConfigureFairModeCommand enabled. */
                    public enabled?: (boolean|null);

                    /** BMConfigureFairModeCommand battle. */
                    public battle?: (boolean|null);

                    /** BMConfigureFairModeCommand levelId. */
                    public levelId?: (string|null);

                    /** BMConfigureFairModeCommand timeLimit. */
                    public timeLimit?: (number|null);

                    /**
                     * Creates a new BMConfigureFairModeCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BMConfigureFairModeCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBMConfigureFairModeCommand): com.triforge.protocol.proto.BMConfigureFairModeCommand;

                    /**
                     * Encodes the specified BMConfigureFairModeCommand message. Does not implicitly {@link com.triforge.protocol.proto.BMConfigureFairModeCommand.verify|verify} messages.
                     * @param message BMConfigureFairModeCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBMConfigureFairModeCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BMConfigureFairModeCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BMConfigureFairModeCommand.verify|verify} messages.
                     * @param message BMConfigureFairModeCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBMConfigureFairModeCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BMConfigureFairModeCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BMConfigureFairModeCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BMConfigureFairModeCommand;

                    /**
                     * Decodes a BMConfigureFairModeCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BMConfigureFairModeCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BMConfigureFairModeCommand;

                    /**
                     * Verifies a BMConfigureFairModeCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BMConfigureFairModeCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BMConfigureFairModeCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BMConfigureFairModeCommand;

                    /**
                     * Creates a plain object from a BMConfigureFairModeCommand message. Also converts values to other types if specified.
                     * @param message BMConfigureFairModeCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BMConfigureFairModeCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BMConfigureFairModeCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BMConfigureFairModeCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BMPauseCommand. */
                interface IBMPauseCommand {

                    /** BMPauseCommand paused */
                    paused?: (boolean|null);
                }

                /** Represents a BMPauseCommand. */
                class BMPauseCommand implements IBMPauseCommand {

                    /**
                     * Constructs a new BMPauseCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBMPauseCommand);

                    /** BMPauseCommand paused. */
                    public paused: boolean;

                    /**
                     * Creates a new BMPauseCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BMPauseCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBMPauseCommand): com.triforge.protocol.proto.BMPauseCommand;

                    /**
                     * Encodes the specified BMPauseCommand message. Does not implicitly {@link com.triforge.protocol.proto.BMPauseCommand.verify|verify} messages.
                     * @param message BMPauseCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBMPauseCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BMPauseCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BMPauseCommand.verify|verify} messages.
                     * @param message BMPauseCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBMPauseCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BMPauseCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BMPauseCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BMPauseCommand;

                    /**
                     * Decodes a BMPauseCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BMPauseCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BMPauseCommand;

                    /**
                     * Verifies a BMPauseCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BMPauseCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BMPauseCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BMPauseCommand;

                    /**
                     * Creates a plain object from a BMPauseCommand message. Also converts values to other types if specified.
                     * @param message BMPauseCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BMPauseCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BMPauseCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BMPauseCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BMRestartCommand. */
                interface IBMRestartCommand {
                }

                /** Represents a BMRestartCommand. */
                class BMRestartCommand implements IBMRestartCommand {

                    /**
                     * Constructs a new BMRestartCommand.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBMRestartCommand);

                    /**
                     * Creates a new BMRestartCommand instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BMRestartCommand instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBMRestartCommand): com.triforge.protocol.proto.BMRestartCommand;

                    /**
                     * Encodes the specified BMRestartCommand message. Does not implicitly {@link com.triforge.protocol.proto.BMRestartCommand.verify|verify} messages.
                     * @param message BMRestartCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBMRestartCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BMRestartCommand message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BMRestartCommand.verify|verify} messages.
                     * @param message BMRestartCommand message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBMRestartCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BMRestartCommand message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BMRestartCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BMRestartCommand;

                    /**
                     * Decodes a BMRestartCommand message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BMRestartCommand
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BMRestartCommand;

                    /**
                     * Verifies a BMRestartCommand message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BMRestartCommand message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BMRestartCommand
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BMRestartCommand;

                    /**
                     * Creates a plain object from a BMRestartCommand message. Also converts values to other types if specified.
                     * @param message BMRestartCommand
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BMRestartCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BMRestartCommand to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BMRestartCommand
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }

                /** Properties of a BugMinerMessage. */
                interface IBugMinerMessage {

                    /** BugMinerMessage setLevel */
                    setLevel?: (com.triforge.protocol.proto.IBMSetLevelCommand|null);

                    /** BugMinerMessage setTimeLimit */
                    setTimeLimit?: (com.triforge.protocol.proto.IBMSetTimeLimitCommand|null);

                    /** BugMinerMessage placeItem */
                    placeItem?: (com.triforge.protocol.proto.IBMPlaceItemCommand|null);

                    /** BugMinerMessage autoArrange */
                    autoArrange?: (com.triforge.protocol.proto.IBMAutoArrangeCommand|null);

                    /** BugMinerMessage lockMap */
                    lockMap?: (com.triforge.protocol.proto.IBMLockMapCommand|null);

                    /** BugMinerMessage fireHook */
                    fireHook?: (com.triforge.protocol.proto.IBMFireHookCommand|null);

                    /** BugMinerMessage board */
                    board?: (com.triforge.protocol.proto.IBugMinerBoardState|null);

                    /** BugMinerMessage configureFairMode */
                    configureFairMode?: (com.triforge.protocol.proto.IBMConfigureFairModeCommand|null);

                    /** BugMinerMessage pause */
                    pause?: (com.triforge.protocol.proto.IBMPauseCommand|null);

                    /** BugMinerMessage restart */
                    restart?: (com.triforge.protocol.proto.IBMRestartCommand|null);
                }

                /** Represents a BugMinerMessage. */
                class BugMinerMessage implements IBugMinerMessage {

                    /**
                     * Constructs a new BugMinerMessage.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: com.triforge.protocol.proto.IBugMinerMessage);

                    /** BugMinerMessage setLevel. */
                    public setLevel?: (com.triforge.protocol.proto.IBMSetLevelCommand|null);

                    /** BugMinerMessage setTimeLimit. */
                    public setTimeLimit?: (com.triforge.protocol.proto.IBMSetTimeLimitCommand|null);

                    /** BugMinerMessage placeItem. */
                    public placeItem?: (com.triforge.protocol.proto.IBMPlaceItemCommand|null);

                    /** BugMinerMessage autoArrange. */
                    public autoArrange?: (com.triforge.protocol.proto.IBMAutoArrangeCommand|null);

                    /** BugMinerMessage lockMap. */
                    public lockMap?: (com.triforge.protocol.proto.IBMLockMapCommand|null);

                    /** BugMinerMessage fireHook. */
                    public fireHook?: (com.triforge.protocol.proto.IBMFireHookCommand|null);

                    /** BugMinerMessage board. */
                    public board?: (com.triforge.protocol.proto.IBugMinerBoardState|null);

                    /** BugMinerMessage configureFairMode. */
                    public configureFairMode?: (com.triforge.protocol.proto.IBMConfigureFairModeCommand|null);

                    /** BugMinerMessage pause. */
                    public pause?: (com.triforge.protocol.proto.IBMPauseCommand|null);

                    /** BugMinerMessage restart. */
                    public restart?: (com.triforge.protocol.proto.IBMRestartCommand|null);

                    /** BugMinerMessage content. */
                    public content?: ("setLevel"|"setTimeLimit"|"placeItem"|"autoArrange"|"lockMap"|"fireHook"|"board"|"configureFairMode"|"pause"|"restart");

                    /**
                     * Creates a new BugMinerMessage instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns BugMinerMessage instance
                     */
                    public static create(properties?: com.triforge.protocol.proto.IBugMinerMessage): com.triforge.protocol.proto.BugMinerMessage;

                    /**
                     * Encodes the specified BugMinerMessage message. Does not implicitly {@link com.triforge.protocol.proto.BugMinerMessage.verify|verify} messages.
                     * @param message BugMinerMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: com.triforge.protocol.proto.IBugMinerMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified BugMinerMessage message, length delimited. Does not implicitly {@link com.triforge.protocol.proto.BugMinerMessage.verify|verify} messages.
                     * @param message BugMinerMessage message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: com.triforge.protocol.proto.IBugMinerMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a BugMinerMessage message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns BugMinerMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): com.triforge.protocol.proto.BugMinerMessage;

                    /**
                     * Decodes a BugMinerMessage message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns BugMinerMessage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): com.triforge.protocol.proto.BugMinerMessage;

                    /**
                     * Verifies a BugMinerMessage message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a BugMinerMessage message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns BugMinerMessage
                     */
                    public static fromObject(object: { [k: string]: any }): com.triforge.protocol.proto.BugMinerMessage;

                    /**
                     * Creates a plain object from a BugMinerMessage message. Also converts values to other types if specified.
                     * @param message BugMinerMessage
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: com.triforge.protocol.proto.BugMinerMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this BugMinerMessage to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for BugMinerMessage
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }
        }
    }
}
