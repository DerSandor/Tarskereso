import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../api';
import Layout from './Layout';
import { toast } from 'react-toastify';
import { toastConfig } from '../utils/toastConfig';

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
        toast.error('Nem sikerült betölteni a profilt.', {
          ...toastConfig,
          icon: '❌',
          toastId: 'profile-load-error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-fatal-dark mb-8 flex items-center">
          <span className="material-icons text-fatal-red mr-2">person</span>
          Profil megtekintése
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fatal-red mx-auto"></div>
            <p className="mt-4 text-fatal-gray">Profil betöltése...</p>
          </div>
        ) : profile ? (
          <div className="bg-fatal-light rounded-fatal shadow-fatal p-6 space-y-6 border-2 border-fatal-red">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0">
                {profile.profile_picture ? (
                  <img 
                    src={profile.profile_picture} 
                    alt="Profil kép"
                    className="w-48 h-48 rounded-full object-cover border-4 border-fatal-red"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-fatal-gray flex items-center justify-center">
                    <span className="material-icons text-6xl text-fatal-light">person</span>
                  </div>
                )}
              </div>

              <div className="flex-grow space-y-4">
                <h3 className="text-2xl font-bold text-fatal-dark">
                  {profile.username}
                </h3>

                <div>
                  <h4 className="text-lg font-semibold text-fatal-gray mb-2">Bemutatkozás</h4>
                  <p className="text-fatal-dark bg-white p-3 rounded-fatal border border-fatal-red">
                    {profile.bio || "Nincs bemutatkozás..."}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-fatal-gray mb-2">Érdeklődési körök</h4>
                  <p className="text-fatal-dark bg-white p-3 rounded-fatal border border-fatal-red">
                    {profile.interests || "Nincsenek megadva érdeklődési körök..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="material-icons text-6xl text-fatal-gray mb-4">
              error_outline
            </span>
            <p className="text-fatal-gray text-xl">
              A profil nem található.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewProfile; 