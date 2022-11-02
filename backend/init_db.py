import sqlite3

connection = sqlite3.connect('database.db')


with open('demo_data.sql') as f:
    connection.executescript(f.read())

connection.commit()
connection.close()
