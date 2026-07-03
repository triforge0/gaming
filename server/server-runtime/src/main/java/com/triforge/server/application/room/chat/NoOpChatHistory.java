package com.triforge.server.application.room.chat;

import com.triforge.protocol.proto.ChatMessage;

import java.util.List;

public final class NoOpChatHistory implements ChatHistory {

    @Override
    public void append(ChatMessage message) {
    }

    @Override
    public List<ChatMessage> recent(int limit) {
        return List.of();
    }
}
