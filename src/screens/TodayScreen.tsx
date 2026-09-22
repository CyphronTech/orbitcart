import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../components/Card";
import { RiskBadge } from "../components/RiskBadge";
import { colors, spacing, type, weight } from "../theme/theme";
import type { Dashboard } from "../types/domain";

export function TodayScreen({ dashboard }: { dashboard: Dashboard }) {
  const recommendation = dashboard.recommendations[0];
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [decision, setDecision] = useState<"approved" | "snoozed" | null>(null);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Today</Text>
      <Text style={styles.subtitle}>The few stock decisions that need attention before noon.</Text>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Plan updated at 8:42</Text>
        <Text style={styles.summaryTitle}>{dashboard.approvalsNeeded} approvals protect {dashboard.fillRateProtected} fill rate</Text>
        <Text style={styles.summaryCopy}>Paper goods are tight, coffee is moving faster than usual, and two suppliers still owe an ETA.</Text>
        <View style={styles.metricRow}>
          <Metric value={dashboard.suggestedPoValue} label="Suggested PO" />
          <Metric value={String(dashboard.purchaseOrders.filter((po) => po.status !== "reconciled").length)} label="Open POs" />
          <Metric value={String(dashboard.reports.length)} label="Reports" />
        </View>
      </View>
      <Text style={styles.sectionLabel}>Operating pulse</Text>
      <View style={styles.pulseGrid}>
        <PulseCard value={String(dashboard.products.filter((product) => product.risk === "critical").length)} label="Critical SKUs" />
        <PulseCard value={String(dashboard.orders.filter((order) => order.risk !== "safe").length)} label="Orders at risk" />
        <PulseCard value={String(dashboard.activity.length)} label="Audit events" />
      </View>
      <Text style={styles.sectionLabel}>Priority Queue</Text>
      <Card style={styles.recommendation}>
        <View style={styles.row}>
          <Text style={styles.cardTitle}>{recommendation.title}</Text>
          <RiskBadge risk="critical" />
        </View>
        <Text style={styles.cardCopy}>{recommendation.summary}</Text>
        <TouchableOpacity style={styles.action} onPress={() => setIsReviewOpen((value) => !value)}>
          <Text style={styles.actionText}>{isReviewOpen ? "Hide recommendation" : "Review recommendation"}</Text>
        </TouchableOpacity>
      </Card>
      {isReviewOpen ? (
        <Card style={styles.reviewPanel}>
          <View style={styles.reviewHeader}>
            <View>
              <Text style={styles.reviewKicker}>AI reorder review</Text>
              <Text style={styles.reviewTitle}>Greenleaf Tissue · {recommendation.suggestedQuantity} units</Text>
            </View>
            <Text style={styles.confidence}>{recommendation.confidence}% confidence</Text>
          </View>
          <View style={styles.divider} />
          <ReviewRow label="Why now" value="Cover falls below 3 days after Marriott ships tomorrow." />
          <ReviewRow label="Customer impact" value={`${recommendation.affectedOrders} open orders protected from partial fulfilment.`} />
          <ReviewRow label="Supplier note" value="Greenleaf Paper Co. usually confirms within 4 business hours." />
          <View style={styles.decisionRow}>
            <TouchableOpacity style={styles.approveButton} onPress={() => setDecision("approved")}>
              <Text style={styles.approveButtonText}>Approve PO draft</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.snoozeButton} onPress={() => setDecision("snoozed")}>
              <Text style={styles.snoozeButtonText}>Snooze</Text>
            </TouchableOpacity>
          </View>
          {decision ? (
            <Text style={styles.decisionNote}>
              {decision === "approved" ? "PO draft marked approved for purchase review." : "Recommendation snoozed until tomorrow morning."}
            </Text>
          ) : null}
        </Card>
      ) : null}
    </ScrollView>
  );
}

function PulseCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.pulseCard}>
      <Text style={styles.pulseValue}>{value}</Text>
      <Text style={styles.pulseLabel}>{label}</Text>
    </View>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value}</Text>
    </View>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
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
  },
  summary: {
    backgroundColor: colors.ink,
    borderRadius: 20,
    padding: spacing.lg,
  },
  summaryLabel: {
    color: colors.mint,
    fontSize: type.caption,
    fontWeight: weight.heavy,
    letterSpacing: 0.35,
    textTransform: "uppercase",
  },
  summaryTitle: {
    color: colors.white,
    fontSize: type.hero,
    fontWeight: weight.black,
    letterSpacing: -0.7,
    lineHeight: 33,
    marginTop: spacing.sm,
  },
  summaryCopy: {
    color: "#C8D0D4",
    fontSize: type.body,
    fontWeight: weight.regular,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  metric: {
    backgroundColor: "#26323D",
    borderRadius: 14,
    flex: 1,
    padding: spacing.md,
  },
  metricValue: {
    color: colors.white,
    fontSize: 20,
    fontWeight: weight.black,
  },
  metricLabel: {
    color: "#C8D0D4",
    fontSize: type.micro,
    fontWeight: weight.medium,
    marginTop: spacing.xs,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: type.caption,
    fontWeight: weight.heavy,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.xl,
    textTransform: "uppercase",
  },
  pulseGrid: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  pulseCard: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    padding: spacing.md,
  },
  pulseValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: weight.black,
  },
  pulseLabel: {
    color: colors.muted,
    fontSize: type.micro,
    fontWeight: weight.heavy,
    lineHeight: 15,
    marginTop: spacing.xs,
    textTransform: "uppercase",
  },
  recommendation: {
    backgroundColor: colors.mint,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: colors.ink,
    flex: 1,
    fontSize: type.cardTitle,
    fontWeight: weight.heavy,
    lineHeight: 22,
    paddingRight: spacing.md,
  },
  cardCopy: {
    color: colors.muted,
    fontSize: type.body,
    fontWeight: weight.regular,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  action: {
    alignItems: "center",
    backgroundColor: colors.ink,
    borderRadius: 12,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  actionText: {
    color: colors.white,
    fontSize: type.body,
    fontWeight: weight.heavy,
  },
  reviewPanel: {
    backgroundColor: colors.white,
    borderColor: colors.green,
  },
  reviewHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  reviewKicker: {
    color: colors.green,
    fontSize: type.micro,
    fontWeight: weight.heavy,
    letterSpacing: 0.45,
    textTransform: "uppercase",
  },
  reviewTitle: {
    color: colors.ink,
    fontSize: type.cardTitle,
    fontWeight: weight.black,
    lineHeight: 22,
    marginTop: spacing.xs,
    maxWidth: 210,
  },
  confidence: {
    backgroundColor: colors.mint,
    borderRadius: 999,
    color: colors.greenDark,
    fontSize: type.micro,
    fontWeight: weight.heavy,
    overflow: "hidden",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  divider: {
    backgroundColor: colors.line,
    height: 1,
    marginVertical: spacing.md,
  },
  reviewRow: {
    marginBottom: spacing.md,
  },
  reviewLabel: {
    color: colors.muted,
    fontSize: type.micro,
    fontWeight: weight.heavy,
    letterSpacing: 0.35,
    textTransform: "uppercase",
  },
  reviewValue: {
    color: colors.ink,
    fontSize: type.body,
    fontWeight: weight.medium,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  decisionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  approveButton: {
    alignItems: "center",
    backgroundColor: colors.greenDark,
    borderRadius: 12,
    flex: 1,
    paddingVertical: spacing.md,
  },
  approveButtonText: {
    color: colors.white,
    fontSize: type.caption,
    fontWeight: weight.heavy,
  },
  snoozeButton: {
    alignItems: "center",
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    flex: 0.55,
    paddingVertical: spacing.md,
  },
  snoozeButtonText: {
    color: colors.ink,
    fontSize: type.caption,
    fontWeight: weight.heavy,
  },
  decisionNote: {
    backgroundColor: colors.mint,
    borderRadius: 12,
    color: colors.greenDark,
    fontSize: type.caption,
    fontWeight: weight.semibold,
    lineHeight: 18,
    marginTop: spacing.md,
    padding: spacing.md,
  },
});
