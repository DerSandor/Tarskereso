#!/bin/bash

# Az aktuális könyvtár elérési útja, ahol a script található
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR"

# Létrehozza a virtuális környezetet, ha még nem létezik
if [ ! -d "venv" ]; then
    echo "A virtuális környezet létrehozása..."
    python3 -m venv venv
else
    echo "A virtuális környezet már létezik."
fi

# Aktiválja a virtuális környezetet
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "A virtuális környezet aktiválva van. Python elérési út: $(which python)"
    echo "Pip elérési út: $(which pip)"
else
    echo "A virtuális környezet nem található. Kérem, ellenőrizze az elérési utat!"
    exit 1
fi

# Telepíti a szükséges csomagokat
if [ -f "backend/requirements.txt" ]; then
    echo "Telepítés a requirements.txt-ből..."
    pip install -r backend/requirements.txt
    if [ $? -eq 0 ]; then
        echo "A csomagok sikeresen telepítve."
    else
        echo "Hiba történt a csomagok telepítésekor!"
        exit 1
    fi
else
    echo "A requirements.txt fájl nem található!"
    exit 1
fi




# Frissíti a pip-et
pip install --upgrade pip

# Kiírja a telepített csomagokat
pip list

python3 backend/manage.py migrate

deactivate


# Ellenőrzi, hogy létezik-e a frontend mappa
if [ ! -d "frontend" ]; then
    echo "A frontend mappa nem található!"
    exit 1
fi

# Lépjen be a frontend mappába
cd frontend

# Ellenőrzi, hogy létezik-e a package.json, tehát npm projekt-e
if [ ! -f "package.json" ]; then
    echo "A package.json fájl nem található a frontend mappában!"
    exit 1
fi

# Futtatja az npm install parancsot a függőségek telepítéséhez
echo "Függőségek telepítése..."
npm install

# Ellenőrzi, hogy az npm install sikeresen lefutott
if [ $? -eq 0 ]; then
    echo "A függőségek sikeresen telepítve."
else
    echo "Hiba történt a függőségek telepítésekor!"
    exit 1
fi

# Futtatja az npm run build parancsot a build elkészítéséhez
echo "Build folyamat indítása..."
npm run build

# Ellenőrzi, hogy az npm run build sikeresen lefutott
if [ $? -eq 0 ]; then
    echo "A build sikeresen elkészült."
else
    echo "Hiba történt a build folyamat során!"
    exit 1
fi


echo "A frontend telepítés és build sikeresen befejeződött."

cd ..

# Az interaktív shell indítása, hogy láthasd a virtuális környezetet
exec $SHELL
