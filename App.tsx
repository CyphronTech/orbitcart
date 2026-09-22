import React, { useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Animated, Easing, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { OrbitLogo } from "./src/components/OrbitLogo";
import { demoDashboard } from "./src/data/demoData";
import { AdminScreen } from "./src/screens/AdminScreen";
import { InventoryScreen } from "./src/screens/InventoryScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { getNextOrderStatus, OrdersScreen } from "./src/screens/OrdersScreen";
import { getNextPOStatus, PurchaseOrdersScreen } from "./src/screens/PurchaseOrdersScreen";
import { ReportsScreen } from "./src/screens/ReportsScreen";
import { TodayScreen } from "./src/screens/TodayScreen";
import {
  createDemoAccount,
  getAuthErrorMessage,
  observeAuthState,
  signInWithEmail,
  signOutCurrentUser,
  type AuthUser,
} from "./src/services/authService";
import { colors, spacing, type, weight } from "./src/theme/theme";
import type { ActivityLog, AppTab, BusinessReport, Order, Product, PurchaseOrder, WorkspaceSetup } from "./src/types/domain";

const STOCK_STORAGE_KEY = "orbitcard.stock.items";
const REPORTS_STORAGE_KEY = "orbitcard.reports.items";
const PO_STORAGE_KEY = "orbitcard.purchase-orders.items";
const ACTIVITY_STORAGE_KEY = "orbitcard.activity.items";
const SETUP_STORAGE_KEY = "orbitcard.workspace.setup";
const ORDERS_STORAGE_KEY = "orbitcard.orders.items";

const tabs: Array<{ key: AppTab; label: string }> = [
  { key: "today", label: "Today" },
  { key: "inventory", label: "Stock" },
  { key: "orders", label: "Orders" },
  { key: "purchaseOrders", label: "POs" },
  { key: "reports", label: "Reports" },
  { key: "admin", label: "Admin" },
];

export default function App() {
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>("today");
  const [products, setProducts] = useState<Product[]>(demoDashboard.products);
  const [orders, setOrders] = useState<Order[]>(demoDashboard.orders);
  const [reports, setReports] = useState<BusinessReport[]>(demoDashboard.reports);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(demoDashboard.purchaseOrders);
  const [activity, setActivity] = useState<ActivityLog[]>(demoDashboard.activity);
  const [setup, setSetup] = useState<WorkspaceSetup | null>(null);
  const screenMotion = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return observeAuthState((nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(SETUP_STORAGE_KEY)
      .then((value) => {
        if (value) setSetup(JSON.parse(value) as WorkspaceSetup);
      })
      .catch(() => setSetup(null));
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STOCK_STORAGE_KEY)
      .then((value) => {
        if (value) setProducts(JSON.parse(value) as Product[]);
      })
      .catch(() => {
        setProducts(demoDashboard.products);
      });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(ORDERS_STORAGE_KEY)
      .then((value) => {
        if (value) setOrders(JSON.parse(value) as Order[]);
      })
      .catch(() => setOrders(demoDashboard.orders));
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(PO_STORAGE_KEY)
      .then((value) => {
        if (value) setPurchaseOrders(JSON.parse(value) as PurchaseOrder[]);
      })
      .catch(() => setPurchaseOrders(demoDashboard.purchaseOrders));
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(ACTIVITY_STORAGE_KEY)
      .then((value) => {
        if (value) setActivity(JSON.parse(value) as ActivityLog[]);
      })
      .catch(() => setActivity(demoDashboard.activity));
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(REPORTS_STORAGE_KEY)
      .then((value) => {
        if (value) setReports(JSON.parse(value) as BusinessReport[]);
      })
      .catch(() => {
        setReports(demoDashboard.reports);
      });
  }, []);

  const dashboard = useMemo(
    () => ({
      ...demoDashboard,
      products,
      orders,
      reports,
      purchaseOrders,
      activity,
      approvalsNeeded: products.filter((product) => product.risk !== "safe").length + 3,
    }),
    [activity, orders, products, purchaseOrders, reports],
  );

  const activeScreen = useMemo(() => {
    if (activeTab === "orders") return <OrdersScreen onAdvanceOrder={handleAdvanceOrder} orders={dashboard.orders} />;
    if (activeTab === "inventory") return <InventoryScreen onSaveProduct={handleSaveProduct} products={dashboard.products} />;
    if (activeTab === "purchaseOrders") return <PurchaseOrdersScreen onAdvancePO={handleAdvancePO} purchaseOrders={dashboard.purchaseOrders} />;
    if (activeTab === "reports") return <ReportsScreen onSaveReport={handleSaveReport} reports={dashboard.reports} />;
    if (activeTab === "admin" && setup) return <AdminScreen activity={dashboard.activity} onAdminAction={addActivity} setup={setup} />;
    return <TodayScreen dashboard={dashboard} />;
  }, [activeTab, dashboard]);

  useEffect(() => {
    screenMotion.setValue(0);
    Animated.timing(screenMotion, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [activeTab, screenMotion]);

  async function handleSignIn(email: string, password: string) {
    setAuthSubmitting(true);
    setAuthError("");

    try {
      const nextUser = await signInWithEmail(email, password);
      setUser(nextUser);
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleCreateAccount(email: string, password: string) {
    setAuthSubmitting(true);
    setAuthError("");

    try {
      const nextUser = await createDemoAccount(email, password);
      setUser(nextUser);
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setAuthError("Google sign-in isn't available in this demo. Use email sign-in.");
  }

  async function handleSignOut() {
    await signOutCurrentUser();
    setUser(null);
    setActiveTab("today");
  }

  async function handleSaveProduct(product: Product) {
    const exists = products.some((item) => item.id === product.id);
    const nextProducts = exists ? products.map((item) => (item.id === product.id ? product : item)) : [product, ...products];
    setProducts(nextProducts);
    await AsyncStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(nextProducts));
    await addActivity(exists ? "Updated stock item" : "Created stock item", product.name);
  }

  async function handleSaveReport(report: BusinessReport) {
    const exists = reports.some((item) => item.id === report.id);
    const nextReports = exists ? reports.map((item) => (item.id === report.id ? report : item)) : [report, ...reports];
    setReports(nextReports);
    await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(nextReports));
    await addActivity(exists ? "Updated report" : "Created report", report.title);
  }

  async function handleAdvancePO(id: string) {
    const nextPurchaseOrders = purchaseOrders.map((po) => (po.id === id ? { ...po, status: getNextPOStatus(po.status) } : po));
    setPurchaseOrders(nextPurchaseOrders);
    await AsyncStorage.setItem(PO_STORAGE_KEY, JSON.stringify(nextPurchaseOrders));
    await addActivity("Advanced purchase order stage", id);
  }

  async function handleAdvanceOrder(id: string) {
    const nextOrders = orders.map((order) => (order.id === id ? { ...order, status: getNextOrderStatus(order.status), fulfillmentPercent: Math.min(order.fulfillmentPercent + 12, 100) } : order));
    setOrders(nextOrders);
    await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));
    await addActivity("Advanced customer order", id);
  }

  async function handleCompleteSetup(nextSetup: WorkspaceSetup) {
    setSetup(nextSetup);
    await AsyncStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify(nextSetup));
    await addActivity("Completed workspace setup", nextSetup.businessName);
  }

  async function addActivity(action: string, entity: string) {
    const nextActivity: ActivityLog[] = [
      {
        id: `act-${Date.now()}`,
        actor: setup?.role ?? "Owner",
        action,
        entity,
        timestamp: "Just now",
      },
      ...activity,
    ];
    setActivity(nextActivity);
    await AsyncStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(nextActivity));
  }

  if (authLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView edges={["top", "right", "bottom", "left"]} style={styles.loadingScreen}>
          <ActivityIndicator color={colors.green} />
          <Text style={styles.loadingText}>Checking OrbitCard session...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!user) {
    return (
      <SafeAreaProvider>
        <LoginScreen
          errorMessage={authError}
          isSubmitting={authSubmitting}
          onCreateAccount={handleCreateAccount}
          onGoogleSignIn={handleGoogleSignIn}
          onSignIn={handleSignIn}
        />
      </SafeAreaProvider>
    );
  }

  if (!setup?.isComplete) {
    return (
      <SafeAreaProvider>
        <OnboardingScreen onComplete={handleCompleteSetup} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top", "right", "bottom", "left"]} style={styles.safeArea}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <OrbitLogo compact />
          <Text style={styles.workspace}>{setup.businessName} · {setup.role}</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={handleSignOut}>
          <Text style={styles.avatarText}>{(user.email?.slice(0, 2) ?? "OC").toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: screenMotion,
            transform: [
              {
                translateY: screenMotion.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        {activeScreen}
      </Animated.View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingScreen: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
  },
  loadingText: {
    color: colors.muted,
    fontSize: type.body,
    fontWeight: weight.medium,
    marginTop: spacing.md,
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 74,
    paddingHorizontal: spacing.lg,
    paddingTop: 0,
    shadowColor: colors.ink,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  workspace: {
    color: colors.muted,
    fontSize: type.caption,
    fontWeight: weight.medium,
    marginLeft: 50,
    marginTop: 3,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.mint,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  avatarText: {
    color: colors.green,
    fontSize: type.caption,
    fontWeight: weight.heavy,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: "row",
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  tab: {
    alignItems: "center",
    borderRadius: 12,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.ink,
  },
  tabText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: weight.bold,
  },
  tabTextActive: {
    color: colors.white,
  },
});
