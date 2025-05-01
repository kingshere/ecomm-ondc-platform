import axios from 'axios';

const ONDC_API_URL = process.env.ONDC_API_URL;
const ONDC_API_KEY = process.env.ONDC_API_KEY;

const ondcClient = axios.create({
  baseURL: ONDC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ONDC_API_KEY}`
  }
});

export interface ONDCProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  sellerId: string;
}

export interface ONDCOrder {
  id: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  buyerId: string;
  sellerId: string;
  status: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export const ondcService = {
  // Register a seller on ONDC network
  async registerSeller(sellerData: any) {
    try {
      const response = await ondcClient.post('/sellers/register', sellerData);
      return response.data;
    } catch (error) {
      console.error('ONDC Seller Registration Error:', error);
      throw error;
    }
  },

  // List products on ONDC network
  async listProduct(productData: ONDCProduct) {
    try {
      const response = await ondcClient.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('ONDC Product Listing Error:', error);
      throw error;
    }
  },

  // Create an order on ONDC network
  async createOrder(orderData: Omit<ONDCOrder, 'id' | 'status'>) {
    try {
      const response = await ondcClient.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('ONDC Order Creation Error:', error);
      throw error;
    }
  },

  // Update order status on ONDC network
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const response = await ondcClient.patch(`/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error('ONDC Order Update Error:', error);
      throw error;
    }
  },

  // Search products on ONDC network
  async searchProducts(query: string, filters?: any) {
    try {
      const response = await ondcClient.get('/search', {
        params: {
          q: query,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      console.error('ONDC Search Error:', error);
      throw error;
    }
  }
};