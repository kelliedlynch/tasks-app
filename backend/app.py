import sys
# sys.path.insert(0,")/home/kellie/.local/bin")
from flask import Flask, jsonify, request, Response
import json
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

@app.route("/del-task", methods=["POST", "OPTIONS"])
def delete_task():

   operation = "preflight"
   if request.method == "POST":
      # jsondict = json.load(request.json)
      print(type(request.json["taskid"]))
      with sql.connect("database.db") as con:
         cur = con.cursor()
         cur.execute("DELETE FROM tasks WHERE taskid=?", [request.json["taskid"]] )
         con.commit()
         operation = "deleted task"
         # con.close()

   response = Response(operation)
   response.access_control_allow_origin = "*"
   response.access_control_allow_methods = ["POST", "OPTIONS"]
   response.access_control_allow_headers = ["Content-Type"]
   print(operation, response)
   return response

@app.route("/add-task", methods=["POST", "OPTIONS"])
def add_task():

   operation = "preflight"
   if request.method == "POST":
      # jsondict = json.load(request.json)
      print(request.json["name"])
      with sql.connect("database.db") as con:
         cur = con.cursor()
         cur.execute("INSERT INTO tasks (name, completed) VALUES (?, False)", [request.json["name"]] )
         con.commit()
         operation = "inserted task"
         # con.close()

   response = Response(operation)
   response.access_control_allow_origin = "*"
   response.access_control_allow_methods = ["POST", "OPTIONS"]
   response.access_control_allow_headers = ["Content-Type"]
   print(operation, response)
   return response


@app.get("/tasks")
def show_tasks():

   con = sql.connect("database.db")
   con.row_factory = sql.Row
   cur = con.cursor()
   cur.execute("select * from tasks")
   rows = cur.fetchall();

   query_array = []
   for row in rows:
      query_array.append ({
         "taskid": row["taskid"],
         "name": row["name"],
         "completed": row["completed"]
      })
   query_results = jsonify(query_array)
   query_results.headers.add('Access-Control-Allow-Origin', '*')
   return query_results

# application = app
