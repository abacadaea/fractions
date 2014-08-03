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
