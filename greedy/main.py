from http.server import BaseHTTPRequestHandler,HTTPServer, SimpleHTTPRequestHandler
import json
import copy
import random

def getCountList(l, color):
    count = 0
    for item in l:
        if item != color:
            count += 1
        else:
            break
    return count

def getColorCount(state, color):
    count = 0
    for r in state:
        for c in r:
            if c == color:
                count += 1
    return count

#find the lists from each directions.
def getVectors(state, r, c):
    vectors = []
    #left
    left = state[r][:c]
    #reverse order
    left = left[::-1]
    l = []
    for item in left:
        if item != ' ':
            l.append(item)
        else:
            break
    #print(l)
    vectors.append(l)

    #LU
    lu = []
    i = r - 1
    j = c - 1
    while i >= 0 and j >= 0:
        if state[i][j] != ' ':
            lu.append(state[i][j])
        else:
            break
        i -= 1
        j -= 1
    #print(lu)
    vectors.append(lu)

    col = []
    for row in state:
        col.append(row[c])

    #up
    up = col[: r]
    #reverse order
    up = up[::-1]
    u = []
    for item in up:
        if item != ' ':
            u.append(item)
        else:
            break
    #print(u)
    vectors.append(u)

    #RU
    ru = []
    i = r - 1
    j = c + 1
    while i >= 0 and j < len(state):
        if state[i][j] != ' ':
            ru.append(state[i][j])
        else:
            break
        i -= 1
        j += 1
    #print(ru)
    vectors.append(ru)

    #right
    right = state[r][c + 1:]
    r_l = []
    for item in right:
        if item != ' ':
            r_l.append(item)
        else:
            break
    #print(r_l)
    vectors.append(r_l)

    #RD
    rd = []
    i = r + 1
    j = c + 1
    while i < len(state) and j < len(state):
        if state[i][j] != ' ':
            rd.append(state[i][j])
        else:
            break
        i += 1
        j += 1
    #print(rd)
    vectors.append(rd)

    #down
    down = col[r + 1:]
    d = []
    for item in down:
        if item != ' ':
            d.append(item)
        else:
            break
    #print(d)
    vectors.append(d)

    #LD
    ld = []
    i = r + 1
    j = c - 1
    while i < len(state) and j >= 0:
        if state[i][j] != ' ':
            ld.append(state[i][j])
        else:
            break
        i += 1
        j -= 1
    #print(ld)
    vectors.append(ld)
    return vectors

def getActionsByIndex(state, r, c, find, opposite):
    actions = []
    vectors = getVectors(state, r, c)

    #print(find)
    #print(vectors)
    for i, item in enumerate(vectors):
        if len(item) > 0:
            if opposite not in item:
                #these are valid actions
                if i == 0:
                    #left
                    new_c = c - len(item) - 1
                    if new_c >= 0:
                        actions.append([r, new_c])
                if i == 1:
                    #left-up
                    new_r = r - len(item) - 1
                    new_c = c - len(item) - 1
                    if new_r >= 0 and new_c >= 0:
                        actions.append([new_r, new_c])
                if i == 2:
                    #up
                    new_r = r - len(item) - 1
                    if new_r >= 0:
                        actions.append([new_r, c])
                if i == 3:
                    #right-up
                    new_r = r - len(item) - 1
                    new_c = c + len(item) + 1
                    if new_r >= 0 and new_c < len(state):
                        actions.append([new_r, new_c])
                if i == 4:
                    #right
                    new_c = c + len(item) + 1
                    if new_c < len(state):
                        actions.append([r, new_c])
                if i == 5:
                    #right-down
                    new_r = r + len(item) + 1
                    new_c = c + len(item) + 1
                    if new_r < len(state) and new_c < len(state):
                        actions.append([new_r, new_c])
                if i == 6:
                    #down
                    new_r = r + len(item) + 1
                    if new_r < len(state):
                        actions.append([new_r, c])
                if i == 7:
                    #left-down
                    new_r = r + len(item) + 1
                    new_c = c - len(item) - 1
                    if new_r < len(state) and new_c >= 0:
                        actions.append([new_r, new_c])
                #print(i, len(item))

    return actions

def setState(state, r, c, color):
    vectors = getVectors(state, r, c)
    new_state = copy.deepcopy(state)
    #print(vectors)
    for i, item in enumerate(vectors):
        if len(item) > 0:
            if color in item:
                #find the count of non color in the list.
                count = getCountList(item, color)
                if count > 0:
                    if i == 0:
                        #left
                        for j in range(count):
                            new_state[r][c - (j + 1)] = color
                    if i == 1:
                        #left-up
                        for j in range(count):
                            new_state[r - (j + 1)][c - (j + 1)] = color
                    if i == 2:
                        #up
                        for j in range(count):
                            new_state[r - (j + 1)][c] = color
                    if i == 3:
                        #right-up
                        for j in range(count):
                            new_state[r - (j + 1)][c + (j + 1)] = color
                    if i == 4:
                        #right
                        for j in range(count):
                            new_state[r][c + (j + 1)] = color
                    if i == 5:
                        #right-down
                        for j in range(count):
                            new_state[r + (j + 1)][c + (j + 1)] = color
                    if i == 6:
                        #down
                        for j in range(count):
                            new_state[r + (j + 1)][c] = color
                    if i == 7:
                        #left-down
                        for j in range(count):
                            new_state[r + (j + 1)][c - (j + 1)] = color
                #print(count)
                #print(item)
    new_state[r][c] = color
    return new_state

def getActions(state, find):
    actions = []
    indexFind = 'X'
    if find == 'X':
        indexFind = 'O'
    for r, row in enumerate(state):
        for c, item in enumerate(row):
            if item == find:
                for item in getActionsByIndex(state, r, c, indexFind, find):
                    if item not in actions:
                        actions.append(item)
    return actions

def getActionOutcomes(actions, state, color, asc=True):
    new_states = []
    for action in actions:
        item = {}
        item["action"] = action
        item["state"] = setState(state, action[0], action[1], color)
        item["count"] = getColorCount(item["state"], color)
        new_states.append(item)

    #sort
    new_states.sort(key=lambda x: x["count"], reverse=not asc)
    return new_states

def getBestChoice(state, color):
    actions = getActions(state, color)
    new_states = getActionOutcomes(actions, state, color, False)

    analysis_list = []

    new_states.sort(key=lambda x: x['count'], reverse=True)

    for i, item in enumerate(new_states):
        if i == 0:
            analysis_list.append(item)
        else:
            if item["count"] == analysis_list[0]['count']:
                analysis_list.append(item)

    rtnIndex = random.randrange(len(analysis_list))
    return analysis_list[rtnIndex]["action"]

class GetHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        return

    def do_POST(self):
        if self.path == '/api/v1/ai':
            content_len = int(self.headers.get('Content-Length'))
            post_body = self.rfile.read(content_len).decode("utf-8")
            data = json.loads(post_body)

            #print(data["status"]["availableActions"])
            #print(data["state"])
            #print(data["status"]["player"]["color"])

            #find the best option.
            choice = getBestChoice(data["state"], data["status"]["player"]["color"])
            print(choice)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            #self.data_string = self.rfile.read(int(self.headers['Content-Length']))

            rtnData = {}
            rtnData["player"] = data["status"]["player"]
            rtnData["location"] = choice
            post_data = json.dumps(rtnData)

            self.wfile.write(bytes(post_data, 'utf8'))
            return

Handler=GetHandler

httpd=HTTPServer(("0.0.0.0", 9000), Handler)
httpd.serve_forever()
