import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllOrders, getOrdersByUser, createOrder as createOrderApi, updateOrderStatus as updateOrderStatusApi } from '../../services/orderService';

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await getAllOrders();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchUserOrders = createAsyncThunk('orders/fetchByUser', async (userId, { rejectWithValue }) => {
  try {
    const res = await getOrdersByUser(userId);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const placeOrder = createAsyncThunk('orders/place', async (orderData, { rejectWithValue }) => {
  try {
    const res = await createOrderApi(orderData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const changeOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    await updateOrderStatusApi(id, status);
    return { id, status };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    lastOrder: null,
  },
  reducers: {
    clearLastOrder: (state) => { state.lastOrder = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.lastOrder = action.payload;
      })
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const order = state.items.find((o) => o.id === id);
        if (order) order.status = status;
      });
  },
});

export const { clearLastOrder } = ordersSlice.actions;
export const selectAllOrders = (state) => state.orders.items;
export const selectLastOrder = (state) => state.orders.lastOrder;
export const selectOrdersStatus = (state) => state.orders.status;

export default ordersSlice.reducer;
