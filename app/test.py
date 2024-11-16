from flatlib import const
from flatlib.datetime import Datetime
from flatlib.geopos import GeoPos
from flatlib.chart import Chart

date = Datetime('2004/11/30', '10:25', '+05:00')
pos = GeoPos('57n26', '56e58')
chart = Chart(date, pos)
print(chart.get(const.SUN))
print(chart.get(const.MERCURY))
print(chart.get(const.ASC))
print(chart.get(const.MC))