import React, { useState, useEffect } from 'react';
import { getNextProfile, sendLikeDislike } from '../api';
import { showToast } from '../utils/toastConfig';
import Layout from './Layout';

const getImageUrl = (profilePicture) => {
  if (!profilePicture) return null;
  if (profilePicture.startsWith('http')) return profilePicture;
  return `http://127.0.0.1:8000${profilePicture}`;
};

const SwipeProfiles = () => {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchNewProfile = async () => {
    setIsLoading(true);
    try {
      const response = await getNextProfile();
      
      if (response.data.id) {
        setCurrentProfile(response.data);
      } else {
        setCurrentProfile(null);
      }
    } catch (err) {
      console.error('Profil betöltési hiba:', err);
      showToast('Nem sikerült új profilt betölteni.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewProfile();
  }, []);

  const handleAction = async (action) => {
    if (isAnimating || !currentProfile || !currentProfile.id) {
      return;
    }

    setIsAnimating(true);
    const currentProfileId = currentProfile.id;

    try {
      const liked = action === 'like';
      
      const response = await sendLikeDislike(liked, currentProfileId);
      
      if (response.match) {
        showToast('Új match-ed van! 🎉', 'match');
      }

      setCurrentProfile(null);
      await fetchNewProfile();
    } catch (err) {
      console.error('Művelet hiba:', err);
      showToast('Hiba történt a művelet során.', 'error');
    } finally {
      setIsAnimating(false);
    }
  };

  const handleSkip = async () => {
    if (isAnimating || !currentProfile) return;
    
    setIsAnimating(true);
    const currentProfileId = currentProfile.id;

    try {
      await sendLikeDislike(false, currentProfileId);
      setCurrentProfile(null);
      await fetchNewProfile();
    } catch (err) {
      console.error('Hiba a következő profil betöltésekor:', err);
      showToast('Nem sikerült betölteni a következő profilt.', 'error');
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-fatal-dark mb-8 flex items-center">
          <span className="material-icons text-fatal-red mr-2">favorite</span>
          Profilok böngészése
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fatal-red mx-auto"></div>
            <p className="mt-4 text-fatal-gray">Profil betöltése...</p>
          </div>
        ) : currentProfile ? (
          <div className={`bg-fatal-light rounded-fatal shadow-fatal p-6 space-y-6 border-2 border-fatal-red
                          transition-transform duration-300 ${isAnimating ? 'scale-95' : 'scale-100'}`}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-full md:w-48 flex-shrink-0">
                {currentProfile.profile_picture ? (
                  <img 
                    src={getImageUrl(currentProfile.profile_picture)}
                    alt="Profil kép"
                    className="w-32 h-32 md:w-48 md:h-48 mx-auto rounded-full object-cover border-4 border-fatal-red"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-fatal-gray flex items-center justify-center">
                    <span className="material-icons text-6xl text-fatal-light">person</span>
                  </div>
                )}
              </div>

              <div className="flex-grow space-y-4">
                <h3 className="text-2xl font-bold text-fatal-dark">
                  {currentProfile.username}
                </h3>

                <div>
                  <h4 className="text-lg font-semibold text-fatal-gray mb-2">Bemutatkozás</h4>
                  <p className="text-fatal-dark bg-white p-3 rounded-fatal border border-fatal-red">
                    {currentProfile.bio || "Nincs bemutatkozás..."}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-fatal-gray mb-2">Érdeklődési körök</h4>
                  <p className="text-fatal-dark bg-white p-3 rounded-fatal border border-fatal-red">
                    {currentProfile.interests || "Nincsenek megadva érdeklődési körök..."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-6 border-t-2 border-fatal-red">
              <button
                onClick={handleSkip}
                disabled={isAnimating}
                className="flex items-center gap-2 px-6 py-3 bg-fatal-dark text-fatal-light rounded-fatal
                         hover:bg-fatal-gray transition-colors duration-200 disabled:opacity-50"
              >
                <span className="material-icons">close</span>
                Következő
              </button>

              <button
                onClick={() => handleAction('like')}
                disabled={isAnimating}
                className="flex items-center gap-2 px-6 py-3 bg-fatal-red text-fatal-light rounded-fatal
                         hover:bg-fatal-hover transition-colors duration-200 disabled:opacity-50"
              >
                <span className="material-icons">favorite</span>
                Like
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="material-icons text-6xl text-fatal-gray mb-4">
              sentiment_satisfied
            </span>
            <p className="text-fatal-gray text-xl">
              Nincs több megjeleníthető profil.
            </p>
            <p className="text-fatal-gray mt-2">
              Nézz vissza később új profilokért!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SwipeProfiles;
