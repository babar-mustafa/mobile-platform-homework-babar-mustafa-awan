import React, { useCallback, useState, useRef } from 'react';
import { Modal, Pressable, ScrollView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Button, Card, Bubble, BubbleText, Input } from '../common';
import {
  routeCommand,
  executeConfirmedCommand,
  requiresConfirmation,
} from '../../commandRouter';
import { createExecutor } from '../../agent/executeCommand';
import { getAgentResponse } from '../../agent/agentResponses';
import type { Command } from '../../commandRouter/types';
import type { ChatMessage } from '../../types';
import { MESSAGE_ROLE_USER, MESSAGE_ROLE_AGENT, KEYBOARD_AVOIDING_BEHAVIOR } from '../../constants';
import {
  Overlay,
  Sheet,
  Header,
  HeaderTitle,
  CloseText,
  MessagesScroll,
  MessagesContent,
  Hint,
  ProposedWrap,
  ProposedTitle,
  ProposedCmd,
  ConfirmRow,
  Spacer,
  InputRow,
  SendBtn,
  SendText,
} from './styled';

interface AgentFlyoutProps {
  visible: boolean;
  onClose: () => void;
}

export function AgentFlyout({ visible, onClose }: AgentFlyoutProps) {
  const app = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingCommand, setPendingCommand] = useState<Command | null>(null);

  const execute = useCallback((cmd: Command) => createExecutor(app)(cmd), [app]);

  const runCommand = useCallback(
    (command: Command) => {
      const result = routeCommand(
        { type: command.type, payload: command.payload },
        {
          onExecuted: app.appendActivityLog,
          onRejected: app.appendActivityLog,
          execute,
        }
      );
      if (!result.accepted) return;
      if (result.needsConfirmation) {
        setPendingCommand(result.command);
        return;
      }
    },
    [app, execute]
  );

  const handleConfirm = useCallback(() => {
    if (!pendingCommand) return;
    if (pendingCommand.type === 'exportAuditLog') {
      const logText = app.getActivityLogText() || 'No entries yet.';
      executeConfirmedCommand(
        { ...pendingCommand, payload: { log: logText } },
        {
          onExecuted: app.appendActivityLog,
          onRejected: app.appendActivityLog,
          execute,
        }
      );
    } else {
      executeConfirmedCommand(pendingCommand, {
        onExecuted: app.appendActivityLog,
        onRejected: app.appendActivityLog,
        execute,
      });
    }
    setPendingCommand(null);
  }, [pendingCommand, app, execute]);

  const handleReject = useCallback(() => setPendingCommand(null), []);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((m) => [...m, { role: MESSAGE_ROLE_USER, text }]);

    const context = {
      currentScreen: app.currentScreen,
      exploreFilter: app.exploreFilter,
      exploreSort: app.exploreSort,
      profilePreference: app.profilePreference,
    };
    const { reply, proposedCommand } = getAgentResponse(text, context);
    setMessages((m) => [...m, { role: MESSAGE_ROLE_AGENT, text: reply }]);

    if (proposedCommand) {
      if (proposedCommand.type === 'showAlert') {
        const p = proposedCommand.payload as { title: string; message: string };
        if (p.title === 'Alert' && p.message === text) {
          runCommand({ ...proposedCommand, payload: { title: 'Alert', message: text } });
          return;
        }
      }
      runCommand(proposedCommand);
    }
  }, [input, app, runCommand]);

  const messagesScrollRef = useRef<ScrollView>(null);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Overlay behavior={KEYBOARD_AVOIDING_BEHAVIOR}>
        <Sheet>
          <Header>
            <HeaderTitle>Agent</HeaderTitle>
            <Pressable onPress={onClose} hitSlop={12}>
              <CloseText>Close</CloseText>
            </Pressable>
          </Header>

          <MessagesScroll
            ref={messagesScrollRef}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              messagesScrollRef.current?.scrollToEnd?.({ animated: true });
            }}
          >
            <MessagesContent>
              {messages.length === 0 && (
                <Hint>Ask what I can do, or try "Go to Explore".</Hint>
              )}
              {messages.map((msg, i) => (
                <Bubble key={i} isUser={msg.role === MESSAGE_ROLE_USER}>
                  <BubbleText isUser={msg.role === MESSAGE_ROLE_USER}>{msg.text}</BubbleText>
                </Bubble>
              ))}
            </MessagesContent>
          </MessagesScroll>

          {pendingCommand && (
            <ProposedWrap>
              <Card>
                <ProposedTitle>Proposed action</ProposedTitle>
                <ProposedCmd>
                  {pendingCommand.type} {JSON.stringify(pendingCommand.payload)}
                </ProposedCmd>
                {requiresConfirmation(pendingCommand.type) && (
                  <ProposedCmd>Confirm to run.</ProposedCmd>
                )}
                <ConfirmRow>
                  <Button title="Confirm" onPress={handleConfirm} variant="primary" />
                  <Spacer />
                  <Button title="Reject" onPress={handleReject} variant="danger" />
                </ConfirmRow>
              </Card>
            </ProposedWrap>
          )}

          <InputRow>
            <Input
              placeholder="Ask or request an action..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={send}
              returnKeyType="send"
            />
            <SendBtn onPress={send}>
              <SendText>Send</SendText>
            </SendBtn>
          </InputRow>
        </Sheet>
      </Overlay>
    </Modal>
  );
}
