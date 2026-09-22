import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrbitLogo } from "../components/OrbitLogo";
import { colors, spacing, type, weight } from "../theme/theme";
import type { UserRole, WorkspaceSetup } from "../types/domain";

const roles: UserRole[] = ["Owner", "Manager", "Warehouse Staff", "Sales/Ops", "Supplier Coordinator"];

export function OnboardingScreen({ onComplete }: { onComplete: (setup: WorkspaceSetup) => Promise<void> }) {
  const [businessName, setBusinessName] = useState("North Ridge Wholesale");
  const [gstin, setGstin] = useState("29AABCN9012M1Z5");
  const [primaryWarehouse, setPrimaryWarehouse] = useState("Bengaluru Central Warehouse");
  const [role, setRole] = useState<UserRole>("Owner");

  return (
    <SafeAreaView edges={["top", "right", "bottom", "left"]} style={styles.safeArea}>
      <View style={styles.card}>
        <OrbitLogo />
        <Text style={styles.title}>Set up workspace</Text>
        <Text style={styles.copy}>Connect your first warehouse, business profile, and operating role before opening the control room.</Text>

        <Text style={styles.label}>Business name</Text>
        <TextInput style={styles.input} value={businessName} onChangeText={setBusinessName} />
        <Text style={styles.label}>GSTIN</Text>
        <TextInput autoCapitalize="characters" style={styles.input} value={gstin} onChangeText={setGstin} />
        <Text style={styles.label}>Primary warehouse</Text>
        <TextInput style={styles.input} value={primaryWarehouse} onChangeText={setPrimaryWarehouse} />

        <Text style={styles.label}>Your role</Text>
        <View style={styles.roleWrap}>
          {roles.map((item) => (
            <TouchableOpacity key={item} style={[styles.roleChip, role === item && styles.roleChipActive]} onPress={() => setRole(item)}>
              <Text style={[styles.roleText, role === item && styles.roleTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onComplete({ businessName, gstin, primaryWarehouse, role, isComplete: true })}
        >
          <Text style={styles.buttonText}>Launch workspace</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 24,
    borderWidth: 1,
    padding: spacing.xl,
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: weight.black,
    letterSpacing: -0.8,
    marginTop: spacing.xl,
  },
  copy: {
    color: colors.muted,
    fontSize: type.body,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  label: {
    color: colors.inkSoft,
    fontSize: type.micro,
    fontWeight: weight.heavy,
    letterSpacing: 0.35,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
    textTransform: "uppercase",
  },
  input: {
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.ink,
    fontSize: type.body,
    fontWeight: weight.semibold,
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  roleWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  roleChip: {
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  roleChipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  roleText: {
    color: colors.muted,
    fontSize: type.caption,
    fontWeight: weight.heavy,
  },
  roleTextActive: {
    color: colors.white,
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.greenDark,
    borderRadius: 14,
    marginTop: spacing.xl,
    paddingVertical: 15,
  },
  buttonText: {
    color: colors.white,
    fontSize: type.bodyLarge,
    fontWeight: weight.heavy,
  },
});
