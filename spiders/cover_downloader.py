from spiders import db
from spiders import lib
from random import random
import time
import math


covers = []
for vol in db.Vol.objects():
    index = math.ceil(random() * vol.length) - 1
    covers.append(db.Track.objects(vol = vol.vol)[index].cover)

print(covers)
j=0
for i in range(0, len(covers), 3):
    image = lib.load_page(url=covers[i], raw=True)
    with open('cover%s.jpg' %j, 'wb') as handler:
        handler.write(image)
    j += 1
