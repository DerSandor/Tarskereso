import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../api';
import Layout from './Layout';
import { showToast } from '../utils/toastConfig';

const ViewProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setProfile(response.data);
      } catch (err) {
        console.error('Profil betöltési hiba:', err);
        showToast('Nem sikerült betölteni a profilt.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-fatal-dark mb-6 sm:mb-8 flex items-center">
          <span className="material-icons text-fatal-red mr-2">person</span>
          Profil megtekintése
        </h2>

        {isLoading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-fatal-red mx-auto"></div>
            <p className="mt-4 text-fatal-gray">Profil betöltése...</p>
          </div>
        ) : profile ? (
          <div className="bg-fatal-light rounded-fatal shadow-fatal p-4 sm:p-6 space-y-4 sm:space-y-6 border-2 border-fatal-red">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
              <div className="w-full md:w-auto flex-shrink-0">
                {profile.profile_picture ? (
                  <img 
                    src={profile.profile_picture} 
                    alt="Profil kép"
                    className="w-32 h-32 md:w-48 md:h-48 mx-auto rounded-full object-cover border-4 border-fatal-red"
                  />
                ) : (
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-fatal-gray flex items-center justify-center mx-auto">
                    <span className="material-icons text-4xl sm:text-6xl text-fatal-light">person</span>
                  </div>
                )}
              </div>

              <div className="flex-grow w-full space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-fatal-dark text-center md:text-left">
                  {profile.username}
                </h3>

                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-fatal-gray mb-2">Bemutatkozás</h4>
                  <p className="text-sm sm:text-base text-fatal-dark bg-white p-3 rounded-fatal border border-fatal-red">
                    {profile.bio || "Nincs bemutatkozás..."}
                  </p>
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-fatal-gray mb-2">Érdeklődési körök</h4>
                  <p className="text-sm sm:text-base text-fatal-dark bg-white p-3 rounded-fatal border border-fatal-red">
                    {profile.interests || "Nincsenek megadva érdeklődési körök..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <span className="material-icons text-4xl sm:text-6xl text-fatal-gray mb-4">
              error_outline
            </span>
            <p className="text-lg sm:text-xl text-fatal-gray">
              A profil nem található.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewProfile; 