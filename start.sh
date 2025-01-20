#!/bin/bash

# Archivo que marca si las migraciones y seeders ya se ejecutaron
FLAG_FILE=".setup_done"

# Comprueba si el archivo de marca existe
if [ ! -f "$FLAG_FILE" ]; then
    echo "Primera ejecución: Ejecutando migraciones y seeders..."

    echo "Ejecutando migraciones..."
    node --run migrations

    echo "Ejecutando seeders..."
    node --run seeders

    # Crea el archivo de marca para evitar ejecutar migraciones y seeders de nuevo
    touch "$FLAG_FILE"

    echo "Migraciones y seeders completados."
else
    echo "Migraciones y seeders ya se ejecutaron previamente. Saltando..."
fi

echo "Iniciando la aplicación..."
npm start
