import subprocess
import os
import sys
import platform
import shutil
from typing import Optional

def clear_screen():
    """Képernyő törlése az operációs rendszernek megfelelően"""
    os.system('cls' if platform.system() == 'Windows' else 'clear')

def setup_environment():
    """Környezet beállítása és könyvtárváltás"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(current_dir)
    return current_dir

def create_virtual_env():
    """Virtuális környezet létrehozása"""
    if not os.path.exists("venv"):
        print("Virtuális környezet létrehozása...")
        subprocess.run([sys.executable, "-m", "venv", "venv"])
    else:
        print("A virtuális környezet már létezik.")

def activate_venv(current_dir: str) -> tuple[str, str]:
    """Virtuális környezet aktiválása és Python/pip útvonalak beállítása"""
    if platform.system() == "Windows":
        venv_python = os.path.join(current_dir, "venv", "Scripts", "python.exe")
        venv_pip = os.path.join(current_dir, "venv", "Scripts", "pip.exe")
    else:
        venv_python = os.path.join(current_dir, "venv", "bin", "python")
        venv_pip = os.path.join(current_dir, "venv", "bin", "pip")
    return venv_python, venv_pip

def install_backend(venv_pip: str, venv_python: str):
    """Backend telepítése és beállítása"""
    if os.path.exists("backend/requirements.txt"):
        print("Backend csomagok telepítése...")
        subprocess.run([venv_pip, "install", "--upgrade", "pip"])
        subprocess.run([venv_pip, "install", "-r", "backend/requirements.txt"])
        print("Migráció futtatása...")
        subprocess.run([venv_python, "backend/manage.py", "migrate"])
    else:
        print("A requirements.txt fájl nem található!")
        sys.exit(1)

def get_nodejs_paths():
    """Node.js és npm elérési útjainak meghatározása"""
    try:
        # Először próbáljuk meg közvetlenül futtatni (PATH-ból)
        node_version = subprocess.run(["node", "--version"], capture_output=True, text=True)
        npm_version = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        
        if node_version.returncode == 0 and npm_version.returncode == 0:
            # Ha sikerült futtatni, akkor megkeressük a tényleges útvonalat
            if platform.system() == "Windows":
                where_node = subprocess.run(["where", "node"], capture_output=True, text=True)
                where_npm = subprocess.run(["where", "npm"], capture_output=True, text=True)
                if where_node.returncode == 0 and where_npm.returncode == 0:
                    return where_node.stdout.strip().split('\n')[0], where_npm.stdout.strip().split('\n')[0]
    except Exception:
        pass

    # Ha nem sikerült a PATH-ból, akkor keressük a szokásos helyeken
    program_files = os.environ.get("ProgramFiles")
    program_files_x86 = os.environ.get("ProgramFiles(x86)")
    appdata = os.environ.get("APPDATA")
    localappdata = os.environ.get("LOCALAPPDATA")
    
    possible_paths = [
        os.path.join(program_files, "nodejs") if program_files else None,
        os.path.join(program_files_x86, "nodejs") if program_files_x86 else None,
        os.path.join(appdata, "npm") if appdata else None,
        os.path.join(localappdata, "Programs", "nodejs") if localappdata else None,
        r"C:\Program Files\nodejs",
        r"C:\Program Files (x86)\nodejs"
    ]
    
    for path in possible_paths:
        if path and os.path.exists(path):
            potential_node = os.path.join(path, "node.exe")
            potential_npm = os.path.join(path, "npm.cmd")
            if os.path.exists(potential_node) and os.path.exists(potential_npm):
                return potential_node, potential_npm
            
    # Ha még mindig nem találtuk meg, próbáljuk meg a PATH-ból újra
    paths = os.environ.get("PATH", "").split(os.pathsep)
    for path in paths:
        potential_node = os.path.join(path, "node.exe")
        potential_npm = os.path.join(path, "npm.cmd")
        if os.path.exists(potential_node) and os.path.exists(potential_npm):
            return potential_node, potential_npm
            
    return None, None

def check_nodejs():
    """Node.js telepítésének ellenőrzése"""
    node_path, npm_path = get_nodejs_paths()
    
    if not node_path or not npm_path:
        print("\nHIBA: Node.js vagy npm nem található a rendszeren!")
        print("Kérlek ellenőrizd:")
        print("1. Node.js telepítve van-e (https://nodejs.org/)")
        print("2. A telepítés során a 'Add to PATH' opció be volt-e jelölve")
        print("3. Próbáld újraindítani a számítógépet")
        print("\nJavasolt verzió: Node.js 20.x LTS")
        print("\nTelepítési útvonal ellenőrzése:")
        print("1. Nyisd meg a Parancssor-t (cmd)")
        print("2. Írd be: node --version")
        print("3. Írd be: npm --version")
        print("4. Ha ezek működnek, de a program még mindig nem találja,")
        print("   akkor telepítsd újra a Node.js-t az 'Add to PATH' opcióval")
        input("\nNyomj ENTER-t a folytatáshoz...")
        return False, None, None
    
    try:
        # Node verzió ellenőrzése
        node_version = subprocess.run([node_path, "--version"], capture_output=True, text=True)
        npm_version = subprocess.run([npm_path, "--version"], capture_output=True, text=True)
        
        if node_version.returncode != 0 or npm_version.returncode != 0:
            print("\nHIBA: Node.js vagy npm nem működik megfelelően!")
            print("Kérlek telepítsd újra a Node.js-t a https://nodejs.org/ oldalról.")
            print("Győződj meg róla, hogy az 'Add to PATH' opció be van jelölve.")
            input("\nNyomj ENTER-t a folytatáshoz...")
            return False, None, None
            
        print(f"Node.js verzió: {node_version.stdout.strip()}")
        print(f"npm verzió: {npm_version.stdout.strip()}")
        print(f"Node.js útvonal: {node_path}")
        print(f"npm útvonal: {npm_path}")
        return True, node_path, npm_path
    except Exception as e:
        print(f"\nHIBA: {str(e)}")
        print("Kérlek telepítsd újra a Node.js-t a https://nodejs.org/ oldalról.")
        print("Győződj meg róla, hogy az 'Add to PATH' opció be van jelölve.")
        input("\nNyomj ENTER-t a folytatáshoz...")
        return False, None, None

def setup_frontend():
    """Frontend telepítése és build készítése"""
    try:
        nodejs_ok, node_path, npm_path = check_nodejs()
        if not nodejs_ok:
            return False

        if not os.path.exists("frontend") or not os.path.exists("frontend/package.json"):
            print("A frontend mappa vagy package.json nem található!")
            input("Nyomj ENTER-t a folytatáshoz...")
            return False

        os.chdir("frontend")
        
        # node_modules és dist mappák törlése
        for folder in ["node_modules", "dist"]:
            if os.path.exists(folder):
                print(f"Régi {folder} törlése...")
                shutil.rmtree(folder)
        
        print("npm cache tisztítása...")
        result = subprocess.run([npm_path, "cache", "clean", "--force"], capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Hiba az npm cache tisztítása során:\n{result.stderr}")
            input("Nyomj ENTER-t a folytatáshoz...")
            return False
        
        print("Frontend függőségek telepítése...")
        result = subprocess.run([npm_path, "install"], capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Hiba az npm install során:\n{result.stderr}")
            input("Nyomj ENTER-t a folytatáshoz...")
            return False
        
        print("Build folyamat indítása...")
        result = subprocess.run([npm_path, "run", "build"], capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Hiba a build során:\n{result.stderr}")
            input("Nyomj ENTER-t a folytatáshoz...")
            return False
        
        os.chdir("..")
        return True
    except Exception as e:
        print(f"\nVáratlan hiba történt a frontend telepítése során: {str(e)}")
        print("Kérlek ellenőrizd, hogy:")
        print("1. Node.js telepítve van-e")
        print("2. A számítógép újraindítása megtörtént-e a Node.js telepítése után")
        input("\nNyomj ENTER-t a folytatáshoz...")
        return False

def collect_static(venv_python: str):
    """Django statikus fájlok összegyűjtése"""
    print("Django statikus fájlok összegyűjtése...")
    subprocess.run([venv_python, "backend/manage.py", "collectstatic", "--noinput"])

def start_server(venv_python: str):
    """Szerver indítása"""
    try:
        # Ellenőrizzük, hogy létezik-e a frontend build
        if not os.path.exists("frontend/dist"):
            print("A frontend build hiányzik. Frontend build készítése...")
            if not setup_frontend():
                print("Hiba történt a frontend build során!")
                input("Nyomj ENTER-t a folytatáshoz...")
                return
            collect_static(venv_python)
        
        print("Django szerver indítása...")
        # A shell=True paraméter hozzáadása Windows rendszeren
        if platform.system() == "Windows":
            subprocess.run(f'"{venv_python}" backend/manage.py runserver', shell=True)
        else:
            subprocess.run([venv_python, "backend/manage.py", "runserver"])
    except Exception as e:
        print(f"Hiba történt a szerver indítása során: {str(e)}")
        input("Nyomj ENTER-t a folytatáshoz...")

def install_all():
    """Teljes telepítési folyamat"""
    current_dir = setup_environment()
    create_virtual_env()
    venv_python, venv_pip = activate_venv(current_dir)
    install_backend(venv_pip, venv_python)
    if setup_frontend():
        collect_static(venv_python)
        print("\nTelepítés sikeresen befejeződött!")
    else:
        print("\nA telepítés során hibák léptek fel!")

def show_menu() -> Optional[str]:
    """Főmenü megjelenítése"""
    clear_screen()
    print("=== Fatal Love Telepítő és Indító ===")
    print("1. Teljes telepítés")
    print("2. Szerver indítása")
    print("3. Kilépés")
    choice = input("\nVálassz egy opciót (1-3): ")
    return choice

def main():
    while True:
        choice = show_menu()
        if choice == "1":
            clear_screen()
            print("Teljes telepítés indítása...\n")
            install_all()
            input("\nNyomj ENTER-t a folytatáshoz...")
        elif choice == "2":
            clear_screen()
            print("Szerver indítása...\n")
            current_dir = setup_environment()
            venv_python, _ = activate_venv(current_dir)
            start_server(venv_python)
        elif choice == "3":
            print("\nViszlát!")
            break
        else:
            print("\nÉrvénytelen választás!")
            input("Nyomj ENTER-t a folytatáshoz...")

if __name__ == "__main__":
    main() 