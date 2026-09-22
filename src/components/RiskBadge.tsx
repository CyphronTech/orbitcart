import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, type, weight } from "../theme/theme";
import type { RiskLevel } from "../types/domain";

const labelByRisk: Record<RiskLevel, string> = {
  safe: "Safe",
  watch: "Watch",
  critical: "Critical",
};

const colorByRisk: Record<RiskLevel, string> = {
  safe: colors.green,
  watch: colors.orange,
  critical: colors.red,
};

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <View style={[styles.badge, { backgroundColor: `${colorByRisk[risk]}18` }]}>
      <Text style={[styles.text, { color: colorByRisk[risk] }]}>{labelByRisk[risk]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    fontSize: type.micro,
    fontWeight: weight.heavy,
    letterSpacing: 0.2,
  },
});
