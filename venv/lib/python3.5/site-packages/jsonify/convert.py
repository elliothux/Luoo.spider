#!/usr/bin/python

import csv
import json

def jsonify(csv_name):
    with open(csv_name, 'r') as f:
        data = []
        reader = csv.DictReader(f)
        jsonf = open(csv_name[:len(csv_name)-3] + 'json', 'w')
        for row in reader:
            data.append(row)
        jsonf.write(json.dumps(data, sort_keys=True, indent=4))
        jsonf.close()
        
