import db, json

class Score:
	def __init__(self, row):
		self.score = 0
		self.IP = ''
		self.ts = 0
		self.name = '??'

		if row: self.__dict__.update(row)

	def insert(self):
		db.cursor.execute("""
			INSERT INTO Score
			(score, name, IP)
			VALUES
			(%s,%s,%s)
		""", (self.score, self.name, self.IP))

	def getByID(self, scoreID):
		db.cursor.execute("""
			SELECT 
				score, 
				IP,
				name, 
				UNIX_TIMESTAMP(ts) as ts 
			FROM Score WHERE scoreID=%d
		""" % scoreID)
		return Score(db.cursor.fetchall()[0])

	@staticmethod
	def getTop(filters, number, order_by = "score"):
		where = ""
		if len(filters) > 0:
			where = "WHERE " + " AND ".join(filters)
		db.cursor.execute("""
			SELECT 
				score, 
				IP,
				name, 
				UNIX_TIMESTAMP(ts) as ts 
			FROM Score %s 
			ORDER BY %s DESC
			LIMIT %d
		""" % (where, order_by, number))
		return [Score(row) for row in list(db.cursor.fetchall())]

	"""
	@staticmethod
	def getScores():
		scores = []
		f = open("log.txt","r")
		while True:
			json_str = f.readline()
			if not json_str: break

			scores.append(Score(json.loads(json_str)))
		return scores
	"""
