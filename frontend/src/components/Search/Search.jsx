import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { searchProducts } from '../../features/products/service/product.api';
import useDebounce from '../../utils/hooks/useDebounce';
import { getCurrencySymbol } from '../../utils/currency';

const Search = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSearchTerm('');
      setResults([]);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchTerm.trim().length === 0) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchProducts(debouncedSearchTerm);
        if (data.success) {
          setResults(data.products || []);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  if (!isOpen) return null;

  const handleProductClick = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(255, 255, 255, 0.98)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 10%',
      backdropFilter: 'blur(5px)',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111' }}
        >
          <X size={32} />
        </button>
      </div>

      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <SearchIcon size={24} style={{ position: 'absolute', top: '15px', color: '#888' }} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="SEARCH BRANDS, CATEGORIES, PRODUCT NAMES..."
          autoFocus
          style={{
            width: '100%',
            padding: '12px 12px 12px 40px',
            fontSize: '1.5rem',
            border: 'none',
            borderBottom: '2px solid #111',
            background: 'transparent',
            outline: 'none',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        />
        {loading && <div style={{ position: 'absolute', right: 0, top: '20px', fontSize: '0.9rem', color: '#666' }}>Searching...</div>}
      </div>

      <div style={{ maxWidth: '800px', margin: '3rem auto 0', width: '100%' }}>
        {debouncedSearchTerm && !loading && results.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>NO RESULTS FOUND FOR "{debouncedSearchTerm.toUpperCase()}"</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
          {results.map(product => (
            <div 
              key={product._id} 
              onClick={() => handleProductClick(product._id)}
              style={{ cursor: 'pointer', textAlign: 'center' }}
            >
              <div style={{ background: '#f5f5f5', aspectRatio: '3/4', marginBottom: '1rem', overflow: 'hidden' }}>
                <img 
                  src={product.images?.[0]?.url || ''} 
                  alt={product.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-sub-heading)', fontWeight: '500', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.title}
              </h4>
              <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
                {getCurrencySymbol(product.price?.currency)}{product.price?.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
