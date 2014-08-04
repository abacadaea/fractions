import json

class Score:
	def __init__(self, row):
		self.score = 0
		self.IP = ''
		self.ts = 0
		self.name = '??'

		if row: self.__dict__.update(row)

	@staticmethod
	def getScores():
		scores = []
		f = open("log.txt","r")
		while True:
			json_str = f.readline()
			if not json_str: break

			scores.append(Score(json.loads(json_str)))
		return scores
