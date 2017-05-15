import json, score

class RequestHandler:
    def __init__(self, data):
        self.data = data
        self.success = False
        self.output = {}
        print data
    
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
        number = self.data["number"]
        order = "score"
        scores = []
        if "order" in self.data and self.data["order"] == "ts":
            scores = reversed(score.Score.get_scores(number))
        else:
            scores = score.Score.get_scores_sorted(self.data["time"], number)
        self.output["scores"] = [x.__dict__ for x in scores]
        return True
