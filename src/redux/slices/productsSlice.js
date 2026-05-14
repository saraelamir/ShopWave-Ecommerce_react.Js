import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts } from '../../services/productService';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await getAllProducts();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    searchQuery: '',
    selectedCategory: 'All',
    sortBy: 'default',
    priceRange: [0, 5000],
  },
  reducers: {
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
    setCategory: (state, action) => { state.selectedCategory = action.payload; },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    setPriceRange: (state, action) => { state.priceRange = action.payload; },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = 'All';
      state.sortBy = 'default';
      state.priceRange = [0, 5000];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setCategory, setSortBy, setPriceRange, resetFilters } = productsSlice.actions;

// Selectors
export const selectAllProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectCategory = (state) => state.products.selectedCategory;
export const selectSortBy = (state) => state.products.sortBy;
export const selectPriceRange = (state) => state.products.priceRange;

export const selectFilteredProducts = (state) => {
  let items = [...state.products.items];
  const { searchQuery, selectedCategory, sortBy, priceRange } = state.products;

  if (searchQuery) {
    items = items.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (selectedCategory !== 'All') {
    items = items.filter((p) => p.category === selectedCategory);
  }
  items = items.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

  if (sortBy === 'price_asc') items.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price_desc') items.sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') items.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'newest') items.sort((a, b) => b.id.localeCompare(a.id));

  return items;
};

export default productsSlice.reducer;
