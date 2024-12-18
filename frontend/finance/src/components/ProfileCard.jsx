import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const ProfileCard = () => {
  const { user, getProfile, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: ''
  });

  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (!user) {
      getProfile();
    }
  }, [user, getProfile]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;
    setLoadingImage(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', image);
      uploadFormData.append('upload_preset', `${import.meta.env.REACT_APP_PRESET_NAME}`); 

      const cloudinaryResponse = await fetch(`${import.meta.env.REACT_APP_CLOUDINARY_URL}image/upload`, {
        method: 'POST',
        body: uploadFormData
      });

      const cloudinaryData = await cloudinaryResponse.json();
      const imageUrl = cloudinaryData.secure_url;

      const response = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}api/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ profilePicture: imageUrl })
      });

      if (response.ok) {
        await getProfile(); 
        setImage(null);
      } else {
        console.error('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Image upload failed', error);
    } finally {
      setLoadingImage(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-white">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="h-[50vh] w-full flex items-center justify-center bg-gray-900">
      <motion.div
        className="flex w-full max-w-4xl border bg-gray-800 shadow-lg rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1 flex items-center justify-center bg-blue-900 relative">
          {formData.profilePicture ? (
            <img
              src={formData.profilePicture}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover border-4 border-gray-800 shadow-lg"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-gray-600 flex items-center justify-center border-4 border-gray-800 shadow-lg">
              <FontAwesomeIcon icon={faCamera} className="text-gray-300 text-3xl" />
            </div>
          )}
          <label className="absolute bottom-0 right-0 p-2 bg-gray-700 rounded-full cursor-pointer">
            <FontAwesomeIcon icon={faCamera} className="text-gray-300 text-xl" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 py-6 text-white">
          <h1 className="text-2xl font-bold text-gray-100 mb-2">
            Welcome, {formData.name ? formData.name : (
              <span>
                Dear User, 
                <a 
                  href="/login" 
                  className="text-blue-400 underline hover:text-blue-500 ml-1"
                >
                  please login
                </a>!
              </span>
            )}
          </h1>
          <p className="text-lg text-gray-300 mb-4">{formData.email || 'To Personal Finance'}</p>

          <motion.div
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            {image && !loadingImage && (
              <button
                onClick={handleImageUpload}
                className="mt-4 mr-64 p-1 bg-blue-800 text-white rounded hover:bg-blue-600"
              >
                Upload Profile Image
              </button>
            )}
          </motion.div>

          {loadingImage && <p className="mt-4 text-center">Uploading image...</p>}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileCard;
