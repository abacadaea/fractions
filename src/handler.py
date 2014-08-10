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

		f = open("log.txt","a")
		f.write(json.dumps(self.data) + '\n')
		f.close()
		return True
	
	def get_hiscore(self):
		filters = []
		filters.append("UNIX_TIMESTAMP(ts) > %d" % self.data["ts"])
		filters.append("")
		scores = score.Score.getTop(filters, self.data["number"])
		self.output["scores"] = [x.__dict__ for x in scores]
		return True
