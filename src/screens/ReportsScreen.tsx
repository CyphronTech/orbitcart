import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Card } from "../components/Card";
import { colors, spacing, type, weight } from "../theme/theme";
import type { BusinessReport } from "../types/domain";

type ReportsScreenProps = {
  onSaveReport: (report: BusinessReport) => Promise<void>;
  reports: BusinessReport[];
};

const statuses: BusinessReport["status"][] = ["draft", "review", "shared"];

export function ReportsScreen({ onSaveReport, reports }: ReportsScreenProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("Maya Rao");
  const [period, setPeriod] = useState("");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<BusinessReport["status"]>("draft");
  const [isSaving, setIsSaving] = useState(false);

  function beginEdit(report: BusinessReport) {
    setEditingId(report.id);
    setTitle(report.title);
    setOwner(report.owner);
    setPeriod(report.period);
    setSummary(report.summary);
    setStatus(report.status);
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setOwner("Maya Rao");
    setPeriod("");
    setSummary("");
    setStatus("draft");
  }

  async function handleSave() {
    if (!title.trim() || !period.trim() || !summary.trim()) {
      Alert.alert("Report is incomplete", "Add title, period and summary before saving.");
      return;
    }

    setIsSaving(true);
    try {
      await onSaveReport({
        id: editingId ?? `rep-${Date.now()}`,
        title: title.trim(),
        owner: owner.trim() || "Maya Rao",
        period: period.trim(),
        summary: summary.trim(),
        status,
        updatedAt: "Just now",
      });
      resetForm();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.screenHeader}>
        <View>
          <Text style={styles.title}>Reports</Text>
          <Text style={styles.subtitle}>Create operational reports, update owners, and mark what is ready to share.</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countValue}>{reports.length}</Text>
          <Text style={styles.countLabel}>Live</Text>
        </View>
      </View>

      <Card style={styles.formCard}>
        <View style={styles.formTop}>
          <View>
            <Text style={styles.formTitle}>{editingId ? "Edit report" : "New report"}</Text>
            <Text style={styles.formHint}>Used for weekly reviews and client-facing operations updates.</Text>
          </View>
          {editingId ? (
            <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={styles.label}>Report title</Text>
        <TextInput placeholder="Weekly fill-rate report" placeholderTextColor={colors.mutedSoft} style={styles.input} value={title} onChangeText={setTitle} />

        <View style={styles.twoColumn}>
          <View style={styles.field}>
            <Text style={styles.label}>Owner</Text>
            <TextInput placeholder="Maya Rao" placeholderTextColor={colors.mutedSoft} style={styles.input} value={owner} onChangeText={setOwner} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Period</Text>
            <TextInput placeholder="July W3" placeholderTextColor={colors.mutedSoft} style={styles.input} value={period} onChangeText={setPeriod} />
          </View>
        </View>

        <Text style={styles.label}>Summary</Text>
        <TextInput
          multiline
          placeholder="Write what changed, what needs attention, and who owns the next action."
          placeholderTextColor={colors.mutedSoft}
          style={[styles.input, styles.textArea]}
          value={summary}
          onChangeText={setSummary}
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusRow}>
          {statuses.map((item) => (
            <TouchableOpacity key={item} style={[styles.statusChoice, status === item && styles.statusChoiceActive]} onPress={() => setStatus(item)}>
              <Text style={[styles.statusChoiceText, status === item && styles.statusChoiceTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity disabled={isSaving} style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{isSaving ? "Saving..." : editingId ? "Update report" : "Create report"}</Text>
        </TouchableOpacity>
      </Card>

      <Text style={styles.sectionLabel}>Report library</Text>
      {reports.map((report) => (
        <Card key={report.id}>
          <View style={styles.reportTop}>
            <View style={styles.reportText}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportMeta}>{report.period} · {report.owner} · {report.updatedAt}</Text>
            </View>
            <Text style={styles.statusBadge}>{report.status}</Text>
          </View>
          <Text style={styles.reportSummary}>{report.summary}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => beginEdit(report)}>
            <Text style={styles.editButtonText}>Edit report</Text>
          </TouchableOpacity>
        </Card>
      ))}
    </ScrollView>
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
    fontWeight: weight.regular,
    lineHeight: 23,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
    maxWidth: 260,
  },
  screenHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  countPill: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 58,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  countValue: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: weight.black,
  },
  countLabel: {
    color: colors.muted,
    fontSize: type.micro,
    fontWeight: weight.heavy,
    letterSpacing: 0.4,
  },
  formCard: {
    borderColor: colors.green,
    marginBottom: spacing.lg,
  },
  formTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  formTitle: {
    color: colors.ink,
    fontSize: type.cardTitle,
    fontWeight: weight.black,
  },
  formHint: {
    color: colors.muted,
    fontSize: type.caption,
    fontWeight: weight.medium,
    lineHeight: 17,
    marginTop: spacing.xs,
    maxWidth: 220,
  },
  cancelButton: {
    backgroundColor: colors.mint,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cancelButtonText: {
    color: colors.greenDark,
    fontSize: type.caption,
    fontWeight: weight.heavy,
  },
  label: {
    color: colors.inkSoft,
    fontSize: type.micro,
    fontWeight: weight.heavy,
    letterSpacing: 0.35,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.ink,
    fontSize: type.body,
    fontWeight: weight.semibold,
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  textArea: {
    minHeight: 92,
    paddingTop: spacing.md,
    textAlignVertical: "top",
  },
  twoColumn: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  field: {
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statusChoice: {
    alignItems: "center",
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  statusChoiceActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  statusChoiceText: {
    color: colors.muted,
    fontSize: type.caption,
    fontWeight: weight.heavy,
    textTransform: "capitalize",
  },
  statusChoiceTextActive: {
    color: colors.white,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.greenDark,
    borderRadius: 14,
    marginTop: spacing.lg,
    paddingVertical: 14,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: type.body,
    fontWeight: weight.heavy,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: type.caption,
    fontWeight: weight.heavy,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
  reportTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  reportText: {
    flex: 1,
  },
  reportTitle: {
    color: colors.ink,
    fontSize: type.cardTitle,
    fontWeight: weight.heavy,
    lineHeight: 22,
  },
  reportMeta: {
    color: colors.muted,
    fontSize: type.caption,
    fontWeight: weight.medium,
    marginTop: spacing.xs,
  },
  statusBadge: {
    backgroundColor: colors.mint,
    borderRadius: 999,
    color: colors.greenDark,
    fontSize: type.micro,
    fontWeight: weight.heavy,
    overflow: "hidden",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    textTransform: "capitalize",
  },
  reportSummary: {
    color: colors.muted,
    fontSize: type.body,
    fontWeight: weight.regular,
    lineHeight: 20,
    marginTop: spacing.md,
  },
  editButton: {
    alignItems: "center",
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  editButtonText: {
    color: colors.ink,
    fontSize: type.caption,
    fontWeight: weight.heavy,
  },
});
