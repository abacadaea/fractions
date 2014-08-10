import db, json

class Score:
	def __init__(self, row):
		self.score = 0
		self.IP = ''
		self.ts = 0
		self.name = '??'

		if row: self.__dict__.update(row)

	def getByID(self, scoreID):
		db.cursor.execute("SELECT * FROM Score WHERE scoreID=%s" % scoreID)
		return Score(db.cursor.fetchall()[0])

	def getTop(self, filters):
		where = "WHERE " + " AND ".join(filters)
		db.cursor.execute("SELECT * FROM Score %s" % filters)
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
