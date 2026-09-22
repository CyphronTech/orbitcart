import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { colors, spacing, type, weight } from "../theme/theme";
import type { Supplier } from "../types/domain";

export function SuppliersScreen({ suppliers }: { suppliers: Supplier[] }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Suppliers</Text>
      <Text style={styles.subtitle}>Follow-ups connected to the orders they affect.</Text>
      {suppliers.map((supplier) => (
        <Card key={supplier.id}>
          <View style={styles.row}>
            <View>
              <Text style={styles.name}>{supplier.name}</Text>
              <Text style={styles.copy}>{supplier.pendingPo} · {supplier.leadTimeDays} day lead time</Text>
            </View>
            <Text style={styles.status}>{supplier.status}</Text>
          </View>
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
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    color: colors.ink,
    fontSize: type.cardTitle,
    fontWeight: weight.heavy,
  },
  copy: {
    color: colors.muted,
    fontSize: type.body,
    fontWeight: weight.regular,
    marginTop: spacing.xs,
  },
  status: {
    color: colors.green,
    fontSize: type.caption,
    fontWeight: weight.heavy,
    textTransform: "capitalize",
  },
});
