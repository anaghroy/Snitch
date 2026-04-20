import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Type, AlignLeft, DollarSign, Image as ImageIcon, Briefcase, Globe, Loader2, Sparkles, Upload, List } from 'lucide-react';

const CreateProduct = () => {
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
    brand: '',
    category: '',
  });
  const [images, setImages] = useState([]); // Array of { file: File, preview: string }
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentUser = user?.user || user;

  // Protection: Redirect if not seller
  useEffect(() => {
    if (!authLoading && (!currentUser || currentUser.role !== 'seller')) {
      navigate('/');
    }
  }, [currentUser, authLoading, navigate]);

  // Clean up Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    let availableSlots = 7 - images.length;
    if (availableSlots <= 0) {
      setError('You can only upload up to 7 images.');
      return;
    }

    // Limit the selected files to available slots
    const allowedFiles = files.slice(0, availableSlots);
    const newImageObjs = allowedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImageObjs]);
    setError(''); // Clear error if success
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (images.length === 0) {
        throw new Error('Please select at least one image file.');
      }

      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('brand', formData.brand);
      payload.append('category', formData.category);
      payload.append('priceAmount', formData.priceAmount);
      payload.append('priceCurrency', formData.priceCurrency);

      images.forEach((img) => {
        payload.append('images', img.file);
      });

      await handleCreateProduct(payload);
      navigate('/seller/dashboard'); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to publish the item.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="cp-luxury-loading">
        <Loader2 className="spin-icon" size={48} />
      </div>
    );
  }

  return (
    <div className="cp-luxury-wrapper">
      <motion.div
        className="cp-luxury-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="cp-header">
          <div className="cp-brand-badge">SNITCH</div>
          <motion.div 
            className="cp-icon-circle"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={28} />
          </motion.div>
          <h1>Create Product</h1>
          <p>Curate your next premium masterpiece.</p>
        </div>

        {error && (
          <motion.div 
            className="cp-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <p>{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="cp-form">
          <div className="cp-row">
            <div className="cp-field">
              <label><Type size={16} /> Product Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Midnight Velvet Jacket"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={3}
              />
            </div>
            
            <div className="cp-field">
              <label><Briefcase size={16} /> Brand</label>
              <input
                type="text"
                name="brand"
                placeholder="e.g., Snitch Black Label"
                value={formData.brand}
                onChange={handleChange}
                required
                minLength={3}
              />
            </div>
          </div>

          <div className="cp-field">
            <label><List size={16} /> Category</label>
            <input
              type="text"
              name="category"
              placeholder="e.g., Shirts, Casual, Winter Wear"
              value={formData.category}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>

          <div className="cp-field">
            <label><AlignLeft size={16} /> Description</label>
            <textarea
              name="description"
              placeholder="Detail the fabric, cut, and inspiration behind this piece."
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              minLength={10}
            />
          </div>

          <div className="cp-row">
            <div className="cp-field cp-price">
              <label><DollarSign size={16} /> Price Amount</label>
              <input
                type="number"
                name="priceAmount"
                placeholder="0.00"
                value={formData.priceAmount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="cp-field cp-currency">
              <label><Globe size={16} /> Currency</label>
              <select
                name="priceCurrency"
                value={formData.priceCurrency}
                onChange={handleChange}
                
              >
                <option className="priceCurrency" value="INR">INR (₹)</option>
                <option className="priceCurrency" value="USD">USD ($)</option>
                <option className="priceCurrency" value="EUR">EUR (€)</option>
                <option className="priceCurrency" value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="cp-gallery">
            <div className="cp-gallery-head">
              <label><ImageIcon size={16} /> Lookbook Images</label>
              <span className="cp-counter">{images.length} / 7</span>
            </div>
            
            <div className="cp-image-grid" style={{
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <AnimatePresence>
                {images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    className="cp-image-preview-item"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img src={img.preview} alt={`preview-${idx}`} />
                    <button 
                      type="button" 
                      className="cp-remove-img"
                      onClick={() => removeImage(idx)}
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
                
                {images.length < 7 && (
                  <motion.div 
                    className="cp-upload-slot"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <input 
                      type="file" 
                      id="file-upload"
                      ref={fileInputRef}
                      multiple 
                      accept="image/*"
                      onChange={handleFileSelect}
                      hidden
                    />
                    <label htmlFor="file-upload" className="cp-upload-trigger">
                      <Upload size={24} />
                      <span>Upload</span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button 
            type="submit" 
            className="cp-submit"
            disabled={submitting}
          >
            {submitting ? (
              <><Loader2 className="spin-icon" size={20} /> Publishing...</>
            ) : (
              'Publish Product'
            )}
            <div className="cp-btn-glow"></div>
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProduct;
