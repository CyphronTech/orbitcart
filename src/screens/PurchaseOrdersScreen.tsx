import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../components/Card";
import { colors, spacing, type, weight } from "../theme/theme";
import type { PurchaseOrder } from "../types/domain";

const flow: PurchaseOrder["status"][] = ["draft", "sent", "partial", "received", "reconciled"];

export function PurchaseOrdersScreen({ onAdvancePO, purchaseOrders }: { onAdvancePO: (id: string) => Promise<void>; purchaseOrders: PurchaseOrder[] }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Purchase orders</Text>
      <Text style={styles.subtitle}>Track reorder approvals from draft to reconciliation.</Text>
      {purchaseOrders.map((po) => (
        <Card key={po.id}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.poId}>{po.id}</Text>
              <Text style={styles.item}>{po.item}</Text>
            </View>
            <Text style={styles.value}>{po.value}</Text>
          </View>
          <Text style={styles.meta}>{po.supplier} · {po.quantity} units · ETA {po.eta}</Text>
          <View style={styles.flowRow}>
            {flow.map((step) => (
              <View key={step} style={[styles.step, flow.indexOf(step) <= flow.indexOf(po.status) && styles.stepDone]}>
                <Text style={[styles.stepText, flow.indexOf(step) <= flow.indexOf(po.status) && styles.stepTextDone]}>{step}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={() => onAdvancePO(po.id)}>
            <Text style={styles.buttonText}>Move to next stage</Text>
          </TouchableOpacity>
        </Card>
      ))}
    </ScrollView>
  );
}

export function getNextPOStatus(status: PurchaseOrder["status"]): PurchaseOrder["status"] {
  const currentIndex = flow.indexOf(status);
  return flow[Math.min(currentIndex + 1, flow.length - 1)];
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  poId: {
    color: colors.muted,
    fontSize: type.micro,
    fontWeight: weight.heavy,
    letterSpacing: 0.4,
  },
  item: {
    color: colors.ink,
    fontSize: type.cardTitle,
    fontWeight: weight.black,
    marginTop: spacing.xs,
  },
  value: {
    color: colors.greenDark,
    fontSize: type.bodyLarge,
    fontWeight: weight.black,
  },
  meta: {
    color: colors.muted,
    fontSize: type.body,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  flowRow: {
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
  stepDone: {
    backgroundColor: colors.mint,
  },
  stepText: {
    color: colors.muted,
    fontSize: type.micro,
    fontWeight: weight.heavy,
    textTransform: "capitalize",
  },
  stepTextDone: {
    color: colors.greenDark,
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.ink,
    borderRadius: 12,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  buttonText: {
    color: colors.white,
    fontSize: type.caption,
    fontWeight: weight.heavy,
  },
});
