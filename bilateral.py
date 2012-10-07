#!/usr/bin/python
import sys

class Worker:
	def __init__(self, id):
		self._id = id	
		self._related = {}	
	def isMyBuddy(self):
		return self._id == MY_BUDDY		
	def isRelatedToBuddy(self):
		return MY_BUDDY in self._related
	def __str__(self):
		return str(self._id) + ": " + str(len(self._related))
		
def compareWorker(a, b):
	if len(a._related) == len(b._related):
		if a.isMyBuddy():
			return -1
		if b.isMyBuddy():
			return 1
		
		if a.isRelatedToBuddy() == b.isRelatedToBuddy():
			return 0
		if a.isRelatedToBuddy():
			return 1
			
		return -1
	else:
		if len(a._related) > len(b._related):
			return -1
		else:
			return 1

def hasRelated(w):
	return len(w._related) > 0

MY_BUDDY = 1009

nbTeams = -1
teams = []
london = {}
stockholm = {}
workers = {}
workersList = [];
goingToBarbade = [];

while len(teams) != nbTeams:
	line = sys.stdin.readline().strip()
	if nbTeams == -1:
		nbTeams = int(line)
	else:
		teams.append(line)
		sto = int(line.rsplit(" ")[0])
		lon = int(line.rsplit(" ")[1])
		if not(lon in workers):
			workers[lon] = Worker(lon)
		if not(sto in workers):
			workers[sto] = Worker(sto)
		workers[lon]._related[sto] = workers[sto]
		workers[sto]._related[lon] = workers[lon]
		
workersList = workers.values()

while len(workersList) > 0:
	#sort workers
	workersList.sort(compareWorker)
	
	theId = workersList[0]._id
	goingToBarbade.append(theId)
	del workersList[0]

	for w in workersList:
		if theId in w._related:
			del w._related[theId]

	workersList = filter(hasRelated, workersList)
	
	
print len(goingToBarbade)
print "\n".join(str(g) for g in goingToBarbade)