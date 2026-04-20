import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../service/auth.api';
import { setUser } from '../state/auth.slice';
import Header from '../../../components/Header/Header';
import { User as UserIcon, Mail, Phone, Edit2, Check, X } from 'lucide-react';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    contact: user?.contact || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = await updateProfile(formData);
      if (data.success) {
        dispatch(setUser(data.user));
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      alert('Failed to update profile.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData({ fullname: user?.fullname || '', contact: user?.contact || '' });
    setIsEditing(false);
  };

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading profile...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fcfcfc', fontFamily: 'var(--font-heading)' }}>
      <Header style={{ boxShadow: 'none', borderBottom: '1px solid #f0f0f0' }} />
      
      <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-sub-heading)', fontSize: '2rem', marginBottom: '2rem' }}>My Profile</h1>

        <div style={{ background: '#fff', borderRadius: '8px', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
          
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', background: '#f5f5f5', marginBottom: '1rem', border: '2px solid #eaeaea', display: 'flex', alignItems: 'center', justify: 'center' }}>
              {user.photo ? (
                <img src={user.photo} alt={user.fullname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <UserIcon size={48} color="#ccc" />
              )}
            </div>
            <span style={{ background: '#e0f0e3', color: '#3b864f', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {user.role}
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: 0 }}>Personal Details</h2>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#557256', cursor: 'pointer', fontWeight: 'bold' }}>
                  <Edit2 size={16} /> Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={cancelEdit} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f5f5f5', padding: '0.4rem 0.8rem', border: 'none', borderRadius: '4px', color: '#666', cursor: 'pointer' }}>
                    <X size={16} /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#111', color: '#fff', padding: '0.4rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    <Check size={16} /> {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Full Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="fullname" 
                    value={formData.fullname} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
                  />
                ) : (
                  <p style={{ margin: 0, fontSize: '1.1rem', color: '#333' }}>{user.fullname}</p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}><Mail size={14} style={{ marginRight: '4px' }} /> Email Address</label>
                <p style={{ margin: 0, fontSize: '1rem', color: '#666' }}>{user.email} <span style={{ fontSize: '0.75rem', color: '#aaa', marginLeft: '0.5rem' }}>(cannot be changed)</span></p>
              </div>

              <div>
                <label style={{ display: 'block', color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}><Phone size={14} style={{ marginRight: '4px' }} /> Contact Number</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="contact" 
                    value={formData.contact} 
                    onChange={handleChange} 
                    placeholder="Enter phone number"
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
                  />
                ) : (
                  <p style={{ margin: 0, fontSize: '1rem', color: '#333' }}>{user.contact || 'Not provided'}</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
