export type AppTab = "today" | "inventory" | "orders" | "purchaseOrders" | "reports" | "admin";
export type UserRole = "Owner" | "Manager" | "Warehouse Staff" | "Sales/Ops" | "Supplier Coordinator";

export type RiskLevel = "safe" | "watch" | "critical";

export type Product = {
  id: string;
  sku: string;
  name: string;
  stockOnHand: number;
  reservedStock: number;
  coverDays: number;
  reorderPoint: number;
  risk: RiskLevel;
};

export type Order = {
  id: string;
  customer: string;
  dueLabel: string;
  blockedItem: string;
  fulfillmentPercent: number;
  risk: RiskLevel;
  status: "confirmed" | "picking" | "packed" | "shipped" | "delayed";
};

export type Supplier = {
  id: string;
  name: string;
  leadTimeDays: number;
  pendingPo: string;
  status: "waiting" | "confirmed" | "stable";
};

export type Recommendation = {
  id: string;
  title: string;
  summary: string;
  suggestedQuantity: number;
  confidence: number;
  affectedOrders: number;
};

export type BusinessReport = {
  id: string;
  title: string;
  owner: string;
  period: string;
  summary: string;
  status: "draft" | "review" | "shared";
  updatedAt: string;
};

export type PurchaseOrder = {
  id: string;
  supplier: string;
  item: string;
  quantity: number;
  status: "draft" | "sent" | "partial" | "received" | "reconciled";
  eta: string;
  value: string;
};

export type ActivityLog = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  timestamp: string;
};

export type WorkspaceSetup = {
  businessName: string;
  gstin: string;
  primaryWarehouse: string;
  role: UserRole;
  isComplete: boolean;
};

export type Dashboard = {
  suggestedPoValue: string;
  fillRateProtected: string;
  approvalsNeeded: number;
  products: Product[];
  orders: Order[];
  suppliers: Supplier[];
  recommendations: Recommendation[];
  reports: BusinessReport[];
  purchaseOrders: PurchaseOrder[];
  activity: ActivityLog[];
};
