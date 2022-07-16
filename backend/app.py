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

@app.route("/edit-item", methods=["POST", "OPTIONS"])
def edit_list_item():
   operation = "preflight"
   response = Response()
   if request.method == "POST":
      operation = "post"
      query = ""
      if request.json["do"] == "update_completed":
         query = "UPDATE list_items SET completed=%s WHERE item_id=%s" % (request.json["completed"], request.json["item_id"])
      elif request.json["do"] == "add_list_item":
         query = "INSERT INTO list_items (name) VALUES ('%s')" % request.json["name"]
      elif request.json["do"] == "delete_list_item":
         query = "DELETE FROM list_items WHERE item_id=" + request.json["item_id"]
      print("query is", query);

      with sql.connect("database.db") as connection:
         cursor = connection.cursor()
         cursor.execute(query)
         item_id = cursor.lastrowid if request.json["do"] == "add_list_item" else request.json["item_id"]
         print("db operation " + request.json["do"] + " completed on item_id " + str(item_id))
         response.set_data(json.dumps( { "item_id": item_id, "operation": operation}))

         connection.commit()


   response.access_control_allow_origin = "*"
   response.access_control_allow_methods = ["POST", "OPTIONS"]
   response.access_control_allow_headers = ["Content-Type"]
   # print(operation, response)
   return response


@app.get("/tasks")
def show_tasks():

   con = sql.connect("database.db")
   con.row_factory = sql.Row
   cur = con.cursor()
   cur.execute("select * from list_items")
   rows = cur.fetchall();

   query_array = []
   for row in rows:
      query_array.append ({
         "item_id": row["item_id"],
         "name": row["name"],
         "completed": row["completed"]
      })
   query_results = jsonify(query_array)
   query_results.headers.add('Access-Control-Allow-Origin', '*')
   return query_results

# application = app
