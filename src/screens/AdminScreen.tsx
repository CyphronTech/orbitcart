import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../components/Card";
import { colors, spacing, type, weight } from "../theme/theme";
import type { ActivityLog, WorkspaceSetup } from "../types/domain";

type AdminScreenProps = {
  activity: ActivityLog[];
  onAdminAction: (action: string, entity: string) => Promise<void>;
  setup: WorkspaceSetup;
};

export function AdminScreen({ activity, onAdminAction, setup }: AdminScreenProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Admin</Text>
      <Text style={styles.subtitle}>Controls that make OrbitCart feel like a real B2B workspace.</Text>

      <Card style={styles.identityCard}>
        <Text style={styles.kicker}>Workspace</Text>
        <Text style={styles.workspace}>{setup.businessName}</Text>
        <Text style={styles.meta}>{setup.gstin} · {setup.primaryWarehouse}</Text>
        <View style={styles.rolePill}>
          <Text style={styles.roleText}>{setup.role}</Text>
        </View>
      </Card>

      <Text style={styles.sectionLabel}>Operations tools</Text>
      <View style={styles.toolGrid}>
        <ToolCard title="CSV import" copy="Load catalog from Excel/Tally export." onPress={() => onAdminAction("Imported stock CSV", "catalog-import.csv")} />
        <ToolCard title="Export reports" copy="Generate weekly XLS summary." onPress={() => onAdminAction("Exported reports", "weekly-ops.xlsx")} />
        <ToolCard title="Barcode scan" copy="Simulate scan-to-receive flow." onPress={() => onAdminAction("Scanned barcode", "SKU 8821")} />
        <ToolCard title="Offline sync" copy="Queued 3 warehouse actions." onPress={() => onAdminAction("Synced offline queue", "3 actions")} />
      </View>

      <Text style={styles.sectionLabel}>Notifications & integrations</Text>
      <Card>
        <SettingRow label="Low-stock push alerts" value="Enabled" onPress={() => onAdminAction("Updated notification rule", "Low-stock push alerts")} />
        <SettingRow label="Supplier email nudges" value="Every 24h" onPress={() => onAdminAction("Updated supplier nudge cadence", "Every 24h")} />
        <SettingRow label="Tally/Zoho Books sync" value="Sandbox connected" onPress={() => onAdminAction("Checked accounting sync", "Tally sandbox")} />
        <SettingRow label="WhatsApp supplier follow-up" value="Template ready" onPress={() => onAdminAction("Prepared WhatsApp follow-up", "PO supplier template")} />
      </Card>

      <Text style={styles.sectionLabel}>Team roles</Text>
      <Card>
        {["Owner · Full access", "Manager · Approvals + reports", "Warehouse Staff · Stock + scans", "Sales/Ops · Orders only"].map((role) => (
          <Text key={role} style={styles.roleLine}>{role}</Text>
        ))}
      </Card>

      <Text style={styles.sectionLabel}>Audit trail</Text>
      {activity.slice(0, 6).map((item) => (
        <Card key={item.id}>
          <Text style={styles.auditAction}>{item.action}</Text>
          <Text style={styles.auditMeta}>{item.entity} · {item.actor} · {item.timestamp}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

function ToolCard({ copy, onPress, title }: { copy: string; onPress: () => void; title: string }) {
  return (
    <TouchableOpacity style={styles.toolCard} onPress={onPress}>
      <Text style={styles.toolTitle}>{title}</Text>
      <Text style={styles.toolCopy}>{copy}</Text>
    </TouchableOpacity>
  );
}

function SettingRow({ label, onPress, value }: { label: string; onPress: () => void; value: string }) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.settingValue}>{value}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: type.screenTitle,
    fontWeight: weight.black,
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: type.bodyLarge,
    lineHeight: 23,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  identityCard: {
    borderColor: colors.green,
  },
  kicker: {
    color: colors.green,
    fontSize: type.micro,
    fontWeight: weight.heavy,
    letterSpacing: 0.45,
    textTransform: "uppercase",
  },
  workspace: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: weight.black,
    marginTop: spacing.xs,
  },
  meta: {
    color: colors.muted,
    fontSize: type.body,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  rolePill: {
    alignSelf: "flex-start",
    backgroundColor: colors.mint,
    borderRadius: 999,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  roleText: {
    color: colors.greenDark,
    fontSize: type.caption,
    fontWeight: weight.heavy,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: type.caption,
    fontWeight: weight.heavy,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
    textTransform: "uppercase",
  },
  toolGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  toolCard: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.md,
    width: "48%",
  },
  toolTitle: {
    color: colors.ink,
    fontSize: type.body,
    fontWeight: weight.black,
  },
  toolCopy: {
    color: colors.muted,
    fontSize: type.caption,
    lineHeight: 17,
    marginTop: spacing.xs,
  },
  settingRow: {
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    paddingVertical: spacing.md,
  },
  settingLabel: {
    color: colors.ink,
    fontSize: type.body,
    fontWeight: weight.heavy,
  },
  settingValue: {
    color: colors.greenDark,
    fontSize: type.caption,
    fontWeight: weight.heavy,
    marginTop: spacing.xs,
  },
  roleLine: {
    color: colors.ink,
    fontSize: type.body,
    fontWeight: weight.medium,
    marginBottom: spacing.sm,
  },
  auditAction: {
    color: colors.ink,
    fontSize: type.body,
    fontWeight: weight.heavy,
  },
  auditMeta: {
    color: colors.muted,
    fontSize: type.caption,
    marginTop: spacing.xs,
  },
});
