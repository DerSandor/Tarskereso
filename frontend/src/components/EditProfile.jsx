import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { showToast } from '../utils/toastConfig';

const EditProfile = () => {
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [gender, setGender] = useState('M');
  const token = sessionStorage.getItem('access_token');
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      getProfile(token).then(response => {
        setBio(response.data.bio || '');
        setInterests(response.data.interests || '');
        setPreviewUrl(response.data.profile_picture || null);
        setGender(response.data.gender || 'M');
      });
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('interests', interests);
    formData.append('gender', gender);
    if (profilePicture instanceof File) {
      formData.append('profile_picture', profilePicture);
    }

    try {
      await updateProfile(token, formData);
      showToast('Profil sikeresen frissítve!', 'success');
      navigate('/profile');
    } catch (error) {
      console.error('Profil frissítési hiba:', error);
      showToast('Hiba történt a profil frissítése során.', 'error');
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-fatal-dark mb-8 flex items-center">
          <span className="material-icons text-fatal-red mr-2">edit</span>
          Profil szerkesztése
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-full md:w-auto flex-shrink-0">
              <div className="relative mx-auto md:mx-0" style={{ width: 'fit-content' }}>
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profil előnézet" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-fatal-red"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-fatal-gray flex items-center justify-center">
                    <span className="material-icons text-4xl text-fatal-light">person</span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-fatal-red text-fatal-light p-2 rounded-full cursor-pointer hover:bg-fatal-hover transition-colors">
                  <span className="material-icons">photo_camera</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex-grow w-full space-y-4">
              <div>
                <label className="block text-fatal-gray mb-2" htmlFor="bio">
                  Bemutatkozás
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 border-2 border-fatal-red rounded-fatal
                           focus:ring-2 focus:ring-fatal-red focus:border-fatal-red
                           bg-fatal-light text-fatal-dark min-h-[120px] resize-y"
                  placeholder="Írj magadról néhány mondatot..."
                />
              </div>

              <div>
                <label className="block text-fatal-gray mb-2" htmlFor="interests">
                  Érdeklődési körök
                </label>
                <input
                  type="text"
                  id="interests"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full p-3 border-2 border-fatal-red rounded-fatal
                           focus:ring-2 focus:ring-fatal-red focus:border-fatal-red
                           bg-fatal-light text-fatal-dark"
                  placeholder="pl.: zene, utazás, sport..."
                />
              </div>

              <div>
                <label className="block text-fatal-gray mb-2" htmlFor="gender">
                  Nem
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 border-2 border-fatal-red rounded-fatal
                           focus:ring-2 focus:ring-fatal-red focus:border-fatal-red
                           bg-fatal-light text-fatal-dark"
                  required
                >
                  <option value="M">Férfi</option>
                  <option value="F">Nő</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-fatal-red">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-fatal-red text-fatal-light rounded-fatal
                       hover:bg-fatal-hover transition-colors duration-200"
            >
              <span className="material-icons">save</span>
              Mentés
            </button>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-6 py-3 border-2 border-fatal-red text-fatal-red rounded-fatal
                       hover:bg-fatal-red hover:text-fatal-light transition-colors duration-200"
            >
              <span className="material-icons">cancel</span>
              Mégse
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProfile;
