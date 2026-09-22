import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../components/Card";
import { RiskBadge } from "../components/RiskBadge";
import { colors, spacing, type, weight } from "../theme/theme";
import type { Order } from "../types/domain";

export function OrdersScreen({ onAdvanceOrder, orders }: { onAdvanceOrder: (id: string) => Promise<void>; orders: Order[] }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Orders</Text>
      <Text style={styles.subtitle}>Customer commitments sorted by how likely they are to slip.</Text>
      {orders.map((order) => (
        <Card key={order.id}>
          <View style={styles.row}>
            <Text style={styles.name}>{order.id} · {order.customer}</Text>
            <RiskBadge risk={order.risk} />
          </View>
          <Text style={styles.copy}>{order.blockedItem} is the item slowing this order down.</Text>
          <View style={styles.statusRow}>
            {(["confirmed", "picking", "packed", "shipped"] as Order["status"][]).map((step) => (
              <View key={step} style={[styles.step, order.status === step && styles.stepActive]}>
                <Text style={[styles.stepText, order.status === step && styles.stepTextActive]}>{step}</Text>
              </View>
            ))}
          </View>
          <View style={styles.footer}>
            <Text style={styles.meta}>Due {order.dueLabel}</Text>
            <Text style={styles.percent}>{order.fulfillmentPercent}% ready</Text>
          </View>
          <TouchableOpacity style={styles.action} onPress={() => onAdvanceOrder(order.id)}>
            <Text style={styles.actionText}>Move order forward</Text>
          </TouchableOpacity>
        </Card>
      ))}
    </ScrollView>
  );
}

export function getNextOrderStatus(status: Order["status"]): Order["status"] {
  const flow: Order["status"][] = ["confirmed", "picking", "packed", "shipped"];
  if (status === "delayed") return "picking";
  return flow[Math.min(flow.indexOf(status) + 1, flow.length - 1)];
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
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    color: colors.ink,
    flex: 1,
    fontSize: type.cardTitle,
    fontWeight: weight.heavy,
    lineHeight: 22,
    paddingRight: spacing.md,
  },
  copy: {
    color: colors.muted,
    fontSize: type.body,
    fontWeight: weight.regular,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  footer: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  step: {
    backgroundColor: colors.background,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  stepActive: {
    backgroundColor: colors.mint,
  },
  stepText: {
    color: colors.muted,
    fontSize: type.micro,
    fontWeight: weight.heavy,
    textTransform: "capitalize",
  },
  stepTextActive: {
    color: colors.greenDark,
  },
  meta: {
    color: colors.muted,
    fontSize: type.caption,
    fontWeight: weight.medium,
  },
  percent: {
    color: colors.ink,
    fontSize: type.caption,
    fontWeight: weight.heavy,
  },
  action: {
    alignItems: "center",
    backgroundColor: colors.ink,
    borderRadius: 12,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  actionText: {
    color: colors.white,
    fontSize: type.caption,
    fontWeight: weight.heavy,
  },
});
