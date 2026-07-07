/**
 * 03_TYPES.ts — Interface-First Design
 * Jutar POS Server — Self-Order System
 *
 * Copy ke: src/types/index.ts (server) dan web/src/types/index.ts (web)
 */

// ─────────────────────────────────────────────
// SESSION
// ─────────────────────────────────────────────

export type SessionStatus = 'active' | 'completed' | 'expired'

export interface SelfOrderSession {
  id: string                    // UUID v4
  tableId: number
  tableName: string             // "Meja 7"
  customerName: string | null
  status: SessionStatus
  createdAt: string
  expiresAt: string
  lastActivity: string
}

export interface CreateSessionRequest {
  tableId: number
  customerName?: string
}

export interface CreateSessionResponse {
  sessionId: string
  tableName: string
  expiresAt: string
}

// ─────────────────────────────────────────────
// MENU
// ─────────────────────────────────────────────

export interface MenuItem {
  id: number
  name: string
  description: string | null
  price: number                 // integer Rupiah
  category: string
  imageUrl: string | null
  isAvailable: boolean
  displayOrder: number
}

export interface MenuResponse {
  categories: string[]
  items: MenuItem[]
}

// ─────────────────────────────────────────────
// CART (frontend only, Zustand state)
// ─────────────────────────────────────────────

export interface CartItem {
  menuItemId: number
  menuItemName: string
  menuItemPrice: number
  quantity: number
  note: string | null
}

export interface CartState {
  items: CartItem[]
  orderNote: string | null
  sessionId: string | null
  tableId: number | null
  tableName: string | null
  customerName: string | null
}

export interface CartSummary {
  subtotal: number
  serviceFee: number            // selalu Rp 1.000
  taxAmount: number             // 10% dari subtotal
  total: number
  itemCount: number
}

// ─────────────────────────────────────────────
// ORDER
// ─────────────────────────────────────────────

export type OrderStatus =
  | 'pending_cashier'           // menunggu konfirmasi kasir
  | 'confirmed'                 // dikonfirmasi kasir
  | 'preparing'                 // sedang dimasak
  | 'completed'                 // selesai
  | 'cancelled'                 // dibatalkan

export type PaymentMethod = 'cashier' | 'qris'

export type PaymentStatus = 'unpaid' | 'paid' | 'failed'

export interface OrderItemPayload {
  menuItemId: number
  quantity: number
  note?: string
}

export interface CreateOrderRequest {
  sessionId: string
  items: OrderItemPayload[]
  orderNote?: string
  paymentMethod: PaymentMethod
}

export interface CreateOrderResponse {
  orderId: number
  orderNumber: string           // "JR-20260418-0042"
  status: OrderStatus
  total: number
}

export interface SelfOrderItem {
  id: number
  menuItemId: number
  menuItemName: string
  menuItemPrice: number
  quantity: number
  note: string | null
  subtotal: number
}

export interface SelfOrder {
  id: number
  orderNumber: string
  sessionId: string
  tableId: number
  tableName: string
  customerName: string | null
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  subtotal: number
  serviceFee: number
  taxAmount: number
  total: number
  orderNote: string | null
  items: SelfOrderItem[]
  createdAt: string
  confirmedAt: string | null
  completedAt: string | null
}

// ─────────────────────────────────────────────
// PAYMENT (QRIS / Midtrans)
// ─────────────────────────────────────────────

export interface GenerateQRISRequest {
  orderId: number
}

export interface GenerateQRISResponse {
  qrCodeUrl: string             // URL gambar QR code dari Midtrans
  expiresAt: string             // ISO 8601, 10 menit dari sekarang
  midtransOrderId: string
}

export interface PaymentStatusResponse {
  orderId: number
  paymentStatus: PaymentStatus
  paidAt: string | null
}

export interface MidtransWebhookPayload {
  transaction_status: string
  order_id: string
  gross_amount: string
  signature_key: string
  transaction_id: string
  payment_type: string
  fraud_status?: string
}

// ─────────────────────────────────────────────
// POLLING (Tauri ← Server)
// ─────────────────────────────────────────────

export interface PendingOrdersResponse {
  orders: SelfOrder[]
  timestamp: string
}

// Digunakan di Tauri untuk update table grid
export interface TableSelfOrderStatus {
  tableId: number
  pendingCount: number
  orders: Pick<SelfOrder, 'id' | 'orderNumber' | 'customerName' |
    'total' | 'createdAt' | 'paymentMethod'>[]
}

// ─────────────────────────────────────────────
// QR CODE (Tauri)
// ─────────────────────────────────────────────

export interface TableQRCode {
  tableId: number
  tableName: string
  qrUrl: string                 // URL yang di-encode ke QR
  qrDataUrl: string             // base64 PNG dari library qrcode
}

// ─────────────────────────────────────────────
// API RESPONSES (generic)
// ─────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
  code?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ─────────────────────────────────────────────
// CONFIG (Tauri settings)
// ─────────────────────────────────────────────

export interface SelfOrderConfig {
  enabled: boolean
  serverUrl: string             // "https://jutar-pos-server.railway.app"
  apiKey: string
  restaurantDomain: string      // untuk QR URL generation
}

// ─────────────────────────────────────────────
// CONFIRMATION PAGE UI STATE
// ─────────────────────────────────────────────

export type ConfirmationVariant = 'cashier' | 'qris_verified'

export type TimelineStepStatus = 'completed' | 'active' | 'pending'

export interface TimelineStep {
  label: string
  subLabel?: string
  status: TimelineStepStatus
}

export interface ConfirmationState {
  variant: ConfirmationVariant
  orderNumber: string
  tableName: string
  customerName: string | null
  itemCount: number
  total: number
  createdAt: string
  timeline: TimelineStep[]
}
