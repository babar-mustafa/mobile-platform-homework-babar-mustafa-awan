import React from 'react';
import { ScrollView, Switch } from 'react-native';
import { useApp } from '../../context/AppContext';
import { ScreenContainer, PageTitle, Label, Card, Button } from '../../components/common';
import { colors } from '../../theme';
import type { AuditEntry } from '../../commandRouter/types';
import {
  SectionTitle,
  CardMargin,
  LogCardMargin,
  EmptyLog,
  LogEntry,
  Outcome,
  CommandType,
  Reason,
  ButtonSpacer,
} from './styled';

function LogEntryRow({ entry }: { entry: AuditEntry }) {
  return (
    <LogEntry>
      <Outcome rejected={entry.outcome === 'rejected'}>{entry.outcome}</Outcome>
      <CommandType>{entry.command.type}</CommandType>
      {entry.reason ? <Reason>{entry.reason}</Reason> : null}
    </LogEntry>
  );
}

export function ProfileScreen() {
  const {
    profilePreference,
    setProfilePreference,
    activityLog,
    getActivityLogText,
    setFlyoutOpen,
  } = useApp();

  const handleExport = () => {
    const { NativeModules } = require('react-native');
    const AuditLogExport = NativeModules.AuditLogExport;
    if (AuditLogExport?.exportAuditLog) {
      AuditLogExport.exportAuditLog(getActivityLogText() || 'No entries yet.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenContainer>
        <PageTitle>Profile</PageTitle>

        <CardMargin>
          <Card>
            <Label>Notifications (persistent preference)</Label>
            <Switch
              value={profilePreference}
              onValueChange={setProfilePreference}
              trackColor={{ false: colors.borderLight, true: '#93c5fd' }}
              thumbColor={profilePreference ? colors.primary : '#f3f4f6'}
            />
          </Card>
        </CardMargin>

        <SectionTitle>Agent Activity Log</SectionTitle>
        <LogCardMargin>
          <Card>
            {activityLog.length === 0 ? (
              <EmptyLog>No commands yet. Use the agent to perform actions.</EmptyLog>
            ) : (
              activityLog.map((entry) => <LogEntryRow key={entry.id} entry={entry} />)
            )}
          </Card>
        </LogCardMargin>

        {activityLog.length > 0 && (
          <>
            <Button title="Export audit log" onPress={handleExport} variant="secondary" />
            <ButtonSpacer />
          </>
        )}
        <Button title="Open Agent" onPress={() => setFlyoutOpen(true)} variant="secondary" />
      </ScreenContainer>
    </ScrollView>
  );
}
