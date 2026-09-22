import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, type, weight } from "../theme/theme";

type OrbitLogoProps = {
  compact?: boolean;
  showWordmark?: boolean;
};

export function OrbitLogo({ compact = false, showWordmark = true }: OrbitLogoProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.mark, compact && styles.markCompact]}>
        <View style={[styles.orbitRing, compact && styles.orbitRingCompact]} />
        <View style={[styles.orbitDot, compact && styles.orbitDotCompact]} />
        <Text style={[styles.markLetter, compact && styles.markLetterCompact]}>O</Text>
      </View>
      {showWordmark ? (
        <View>
          <Text style={[styles.wordmark, compact && styles.wordmarkCompact]}>OrbitCart</Text>
          {!compact ? <Text style={styles.tagline}>Demand decisions, not dashboards</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  mark: {
    alignItems: "center",
    backgroundColor: colors.ink,
    borderRadius: 18,
    height: 62,
    justifyContent: "center",
    overflow: "hidden",
    width: 62,
  },
  markCompact: {
    borderRadius: 13,
    height: 42,
    width: 42,
  },
  orbitRing: {
    borderColor: colors.mintStrong,
    borderRadius: 22,
    borderWidth: 2,
    height: 43,
    position: "absolute",
    transform: [{ rotate: "-22deg" }, { scaleX: 1.22 }],
    width: 43,
  },
  orbitRingCompact: {
    borderRadius: 15,
    height: 29,
    width: 29,
  },
  orbitDot: {
    backgroundColor: colors.green,
    borderColor: colors.white,
    borderRadius: 5,
    borderWidth: 2,
    height: 11,
    position: "absolute",
    right: 12,
    top: 11,
    width: 11,
  },
  orbitDotCompact: {
    borderRadius: 4,
    height: 8,
    right: 8,
    top: 8,
    width: 8,
  },
  markLetter: {
    color: colors.white,
    fontSize: 27,
    fontWeight: weight.black,
    letterSpacing: -1,
  },
  markLetterCompact: {
    fontSize: 19,
  },
  wordmark: {
    color: colors.ink,
    fontSize: type.brand,
    fontWeight: weight.black,
    letterSpacing: -0.6,
  },
  wordmarkCompact: {
    fontSize: 20,
  },
  tagline: {
    color: colors.muted,
    fontSize: type.caption,
    fontWeight: weight.medium,
    marginTop: 1,
  },
});
