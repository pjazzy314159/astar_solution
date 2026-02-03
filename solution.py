from cmath import inf
import heapq
import itertools

W, H = 17, 18

# 0 = free, 1 = obstacle
grid = [[0]*W for _ in range(H)]

    
for x in range(2, 15, 3):
    for y in range(2, 14):
        grid[y][x] = 1

# Add shelves
for a in range(2,15):
    grid[8][a] = 0
    grid[16][a] = 1
    
start = (0,0) # Starting point 
items = [(13, 9), (3,10), (10, 3), (6, 6), (6, 15), (15,7), (15,16)] # Items

# visualize items in grid
for x, y in items:
    grid[y][x] = 7

for _ in grid:
    print(_)

def heuristic(a, b):
    return abs(a[0]-b[0]) + abs(a[1]-b[1])


def neighbors(node):
    x, y = node
    for nx, ny in [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]:
        if 0 <= nx < W and 0 <= ny < H:
            if grid[ny][nx] != 1:
                yield (nx, ny)


def astar(start, goal):
    pq = [(0, start)]
    g = {start: 0}
    parent = {}

    while pq:
        _, current = heapq.heappop(pq)

        if current == goal:
            return g[goal]

        for nb in neighbors(current):
            new_cost = g[current] + 1
            if nb not in g or new_cost < g[nb]:
                g[nb] = new_cost
                f = new_cost + heuristic(nb, goal)
                heapq.heappush(pq, (f, nb))

    return -1


# Distance matrix
points = [start] + items
dist = {(a,b): astar(a,b) for a in points for b in points if a != b}


# TSP
best_order = None
min_total = float(inf)

for perm in itertools.permutations(items):
    total = 0
    curr = start
    for p in perm:
        total += dist[(curr, p)]
        curr = p
    if total < min_total:
        min_total = total
        best_order = perm
    
# for m in dist:
#     print(m)

print("\nOptimal Order:", best_order)
print("Total Distance:", min_total)
