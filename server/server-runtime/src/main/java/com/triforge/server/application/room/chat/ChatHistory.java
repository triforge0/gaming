package com.triforge.server.application.room.chat;

import com.triforge.protocol.proto.ChatMessage;

import java.util.List;

/** Optional chat scrollback; default impl is a no-op. */
public interface ChatHistory {

    void append(ChatMessage message);

    List<ChatMessage> recent(int limit);
}
