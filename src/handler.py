import json, score

class RequestHandler:
	def __init__(self, data):
		self.data = data
		self.success = False
		self.output = {}
	
	def getData(self):
		return self.data

	def handle(self):
		method = getattr(self, self.data["q"])
		self.success = method()
		self.response = {	
			"success" : self.success,
			"output" : self.output 
			}

	def log_result(self):
		del self.data["q"]
		score.Score(self.data).insert()
		return True
	
	def get_hiscore(self):
		filters = []
		filters.append("UNIX_TIMESTAMP(Score.ts) > UNIX_TIMESTAMP(NOW())-%d" % self.data["time"])
		scores = score.Score.getTop(filters, self.data["number"])
		self.output["scores"] = [x.__dict__ for x in scores]
		return True
