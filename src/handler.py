import puzzle, solver

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

	def getPuzzles(self):
		size = self.data["size"]
		number = self.data["number"] if "number" in self.data else 1
		self.output["puzzles"] = []
		for i in range(number):
			self.output["puzzles"].append(
				puzzle.Puzzle.generatePuzzle(size).json())
		
		return True
	
