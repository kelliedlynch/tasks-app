BEGIN TRANSACTION;
DROP TABLE IF EXISTS "list";
DROP TABLE IF EXISTS "list_item";
DROP TABLE IF EXISTS "lists";
DROP TABLE IF EXISTS "list_items";
CREATE TABLE "list" (
	"list_id"	INTEGER NOT NULL UNIQUE,
	"list_name"	TEXT NOT NULL,
	"is_default"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("list_id" AUTOINCREMENT)
);
CREATE TABLE "list_item" (
	"item_name"	TEXT,
	"completed"	BOOL DEFAULT 0,
	"item_id"	INTEGER NOT NULL UNIQUE,
	"list_id"	INTEGER DEFAULT 0,
	PRIMARY KEY("item_id" AUTOINCREMENT)
);
INSERT INTO "list" ("list_id","list_name","is_default") VALUES (1,'Early Morning',1),
 (3,'Late Morning',0),
 (6,'After Lunch',0);
INSERT INTO "list_item" ("item_name","completed","item_id","list_id") VALUES ('start on the chores',0,1,1),
 ('sweep til the floors are clean',0,2,1),
 ('polish and wax',0,3,1),
 ('do laundry',0,4,1),
 ('mop and shine up',0,5,1),
 ('sweep again',0,21,1),
 ('read a book',0,382,3),
 ('read a second book',0,383,3),
 ('read yet another book',0,385,3),
 ('puzzles',0,393,6),
 ('darts',0,394,6),
 ('baking',0,397,6),
 ('add a few new paintings to my gallery',0,399,3),
 ('play guitar',0,403,3),
 ('knit',0,404,3),
 ('paper mache',0,405,6);
COMMIT;
