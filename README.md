# 💬 Társkereső Webalkalmazás

Ez egy társkereső webalkalmazás, amely lehetővé teszi a felhasználók számára, hogy profilokat hozzanak létre, keresgéljenek más felhasználók között, üzeneteket küldjenek egymásnak, és frissítsék a profiljukat.  

---

## 🚀 **Telepítés és Futás**
### 1️⃣ **Projekt Klónozása**
Először klónozd a projektet a GitHub-ról:

```bash
git clone https://github.com/DerSandor/Tarskereso.git
cd Tarskereso

Windows:
python -m venv venv
venv\Scripts\activate

Mac/Linux:
python3 -m venv venv
source venv/bin/activate


Szükséges csomagok telepítése:
pip install -r requirements.txt

Adatbázis migrációk alkalmazása:
python manage.py migrate

Fejlesztői szerver indítása:
python manage.py runserver

Ezek után a backend elérhető lesz a következő címen:
➡️ http://127.0.0.1:8000/


3️⃣ Frontend Beállítása (React + Vite)
🔹 Navigálj a frontend mappába

cd frontend

🔹 Frontend indítása
npm run dev

A frontend elérhető lesz itt:
➡️ http://localhost:5173/