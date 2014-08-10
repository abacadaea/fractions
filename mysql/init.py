import tables
from src import db

for name in tables.tables:
	table = tables.tables[name]

	try:
		db.cursor.execute("DROP TABLES IF EXISTS `%snew`, `%sold`" %
			(name, name))
	except: pass

	db.cursor.execute(
		"CREATE TABLE `%snew` (%s)" %
		(name, table))

	db.cursor.execute(
		"CREATE TABLE IF NOT EXISTS `%s` (%s)" %
		(name, table))

	#db.cursor.execute(
	#	"INSERT INTO `%snew` (*) SELECT * FROM `%s`" %
	#	(name, name))

	db.cursor.execute(
		"RENAME TABLE `%s` TO `%sold`, `%snew` TO `%s`" %
		(name, name, name, name))

	db.cursor.execute("DROP TABLE IF EXISTS `%snew`, `%sold`" %
		(name,name))
