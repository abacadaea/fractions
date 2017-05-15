import json
import time

SCORE_FILE = "data/scores.txt"

def insert(score, name, ts):
    f = open(SCORE_FILE,"a")
    assert(isinstance(score, int))
    assert(isinstance(name, unicode))
    assert(isinstance(ts, int))
    f.write(json.dumps({"score": score, "name": name, "ts": ts}) + '\n')
    f.close()

def get_all_json():
    ret = []
    f = open(SCORE_FILE,"r")
    for line in f.readlines():
        ret.append(json.loads(line))
    f.close()
    return ret
