import React, { useState, useEffect, useCallback } from 'react';
import { getNextProfile, sendLikeDislike } from '../api';
import { toast } from 'react-toastify';

const SwipeProfiles = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noProfiles, setNoProfiles] = useState(false);

  const loadNextProfile = useCallback(async () => {
    setLoading(true);
    setNoProfiles(false);

    try {
      const response = await getNextProfile();
      if (response && response.data && response.data.id) {
        setProfile(response.data);
      } else {
        setProfile(null);
        setNoProfiles(true);
        toast.info("Nincsenek több profilok!");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Hiba történt a profilok betöltésekor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNextProfile();
  }, [loadNextProfile]);

  const handleDecision = async (liked) => {
    if (!profile || loading) return;

    try {
      await sendLikeDislike(profile.id, liked);
      loadNextProfile();
    } catch (error) {
      toast.error(error.response?.data?.error || "Hiba történt a választás során.");
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {loading ? (
        <p>Betöltés...</p>
      ) : profile ? (
        <>
          <h2>{profile.username}</h2>
          {profile.profile_picture && (
            <img 
              src={`http://127.0.0.1:8000${profile.profile_picture}`} 
              alt="Profilkép" 
              style={{ width: '150px', borderRadius: '50%', marginBottom: '10px' }} 
            />
          )}
          <p><strong>Bio:</strong> {profile.bio || "Nincs bio"}</p>
          <p><strong>Érdeklődési körök:</strong> {profile.interests || "Nincs megadva"}</p>
          <button onClick={() => handleDecision(false)} style={{ background: 'red', padding: '10px', margin: '10px' }}>❌</button>
          <button onClick={() => handleDecision(true)} style={{ background: 'green', padding: '10px', margin: '10px' }}>❤️</button>
        </>
      ) : noProfiles ? (
        <h3>Nincsenek több profilok.</h3>
      ) : null}
    </div>
  );
};

export default SwipeProfiles;
