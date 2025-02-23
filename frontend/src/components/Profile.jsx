import { useEffect, useState } from 'react';
import { getProfile } from '../api';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    getProfile(token).then(response => setProfile(response.data));
  }, [token]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-fatal-dark mb-8 flex items-center">
          <span className="material-icons text-fatal-red mr-2">person</span>
          Profilom
        </h2>

        {profile ? (
          <div className="bg-fatal-light rounded-fatal shadow-fatal p-6 space-y-6">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0">
                {profile.profile_picture ? (
                  <img 
                    src={profile.profile_picture} 
                    alt="Profil kép" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-fatal-red"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-fatal-gray flex items-center justify-center">
                    <span className="material-icons text-4xl text-fatal-light">person</span>
                  </div>
                )}
              </div>

              <div className="flex-grow space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-fatal-gray mb-2">Bemutatkozás</h3>
                  <p className="text-fatal-dark bg-white p-3 rounded-fatal border border-fatal-red">
                    {profile.bio || "Még nincs bemutatkozás..."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-fatal-gray mb-2">Érdeklődési körök</h3>
                  <p className="text-fatal-dark bg-white p-3 rounded-fatal border border-fatal-red">
                    {profile.interests || "Nincsenek megadva érdeklődési körök..."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t-2 border-fatal-red">
              <Link 
                to="/profile/edit"
                className="flex items-center gap-2 px-4 py-2 bg-fatal-red text-fatal-light rounded-fatal
                         hover:bg-fatal-hover transition-colors duration-200"
              >
                <span className="material-icons">edit</span>
                Profil szerkesztése
              </Link>

              <Link 
                to="/profile/change-password"
                className="flex items-center gap-2 px-4 py-2 border-2 border-fatal-red text-fatal-red rounded-fatal
                         hover:bg-fatal-red hover:text-fatal-light transition-colors duration-200"
              >
                <span className="material-icons">lock</span>
                Jelszó módosítása
              </Link>

              <Link 
                to="/swipe"
                className="flex items-center gap-2 px-4 py-2 bg-fatal-dark text-fatal-light rounded-fatal
                         hover:bg-fatal-gray transition-colors duration-200 ml-auto"
              >
                <span className="material-icons">favorite</span>
                Profilok böngészése
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fatal-red mx-auto"></div>
            <p className="mt-4 text-fatal-gray">Profil betöltése...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
