import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Card } from "../components/Card";
import { RiskBadge } from "../components/RiskBadge";
import { colors, spacing, type, weight } from "../theme/theme";
import type { Product, RiskLevel } from "../types/domain";

type InventoryScreenProps = {
  onSaveProduct: (product: Product) => Promise<void>;
  products: Product[];
};

export function InventoryScreen({ onSaveProduct, products }: InventoryScreenProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [stockOnHand, setStockOnHand] = useState("");
  const [reservedStock, setReservedStock] = useState("");
  const [coverDays, setCoverDays] = useState("");
  const [reorderPoint, setReorderPoint] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const stockValue = Number(stockOnHand || 0);
  const reservedValue = Number(reservedStock || 0);
  const coverValue = Number(coverDays || 0);
  const reorderValue = Number(reorderPoint || 0);
  const projectedRisk = useMemo(() => getRiskLevel(coverValue, stockValue, reservedValue, reorderValue), [coverValue, reorderValue, reservedValue, stockValue]);

  function beginEdit(product: Product) {
    setEditingId(product.id);
    setSku(product.sku);
    setName(product.name);
    setStockOnHand(String(product.stockOnHand));
    setReservedStock(String(product.reservedStock));
    setCoverDays(String(product.coverDays));
    setReorderPoint(String(product.reorderPoint));
  }

  function resetForm() {
    setEditingId(null);
    setSku("");
    setName("");
    setStockOnHand("");
    setReservedStock("");
    setCoverDays("");
    setReorderPoint("");
  }

  async function handleSave() {
    if (!sku.trim() || !name.trim()) {
      Alert.alert("Missing stock details", "Add both SKU and item name before saving.");
      return;
    }

    if ([stockValue, reservedValue, coverValue, reorderValue].some((value) => Number.isNaN(value) || value < 0)) {
      Alert.alert("Check numbers", "Stock, reserved, cover days and reorder point must be valid numbers.");
      return;
    }

    setIsSaving(true);
    try {
      await onSaveProduct({
        id: editingId ?? `sku-${Date.now()}`,
        sku: sku.trim().toUpperCase(),
        name: name.trim(),
        stockOnHand: stockValue,
        reservedStock: reservedValue,
        coverDays: coverValue,
        reorderPoint: reorderValue,
        risk: projectedRisk,
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
          <Text style={styles.title}>Stock</Text>
          <Text style={styles.subtitle}>Add live inventory, track cover, and flag reorder risk.</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countValue}>{products.length}</Text>
          <Text style={styles.countLabel}>SKUs</Text>
        </View>
      </View>
      <Card style={styles.formCard}>
        <View style={styles.formHeadingRow}>
          <View>
            <Text style={styles.formTitle}>{editingId ? "Edit stock entry" : "New stock entry"}</Text>
            <Text style={styles.formHint}>Used by warehouse teams after inward scans or manual counts.</Text>
          </View>
          <RiskBadge risk={projectedRisk} />
        </View>
        <Text style={styles.label}>Item name</Text>
        <TextInput placeholder="e.g. Kraft takeaway boxes" placeholderTextColor={colors.mutedSoft} style={styles.input} value={name} onChangeText={setName} />
        <View style={styles.twoColumn}>
          <View style={styles.field}>
            <Text style={styles.label}>SKU code</Text>
            <TextInput autoCapitalize="characters" placeholder="SKU 9014" placeholderTextColor={colors.mutedSoft} style={styles.input} value={sku} onChangeText={setSku} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Cover days</Text>
            <TextInput keyboardType="decimal-pad" placeholder="6.5" placeholderTextColor={colors.mutedSoft} style={styles.input} value={coverDays} onChangeText={setCoverDays} />
          </View>
        </View>
        <View style={styles.threeColumn}>
          <View style={styles.field}>
            <Text style={styles.label}>On hand</Text>
            <TextInput keyboardType="number-pad" placeholder="480" placeholderTextColor={colors.mutedSoft} style={styles.input} value={stockOnHand} onChangeText={setStockOnHand} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Reserved</Text>
            <TextInput keyboardType="number-pad" placeholder="120" placeholderTextColor={colors.mutedSoft} style={styles.input} value={reservedStock} onChangeText={setReservedStock} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Reorder at</Text>
            <TextInput keyboardType="decimal-pad" placeholder="5" placeholderTextColor={colors.mutedSoft} style={styles.input} value={reorderPoint} onChangeText={setReorderPoint} />
          </View>
        </View>
        <TouchableOpacity disabled={isSaving} style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{isSaving ? "Saving..." : editingId ? "Update stock item" : "Save stock item"}</Text>
        </TouchableOpacity>
        {editingId ? (
          <TouchableOpacity style={styles.cancelEditButton} onPress={resetForm}>
            <Text style={styles.cancelEditButtonText}>Cancel editing</Text>
          </TouchableOpacity>
        ) : null}
      </Card>
      <Text style={styles.sectionLabel}>Inventory ledger</Text>
      {products.map((product) => (
        <Card key={product.id}>
          <View style={styles.row}>
            <View style={styles.nameBlock}>
              <Text style={styles.sku}>{product.sku}</Text>
              <Text style={styles.name}>{product.name}</Text>
            </View>
            <RiskBadge risk={product.risk} />
          </View>
          <View style={styles.metricRow}>
            <Metric value={String(product.stockOnHand)} label="On hand" />
            <Metric value={String(product.reservedStock)} label="Reserved" />
            <Metric value={`${product.coverDays}d`} label="Cover" />
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => beginEdit(product)}>
            <Text style={styles.editButtonText}>Edit stock item</Text>
          </TouchableOpacity>
        </Card>
      ))}
    </ScrollView>
  );
}

function getRiskLevel(coverDays: number, stockOnHand: number, reservedStock: number, reorderPoint: number): RiskLevel {
  if (!coverDays && !stockOnHand && !reservedStock) return "safe";
  if (coverDays <= Math.max(2.5, reorderPoint * 0.55) || reservedStock > stockOnHand) return "critical";
  if (coverDays <= Math.max(5, reorderPoint)) return "watch";
  return "safe";
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View>
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
  formHeadingRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
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
  twoColumn: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  threeColumn: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  field: {
    flex: 1,
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
  cancelEditButton: {
    alignItems: "center",
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingVertical: 12,
  },
  cancelEditButtonText: {
    color: colors.ink,
    fontSize: type.caption,
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
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  sku: {
    color: colors.muted,
    fontSize: type.micro,
    fontWeight: weight.heavy,
    letterSpacing: 0.4,
  },
  name: {
    color: colors.ink,
    fontSize: type.cardTitle,
    fontWeight: weight.heavy,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  metricRow: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },
  metricValue: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: weight.black,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: type.caption,
    fontWeight: weight.medium,
    marginTop: spacing.xs,
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
