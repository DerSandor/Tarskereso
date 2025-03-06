import subprocess

# Futassa le a backend telepítő scriptet
print("A backend telepítése...")
subprocess.call(["bash", "install.sh"])

print("Mindkét telepítés befejeződött.")

