import sys
# sys.path.insert(0,")/home/kellie/.local/bin")
from flask import Flask, jsonify, request, Response
import json
import sqlite3 as sql
import copy
from flask_cors import CORS

app = Flask(__name__)
app.debug = True
CORS(app)

@app.route("/edit-item", methods=["POST", "OPTIONS"])
def edit_list_item():
   operation = "preflight"
   response = Response()
   if request.method == "POST":
      operation = "post"
      query = ""
      print(request.json)
      if request.json["do"] == "update_completed":
         query = "UPDATE list_item SET completed=%s WHERE item_id=%s" % (request.json["completed"], request.json["item_id"])
      elif request.json["do"] == "update_item_name":
         query = "UPDATE list_item SET item_name='%s' WHERE item_id=%s" % (request.json["item_name"], request.json["item_id"])
      elif request.json["do"] == "add_list_item":
         query = "INSERT INTO list_item (item_name, list_id) VALUES ('%s', '%s')" % (request.json["item_name"], request.json["list_id"])
      elif request.json["do"] == "delete_list_item":
         query = "DELETE FROM list_item WHERE item_id=%s" % request.json["item_id"]
      elif request.json["do"] == "update_list_name":
         query = "UPDATE list SET list_name='%s' WHERE list_id=%s" % (request.json["list_name"], request.json["list_id"])
      print("query is", query);

      with sql.connect("database.db") as connection:
         cursor = connection.cursor()
         cursor.execute(query)
         if(request.json["do"] != "update_list_name"):
            item_id = cursor.lastrowid if request.json["do"] == "add_list_item" else request.json["item_id"]
            print("db operation " + request.json["do"] + " completed on item_id " + str(item_id))
            response.set_data(json.dumps( { "item_id": item_id, "operation": operation}))

         connection.commit()

   response.access_control_allow_origin = "*"
   response.access_control_allow_methods = ["POST", "OPTIONS"]
   response.access_control_allow_headers = ["Content-Type"]
   # print(operation, response)
   return response

@app.patch("/edit-item-new")
def edit_list_item_new():
   print("request is", request)
   response = Response()
   item = copy.copy(request.json["item_data"])
   item_id = item["item_id"]
   del item["item_id"]

   # update_values = ""
   # for column, value in item.items():
   #    update_values += column+"="+value+","
   # update_values = update_values[:-1]

   columns = ",".join(item.keys())
   values = "'" + "','".join(map(str, item.values())) + "'"

   query = "UPDATE list_item SET (%s)=(%s) WHERE item_id=%s" % (columns, values, item_id)
   print(query)
   with sql.connect("database.db") as connection:
         cursor = connection.cursor()
         cursor.execute(query)
         connection.commit()

   response.set_data(json.dumps( { "item_id": item_id, "columns": columns, "values": values }))
   response.access_control_allow_origin = "*"
   response.access_control_allow_methods = ["PATCH"]
   response.access_control_allow_headers = ["Content-Type"]
   print(response)
   return response

@app.route("/edit-list", methods=["PATCH", "OPTIONS"])
def edit_list():
   operation = "preflight"
   response = Response()
   if request.method == "PATCH":
      operation = "patch"
      queries = []
      print(request.json)
      if request.json["do"] == "create_new_list":
         queries.append("INSERT INTO list (list_name) VALUES ('%s')" % (request.json["list_name"]))
      elif request.json["do"] == "delete_list":
         queries.append("DELETE FROM list WHERE list_id=%s" % request.json["list_id"])
         queries.append("DELETE FROM list_item WHERE list_id=%s" % request.json["list_id"])
      elif request.json["do"] == "edit_list":
         queries.append("UPDATE list SET list_name='%s' WHERE list_id=%s" % (request.json["list_name"], request.json["list_id"]))

      with sql.connect("database.db") as connection:
         cursor = connection.cursor()
         for query in queries:
            cursor.execute(query)
         if(request.json["do"] == "edit_list"):
            list_id = cursor.lastrowid
            response.set_data(json.dumps( { "list_id": request.json["list_id"], "operation": operation}))

         connection.commit()

   response.access_control_allow_origin = "*"
   response.access_control_allow_methods = ["PATCH", "OPTIONS"]
   response.access_control_allow_headers = ["Content-Type","Postman-Token"]
   # print(operation, response)
   return response


@app.get("/get-lists")
def get_all_lists():
   print("get-lists", flush=True)
   con = sql.connect("database.db")
   con.row_factory = sql.Row
   cur = con.cursor()
   cur.execute("SELECT * FROM list" )
   rows = cur.fetchall();

   query_array = []
   for row in rows:
      query_array.append ({
         "listId": row["list_id"],
         "listName": row["list_name"],
         "isDefault": row["default"]
         })
   query_results = jsonify(query_array)
   query_results.headers.add('Access-Control-Allow-Origin', '*')
   print(query_results)
   return query_results


@app.get("/get-items/<listId>")
def get_list_items( listId ):
   print("get-items", flush=True)

   con = sql.connect("database.db")
   con.row_factory = sql.Row
   cur = con.cursor()
   cur.execute("SELECT * FROM list_item WHERE list_id=%s" % listId )
   rows = cur.fetchall();

   query_array = []
   for row in rows:
      query_array.append ({
         "itemId": row["item_id"],
         "itemName": row["item_name"],
         "completed": row["completed"]
      })
   query_results = jsonify(query_array)
   query_results.headers.add('Access-Control-Allow-Origin', '*')
   return query_results


def handle_preflight(methods):
   return
