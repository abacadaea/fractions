import tables, db

for name in tables.tables:
	table = tables.tables[name]

	db.cursor.execute(
		"CREATE TABLE `%snew` (%s)",
		name, table)

	db.cursor.execute(
		"INSERT INTO `%snew` (%s) SELECT * FROM `%s`",
		name, table, name, name)

	db.cursor.execute(
		"RENAME TABLE `%s` TO `%sold`, `%snew` TO `%s`",
		name, name, name, name)

	db.cursor.execute("DROP TABLE IF EXISTS `%snew`, `%sold`",
		name,name) 
