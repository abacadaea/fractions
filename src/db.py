import MySQLdb

mysqlHost = "localhost"
mysqlUser = "ec2-user"
mysqlPassword = "password"
mysqlDB = "fractions"

connection = MySQLdb.connect(
	host = mysqlHost,
	user = mysqlUser,
	passwd = mysqlPassword,
	db = mysqlDB,
	charset = 'utf8',
	use_unicode = True)

connection.autocommit(True)

cursor = self.connection.cursor(MySQLdb.cursors.DictCursor)

def insert(table, row):
	global cursor
	
	keys = row.keys()
	values = [row[key] for key in keys]
	key_str = ",".join(keys)
	value_str = ",".join(["%s" for key in keys])

	query = "INSERT INTO %s (%s) VALUES (%s)" % (table, key_str, value_str)

	cursor.execute(query, tuple(values))

def insert_many(table, rows):
	global cursor

	pass
