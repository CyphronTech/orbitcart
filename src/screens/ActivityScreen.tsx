import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { colors, spacing, type, weight } from "../theme/theme";
import type { ActivityLog } from "../types/domain";

export function ActivityScreen({ activity }: { activity: ActivityLog[] }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Activity</Text>
      <Text style={styles.subtitle}>Audit trail for stock, reports, recommendations, and PO lifecycle changes.</Text>
      {activity.map((item) => (
        <Card key={item.id}>
          <View style={styles.row}>
            <View style={styles.dot} />
            <View style={styles.body}>
              <Text style={styles.action}>{item.action}</Text>
              <Text style={styles.meta}>{item.entity} · {item.actor}</Text>
              <Text style={styles.time}>{item.timestamp}</Text>
            </View>
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
    lineHeight: 23,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  dot: {
    backgroundColor: colors.green,
    borderRadius: 5,
    height: 10,
    marginTop: spacing.xs,
    width: 10,
  },
  body: {
    flex: 1,
  },
  action: {
    color: colors.ink,
    fontSize: type.cardTitle,
    fontWeight: weight.heavy,
  },
  meta: {
    color: colors.muted,
    fontSize: type.body,
    marginTop: spacing.xs,
  },
  time: {
    color: colors.mutedSoft,
    fontSize: type.caption,
    fontWeight: weight.medium,
    marginTop: spacing.xs,
  },
});
