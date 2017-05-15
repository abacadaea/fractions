import json
import operator
import time

import db

class Score:
    def __init__(self, row):
        self.score = 0
        self.ts = None # time.time() ? 
        self.name = '??'

        if row: self.__dict__.update(row)

    def insert(self):
        db.insert(self.score, self.name, self.ts)

    @staticmethod
    def get_scores(number):
        """ return last `number` scores """
        json_list = db.get_all_json()
        score_list = [Score(x) for x in json_list]
        return score_list[-number:]

    @staticmethod
    def get_scores_sorted(time_threshold, number):
        score_list = Score.get_scores(0)
        if time_threshold > 0:
            score_list = [x for x in score_list if x.ts > time.time() - time_threshold]
        return reversed(sorted(score_list, key=operator.attrgetter('score')))
