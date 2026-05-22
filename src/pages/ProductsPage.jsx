import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts, selectFilteredProducts, selectProductsStatus,
  setCategory, setSortBy, setPriceRange, resetFilters,
  selectCategory, selectSortBy, selectPriceRange, selectSearchQuery,
} from '../redux/slices/productsSlice';
import ProductCard from '../components/product/ProductCard';
import { SkeletonGrid } from '../components/product/SkeletonCard';
import Pagination from '../components/common/Pagination';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ScrollToTop from '../components/common/ScrollToTop';
import { usePagination } from '../hooks/usePagination';
import styles from './ProductsPage.module.css';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books'];
const SORTS = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

const ProductsPage = () => {
  const dispatch = useDispatch();
  const filtered = useSelector(selectFilteredProducts);
  const status = useSelector(selectProductsStatus);
  const selectedCategory = useSelector(selectCategory);
  const sortBy = useSelector(selectSortBy);
  const priceRange = useSelector(selectPriceRange);
  const searchQuery = useSelector(selectSearchQuery);
  const [view, setView] = useState('grid');
  const [localMin, setLocalMin] = useState(priceRange[0]);
  const [localMax, setLocalMax] = useState(priceRange[1]);
  const allProducts = useSelector((s) => s.products.items);

  useEffect(() => { if (status === 'idle') dispatch(fetchProducts()); }, [dispatch, status]);

  const { currentData, currentPage, totalPages, goToPage, resetPage } = usePagination(filtered, 12);

  const handleCategory = (cat) => { dispatch(setCategory(cat)); resetPage(); };
  const handleSort = (e) => { dispatch(setSortBy(e.target.value)); resetPage(); };
  const handlePriceApply = () => { dispatch(setPriceRange([Number(localMin), Number(localMax)])); resetPage(); };
  const handleReset = () => { dispatch(resetFilters()); setLocalMin(0); setLocalMax(5000); resetPage(); };

  const hasActiveFilters = selectedCategory !== 'All' || sortBy !== 'default' || priceRange[0] > 0 || priceRange[1] < 5000 || searchQuery;

  return (
    <div className="container">
      <Breadcrumbs />
      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.filterCard}>
            <div className={styles.filterTitle}>
              Categories
              {selectedCategory !== 'All' && <button className={styles.clearBtn} onClick={() => dispatch(setCategory('All'))}>Clear</button>}
            </div>
            <div className={styles.categoryList}>
              {CATEGORIES.map((cat) => (
                <div key={cat}
                  className={`${styles.categoryItem} ${selectedCategory === cat ? styles.active : ''}`}
                  onClick={() => handleCategory(cat)}>
                  {cat}
                  <span className={styles.categoryCount}>
                    {cat === 'All' ? allProducts.length : allProducts.filter((p) => p.category === cat).length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.filterCard}>
            <div className={styles.filterTitle}>Price Range</div>
            <div className={styles.priceInputsVertical}>
              <div className={styles.priceInputGroup}>
                <label className={styles.priceLabel}>Min:</label>
                <input type="number" className={styles.priceInput} placeholder="0" value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)} min={0} />
              </div>
              <div className={styles.priceInputGroup}>
                <label className={styles.priceLabel}>Max:</label>
                <input type="number" className={styles.priceInput} placeholder="5000" value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)} max={10000} />
              </div>
            </div>
            <button className="btn-primary-custom w-100 mt-3" style={{ justifyContent: 'center' }} onClick={handlePriceApply}>
              Apply Filter
            </button>
          </div>

          {hasActiveFilters && (
            <button className="btn-outline-custom w-100" onClick={handleReset}>
              <i className="fas fa-times" /> Reset All Filters
            </button>
          )}
        </aside>

        {/* Main */}
        <div className={styles.main}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.resultsCount}>
              <strong>{filtered.length}</strong> products found
              {searchQuery && <> for "<strong>{searchQuery}</strong>"</>}
            </div>
            <div className={styles.toolbarRight}>
              <select className={styles.sortSelect} value={sortBy} onChange={handleSort}>
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <div className={styles.viewToggle}>
                <button className={`${styles.viewBtn} ${view === 'grid' ? styles.active : ''}`} onClick={() => setView('grid')}><i className="fas fa-th" /></button>
                <button className={`${styles.viewBtn} ${view === 'grid2' ? styles.active : ''}`} onClick={() => setView('grid2')}><i className="fas fa-th-large" /></button>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className={styles.activeFilters}>
              {selectedCategory !== 'All' && (
                <div className={styles.filterChip}>{selectedCategory}
                  <button onClick={() => dispatch(setCategory('All'))}><i className="fas fa-times" /></button>
                </div>
              )}
              {searchQuery && (
                <div className={styles.filterChip}>"{searchQuery}"</div>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                <div className={styles.filterChip}>${priceRange[0]} — ${priceRange[1]}
                  <button onClick={() => { dispatch(setPriceRange([0, 5000])); setLocalMin(0); setLocalMax(5000); }}><i className="fas fa-times" /></button>
                </div>
              )}
            </div>
          )}

          {status === 'loading'
            ? <SkeletonGrid count={12} />
            : filtered.length === 0
              ? <div className="empty-state"><i className="fas fa-search" /><h4>No products found</h4><p>Try adjusting your filters or search terms.</p><button className="btn-outline-custom mt-3" onClick={handleReset}>Reset Filters</button></div>
              : <>
                  <div className={`${styles.grid} ${view === 'grid2' ? styles.grid2 : ''}`}>
                    {currentData.map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
                </>
          }
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
};

export default ProductsPage;
