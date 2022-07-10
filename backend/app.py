import sys
# sys.path.insert(0,")/home/kellie/.local/bin")
from flask import Flask, jsonify
import sqlite3 as sql

app = Flask(__name__)

# Database structure:
# table: tasks
#   name: TEXT
#   completed: BOOL

# @app.get("/add_task")
# def test_app():
#    with sql.connect("database.db") as con:
#       cur = con.cursor()
#       cur.execute("INSERT INTO tasks (name, completed) VALUES ('start on the chores', False)")
#       cur.execute("INSERT INTO tasks (name, completed) VALUES ('sweep ''til the floors are clean', False)")
#       cur.execute("INSERT INTO tasks (name, completed) VALUES ('polish and wax', False)")
#       cur.execute("INSERT INTO tasks (name, completed) VALUES ('do laundry', False)")
#       cur.execute("INSERT INTO tasks (name, completed) VALUES ('mop and shine up', False)")
#       con.commit()
#       con.close()
#       msg = "records added"
#    return msg

@app.get("/tasks")
def show_tasks():

   con = sql.connect("database.db")
   con.row_factory = sql.Row
   cur = con.cursor()
   cur.execute("select * from tasks")
   rows = cur.fetchall();

   query_array = []
   for i, row in enumerate(rows):
      query_array.append ({
         "id": i,
         "name": row["name"],
         "completed": row["completed"]
      })
   query_results = jsonify(query_array)
   query_results.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
   return query_results

# application = app