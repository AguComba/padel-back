#!/bin/bash

echo "Ejecutando migraciones..."
node --run migrations

echo "Ejecutando seeders..."
node --run seeders

echo "Iniciando la aplicación..."
npm start
