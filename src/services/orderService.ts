import { Order, OrderStatus, ReturnRequest, TrackingStep, UserAddress } from '@/types';
import { INITIAL_ORDERS } from '@/data/orders';

let ordersDatabase = [...INITIAL_ORDERS];
let returnsDatabase: ReturnRequest[] = [];


export const orderService = {
  async getOrders(): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return ordersDatabase;
  },

  async getOrderById(id: string): Promise<Order | null> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return ordersDatabase.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async placeOrder(orderData: {
    items: Order['items'];
    shippingAddress: UserAddress;
    paymentMethod: Order['paymentMethod'];
    subtotal: number;
    discount: number;
    deliveryFee: number;
    totalAmount: number;
  }): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const orderNum = `ZZ${100000 + ordersDatabase.length + 1}`;
    const newOrder: Order = {
      id: `ord-${orderNum.toLowerCase()}`,
      orderNumber: orderNum,
      date: new Date().toISOString().split('T')[0],
      status: 'Placed',
      paymentStatus: orderData.paymentMethod === 'Cash on Delivery' ? 'COD' : 'Paid',
      paymentMethod: orderData.paymentMethod,
      totalAmount: orderData.totalAmount,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      deliveryFee: orderData.deliveryFee,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      courierPartner: 'Delhivery Surface Express',
      trackingNumber: `ZZ-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      trackingTimeline: [
        {
          status: 'Placed',
          date: 'Just now',
          description: 'Order placed on SPORTS MENS WEAR',
          completed: true,
          current: true
        },
        { status: 'Confirmed', description: 'Order confirmation in progress', completed: false, current: false },
        { status: 'Processing', description: 'Warehouse picking & quality check', completed: false, current: false },
        { status: 'Packed', description: 'Packaged in waterproof box', completed: false, current: false },
        { status: 'Shipped', description: 'Handed over to courier partner', completed: false, current: false },
        { status: 'Out for Delivery', description: 'Arriving at your doorstep', completed: false, current: false },
        { status: 'Delivered', description: 'Handed to customer', completed: false, current: false }
      ]
    };

    ordersDatabase = [newOrder, ...ordersDatabase];
    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const order = ordersDatabase.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      // update timeline
      const step = order.trackingTimeline.find((t) => t.status === status);
      if (step) {
        step.completed = true;
        step.current = true;
        step.date = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    return order || null;
  },

  async getReturns(): Promise<ReturnRequest[]> {
    return returnsDatabase;
  },

  async submitReturn(request: Omit<ReturnRequest, 'id' | 'createdAt' | 'status'>): Promise<ReturnRequest> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const newReturn: ReturnRequest = {
      ...request,
      id: `ret-${Date.now()}`,
      status: 'Requested',
      createdAt: new Date().toISOString().split('T')[0]
    };
    returnsDatabase = [newReturn, ...returnsDatabase];
    return newReturn;
  },

  async updateReturnStatus(returnId: string, status: ReturnRequest['status']): Promise<ReturnRequest | null> {
    const ret = returnsDatabase.find((r) => r.id === returnId);
    if (ret) {
      ret.status = status;
    }
    return ret || null;
  }
};
