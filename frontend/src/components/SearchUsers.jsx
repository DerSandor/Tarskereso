import React, { useState } from 'react';
import { searchUsers } from '../api';
import { toast } from 'react-toastify';

const SearchUsers = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const token = localStorage.getItem('access_token');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.warn('Kérlek, adj meg egy keresési kifejezést!');
      return;
    }

    try {
      const response = await searchUsers(token, query);
      setResults(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error ||'Hiba történt a keresés során.');
    }
  };

  return (
    <div>
      <h2>Felhasználók keresése</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Keresés felhasználónév vagy email alapján"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Keresés</button>
      </form>

      <div>
        {results.length > 0 ? (
          results.map(user => (
            <div key={user.id}>
              <p><strong>Felhasználónév:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          ))
        ) : (
          <p>Nincs találat.</p>
        )}
      </div>
    </div>
  );
};

export default SearchUsers;
