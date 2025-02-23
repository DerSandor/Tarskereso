# 💙 ConnectMate(Átmeneti név) - Online Társkereső Platform

Ez egy teljes funkcionalitású társkereső webalkalmazás, amely lehetővé teszi a felhasználók számára a regisztrációt, profilkezelést, üzenetküldést és keresést. A backend **Django + Django REST Framework**, a frontend pedig **React + Vite** alapú.

---

## 📌 **Telepítési Útmutató**

### 🔹 **1. Klónozd a repót**
```bash
git clone https://github.com/DerSandor/Tarskereso.git
cd Tarskereso
🔹 2. Backend beállítása (Django + REST API)
📌 Virtualenv aktiválása:

python -m venv venv

Windows:
venv\Scripts\activate

Mac/Linux:
source venv/bin/activate

📌 Függőségek telepítése:
pip install -r requirements.txt

📌 Adatbázis migrációk futtatása:
python manage.py makemigrations
python manage.py migrate

📌 Admin fiók létrehozása (ha szükséges):
python manage.py createsuperuser

📌 Admin belépés: http://127.0.0.1:8000/admin/

📌 Django szerver indítása:
python manage.py runserver


🔹 3. Frontend beállítása (React + Vite)
cd frontend
npm install
npm run dev

📌 React szerver futtatása: http://localhost:5173

🚀 Funkciók
✔ Regisztráció, Bejelentkezés, Jelszóváltoztatás
✔ JWT alapú hitelesítés (access & refresh token)
✔ Profil szerkesztés (bio, érdeklődés, profilkép feltöltés)
✔ Felhasználók keresése (név vagy e-mail alapján)
✔ Üzenetküldési rendszer (privát üzenetek)

🛠 Használt technológiák
Backend: Django, Django REST Framework, SimpleJWT
Frontend: React, Vite, Axios, React Router
Adatbázis: SQLite (alapértelmezett, de PostgreSQL-re is átállítható)
Hitelesítés: JWT Token (SimpleJWT)
Fájlfeltöltés: Django Media Storage

🎯 Használat
🔹 Regisztrálj vagy jelentkezz be
🔹 Szerkeszd a profilodat (bio, érdeklődések, profilkép)
🔹 Kereshetsz más felhasználók között
🔹 Küldhetsz és fogadhatsz üzeneteket

🔧 Fejlesztési tippek
📌 Ha egy új csapattag dolgozik a kódbázison:
git pull origin main

📌 Ha módosítás után feltöltöd a GitHubra:
git add .
git commit -m "Új funkció vagy javítás"
git push origin main
