import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../authContext.jsx';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Logo és Név */}
        <div className="mb-12">
          <span className="material-icons text-fatal-red text-7xl">favorite</span>
          <h1 className="text-6xl font-bold text-fatal-light mt-4">Fatal Love</h1>
          <p className="text-xl text-fatal-light/80 mt-4">
            Találd meg az igazi szerelmet!
          </p>
        </div>

        {/* Fő tartalom */}
        <div className="bg-fatal-light rounded-fatal shadow-fatal p-8 mb-8">
          <h2 className="text-3xl font-bold text-fatal-dark mb-6">
            Üdvözölünk a Fatal Love-nál!
          </h2>
          <p className="text-lg text-fatal-gray mb-8">
            A Fatal Love egy modern társkereső alkalmazás, ahol megtalálhatod 
            életed párját. Regisztrálj most és kezdd el a kalandot!
          </p>

          {/* CTA gombok */}
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-fatal-red text-fatal-light rounded-fatal
                         hover:bg-fatal-hover transition-colors duration-200
                         flex items-center justify-center gap-2 text-lg font-medium"
              >
                <span className="material-icons">how_to_reg</span>
                Regisztráció
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border-2 border-fatal-red text-fatal-red rounded-fatal
                         hover:bg-fatal-red hover:text-fatal-light transition-colors duration-200
                         flex items-center justify-center gap-2 text-lg font-medium"
              >
                <span className="material-icons">login</span>
                Bejelentkezés
              </Link>
            </div>
          ) : (
            <Link
              to="/profile"
              className="px-8 py-4 bg-fatal-red text-fatal-light rounded-fatal
                       hover:bg-fatal-hover transition-colors duration-200
                       flex items-center justify-center gap-2 text-lg font-medium
                       mx-auto max-w-xs"
            >
              <span className="material-icons">person</span>
              Profilom megtekintése
            </Link>
          )}
        </div>

        {/* Jellemzők */}
        <div className="grid md:grid-cols-3 gap-8 text-fatal-light">
          <div className="p-6 rounded-fatal border-2 border-fatal-red/30 backdrop-blur">
            <span className="material-icons text-fatal-red text-4xl mb-4">favorite_border</span>
            <h3 className="text-xl font-semibold mb-2">Találj rá a szerelemre</h3>
            <p className="text-fatal-light/70">
              Intelligens párosítási rendszerünk segít megtalálni a hozzád illő partnert
            </p>
          </div>
          <div className="p-6 rounded-fatal border-2 border-fatal-red/30 backdrop-blur">
            <span className="material-icons text-fatal-red text-4xl mb-4">chat</span>
            <h3 className="text-xl font-semibold mb-2">Biztonságos chat</h3>
            <p className="text-fatal-light/70">
              Kommunikálj biztonságosan a matcheiddel valós időben
            </p>
          </div>
          <div className="p-6 rounded-fatal border-2 border-fatal-red/30 backdrop-blur">
            <span className="material-icons text-fatal-red text-4xl mb-4">verified_user</span>
            <h3 className="text-xl font-semibold mb-2">Biztonságos környezet</h3>
            <p className="text-fatal-light/70">
              Ellenőrzött profilok és biztonságos adatkezelés
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 