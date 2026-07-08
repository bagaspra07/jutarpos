import { createClient } from '@supabase/supabase-js';
import type { PaymentMethod, OrderStatus } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const api = {
  createSession: async (tableId: number, _customerName?: string) => {
    const { data, error } = await supabase
      .from('table_sessions')
      .insert({
        table_id: String(tableId),
        status: 'open'
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      sessionId: data.id,
      tableName: `Meja ${tableId}`,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
    };
  },
  
  getMenu: async (category?: string) => {
    // 1. Fetch categories
    const { data: cats, error: catErr } = await supabase
      .from('menu_snapshot_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (catErr) throw new Error(catErr.message);

    // 2. Fetch items
    const { data: items, error: itemErr } = await supabase
      .from('menu_snapshot_items')
      .select('*');

    if (itemErr) throw new Error(itemErr.message);

    const catMap = new Map(cats.map(c => [c.id, c.name]));
    // Deduplicate category names (guard against stale duplicate rows in cloud)
    const formattedCategories = [...new Set(cats.map(c => c.name))];

    const formattedItems = items.map(item => ({
      id: parseInt(item.local_id) || 0,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price) || 0,
      category: catMap.get(item.category_id) || 'Lainnya',
      imageUrl: item.image_url,
      isAvailable: item.is_available,
      displayOrder: 0
    }));

    const filteredItems = category && category !== 'Semua'
      ? formattedItems.filter(i => i.category === category)
      : formattedItems;

    return {
      categories: formattedCategories,
      items: filteredItems
    };
  },
  
  createOrder: async (orderData: {
    sessionId: string;
    items: { menuItemId: number; quantity: number; note?: string | null }[];
    orderNote?: string;
    paymentMethod: string;
  }) => {
    // 1. Fetch session to get table_id
    const { data: session, error: sErr } = await supabase
      .from('table_sessions')
      .select('table_id')
      .eq('id', orderData.sessionId)
      .single();

    if (sErr) throw new Error(sErr.message);

    // 2. Fetch all menu items from Supabase to match the local names and prices
    const { data: menuItems, error: mErr } = await supabase
      .from('menu_snapshot_items')
      .select('local_id, name, price');

    if (mErr) throw new Error(mErr.message);

    const nameMap = new Map(menuItems.map(m => [parseInt(m.local_id), m.name]));
    const priceMap = new Map(menuItems.map(m => [parseInt(m.local_id), parseFloat(m.price) || 0]));

    // 3. Map order items
    const requestItems = orderData.items.map(item => ({
      menu_item_local_id: String(item.menuItemId),
      name: nameMap.get(item.menuItemId) || 'Menu Item',
      price: priceMap.get(item.menuItemId) || 0,
      qty: item.quantity,
      notes: item.note || ''
    }));

    // 4. Insert order request
    const { data: order, error: oErr } = await supabase
      .from('web_order_requests')
      .insert({
        session_id: orderData.sessionId,
        table_id: session.table_id,
        items: requestItems,
        status: 'pending'
      })
      .select()
      .single();

    if (oErr) throw new Error(oErr.message);

    return {
      orderId: 1,
      orderNumber: order.id,
      status: 'pending_cashier' as OrderStatus,
      total: 0
    };
  },
  
  getOrderByNumber: async (orderNumber: string) => {
    const { data: order, error } = await supabase
      .from('web_order_requests')
      .select('*')
      .eq('id', orderNumber)
      .single();

    if (error) throw new Error(error.message);

    const formattedStatus = order.status === 'pending'
      ? 'pending_cashier'
      : order.status;

    return {
      id: 1,
      orderNumber: order.id,
      sessionId: order.session_id,
      tableId: parseInt(order.table_id) || 1,
      tableName: `Meja ${order.table_id}`,
      customerName: '',
      status: formattedStatus as OrderStatus,
      paymentMethod: 'cashier' as PaymentMethod,
      paymentStatus: (order.status === 'confirmed' ? 'paid' : 'unpaid') as any,
      subtotal: 0,
      serviceFee: 1000,
      taxAmount: 0,
      total: 0,
      orderNote: order.rejected_reason || null,
      items: order.items.map((item: any, idx: number) => ({
        id: idx + 1,
        menuItemId: parseInt(item.menu_item_local_id) || 0,
        menuItemName: item.name,
        menuItemPrice: 0,
        quantity: item.qty,
        note: item.notes || null,
        subtotal: 0
      })),
      createdAt: order.submitted_at,
      confirmedAt: order.confirmed_at || null,
      completedAt: null
    };
  },
  
  generateQRIS: async (_orderId: number, _sessionId: string): Promise<{ qrCodeUrl: string; expiresAt: string }> => {
    throw new Error('QRIS payment not supported in cashier payment mode.');
  },
  
  getPaymentStatus: async (_orderId: number, _sessionId: string) => {
    return {
      orderId: _orderId,
      paymentStatus: 'unpaid' as const,
      paidAt: null
    };
  }
};
