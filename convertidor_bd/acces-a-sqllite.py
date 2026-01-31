import pyodbc
import sqlite3
import os

# ===== RUTAS =====
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

access_db = os.path.join(BASE_DIR, "CA.mdb")
sqlite_db = os.path.join(BASE_DIR, "CA.db")

# Borrar SQLite si ya existe
if os.path.exists(sqlite_db):
    os.remove(sqlite_db)

# ===== CONEXIONES =====
conn_access = pyodbc.connect(
    r"DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};"
    f"DBQ={access_db};"
)
cur_access = conn_access.cursor()

conn_sqlite = sqlite3.connect(sqlite_db)
cur_sqlite = conn_sqlite.cursor()

# ===== OBTENER TABLAS =====
tablas = [
    row.table_name
    for row in cur_access.tables(tableType='TABLE')
]

print("Tablas encontradas:", tablas)

# ===== CONVERTIR CADA TABLA =====
for tabla in tablas:
    print(f"\nConvirtiendo tabla: {tabla}")

    # Leer datos
    cur_access.execute(f"SELECT * FROM [{tabla}]")
    columnas = [column[0] for column in cur_access.description]

    # Crear tabla SQLite (todo como TEXT para evitar errores)
    columnas_sql = ", ".join([f'"{col}" TEXT' for col in columnas])
    cur_sqlite.execute(f'CREATE TABLE "{tabla}" ({columnas_sql})')

    # Insertar datos
    placeholders = ", ".join(["?"] * len(columnas))
    insert_sql = f'INSERT INTO "{tabla}" VALUES ({placeholders})'

    for fila in cur_access.fetchall():
        cur_sqlite.execute(insert_sql, fila)

    conn_sqlite.commit()

# ===== CERRAR =====
cur_access.close()
conn_access.close()
conn_sqlite.close()

print("\n✅ Conversión terminada. SQLite creado:", sqlite_db)
