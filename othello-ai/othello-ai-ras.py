import copy
from random import randint

class Othello_AI:
    def __init__(self, color, size, time_limit) :
        self.color = color
        self.size = size
        self.time_limit = time_limit

    def get_move(self, board_state):
        option = self.getBestOption(board_state, self.color)
        if option is None:
            return (self.color, None)
        else:
            return (self.color, (option['action'][0], option['action'][1]))

    def get_team_name(self):
        return 'othello-ai-ras'

    #find the lists from each directions.
    def getVectors(self, state, r, c):
        vectors = []
        #left
        left = state[r][:c]
        #reverse order
        left = left[::-1]
        l = []
        for item in left:
            if item != '-':
                l.append(item)
            else:
                break
        vectors.append(l)

        #LU
        lu = []
        i = r - 1
        j = c - 1
        while i >= 0 and j >= 0:
            if state[i][j] != '-':
                lu.append(state[i][j])
            else:
                break
            i -= 1
            j -= 1
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
            if item != '-':
                u.append(item)
            else:
                break
        vectors.append(u)

        #RU
        ru = []
        i = r - 1
        j = c + 1
        while i >= 0 and j < len(state):
            if state[i][j] != '-':
                ru.append(state[i][j])
            else:
                break
            i -= 1
            j += 1
        vectors.append(ru)

        #right
        right = state[r][c + 1:]
        r_l = []
        for item in right:
            if item != '-':
                r_l.append(item)
            else:
                break
        vectors.append(r_l)

        #RD
        rd = []
        i = r + 1
        j = c + 1
        while i < len(state) and j < len(state):
            if state[i][j] != '-':
                rd.append(state[i][j])
            else:
                break
            i += 1
            j += 1
        vectors.append(rd)

        #down
        down = col[r + 1:]
        d = []
        for item in down:
            if item != '-':
                d.append(item)
            else:
                break
        vectors.append(d)

        #LD
        ld = []
        i = r + 1
        j = c - 1
        while i < len(state) and j >= 0:
            if state[i][j] != '-':
                ld.append(state[i][j])
            else:
                break
            i += 1
            j -= 1
        vectors.append(ld)
        return vectors

    def getActionsByIndex(self, state, r, c, find, opposite):
        actions = []
        vectors = self.getVectors(state, r, c)

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

        return actions

    def getActions(self, state, find):
        actions = []
        indexFind = 'B'
        if find == 'B':
            indexFind = 'W'
        for r, row in enumerate(state):
            for c, item in enumerate(row):
                if item == find:
                    for item in self.getActionsByIndex(state, r, c, indexFind, find):
                        if item not in actions:
                            actions.append(item)
        return actions

    def setState(self, state, r, c, color):
        vectors = self.getVectors(state, r, c)
        new_state = copy.deepcopy(state)
        #print(vectors)
        for i, item in enumerate(vectors):
            if len(item) > 0:
                if color in item:
                    #find the count of non color in the list.
                    count = self.getCountList(item, color)
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

    def getCountList(self, l, color):
        count = 0
        for item in l:
            if item != color:
                count += 1
            else:
                break
        return count

    def getColorCount(self, state, color):
        count = 0
        for r in state:
            for c in r:
                if c == color:
                    count += 1
        return count

    def getActionOutcomes(self, actions, state, color) :
        new_states = []
        for action in actions:
            item = {}
            item["action"] = action
            item["state"] = self.setState(state, action[0], action[1], color)
            item["count"] = self.getColorCount(item["state"], color)
            new_states.append(item)
        return new_states

    def getMaxActions(self, game_state, color):
        rtnActions = []

        actions = self.getActions(game_state, color)

        states = self.getActionOutcomes(actions, game_state, color)

        states.sort(key=lambda x: x["count"], reverse=True)

        #max val
        if len(states) > 0:
            max_val = states[0]['count']

            for item in states:
                if item['count'] == max_val:
                    rtnActions.append(item)

        return rtnActions

    def rateOption(self, game_state, action):
        rating = 0
        r = action[0]
        c = action[1]
        n = len(game_state)
        #make edge pieces worth + 7
        if r == 0 or r == n - 1:
            rating += 25
            #make corners worth the most
            if c == 0 or c == n - 1:
                rating += 40
        if c == 0 or c == n - 1:
            rating += 25

        if r > 0:
            if c > 0:
                if game_state[r - 1][c - 1] == '-':
                    rating += 5
            if game_state[r - 1][c] == '-':
                rating += 1
            if c < n - 1:
                if game_state[r - 1][c + 1] == '-':
                    rating += 5
        if c > 0:
            if game_state[r][c - 1] == '-':
                rating += 1
        if c < n - 1:
            if game_state[r][c + 1] == '-':
                rating += 1
        if r < n - 1:
            if c > 0:
                if game_state[r + 1][c - 1] == '-':
                    rating += 5
            if game_state[r + 1][c] == '-':
                rating += 1
            if c < n - 1:
                if game_state[r + 1][c + 1] == '-':
                    rating += 5

        #minus points for leeting oponent get to outside.
        if r == 1 or r == n - 2:
            if c > 0 and c < n - 1:
                rating -= 12
            if c == 1 or c == n - 1:
                rating -= 30
        if c == 1 or c == n - 2:
            if r > 0 and r < n - 1:
                rating -= 12

        return rating

    def getBestOption(self, game_state, find):
        #get all possibles.
        opositeFind = 'B'
        if find == 'B':
            opositeFind = 'W'

        actions = self.getActions(game_state, find)
        states = self.getActionOutcomes(actions, game_state, find)

        options = []
        min_count = -1

        for option in states:
            r = option['action'][0]
            c = option['action'][1]

            #check for corners.
            if r == 0:
                if c == 0 or c == len(game_state) - 1:
                    return option
            elif r == len(game_state) - 1:
                if c == 0 or c == len(game_state) - 1:
                    return option

            max_actions = self.getMaxActions(option['state'], opositeFind)

            if len(max_actions) == 0:
                #game ender or oponent cannot move.
                return option
            else:
                if min_count == -1 or min_count > max_actions[0]['count']:
                    min_count = max_actions[0]['count']
                    options = []
                    options.append(option)
                elif min_count == max_actions[0]['count']:
                    options.append(option)

        if len(options) > 1:
            #lets get greedy
            options.sort(key=lambda x: x['count'], reverse=True)
            max_flips = options[0]['count']
            options = list(filter(lambda x: x['count'] == max_flips, options))

            #lets get best by custom heuristic
            best_rated = []
            highest = -1
            for option in options:
                rating = self.rateOption(option['state'], option['action'])
                if highest == -1 or rating > highest:
                    highest = rating
                    best_rated = []
                    best_rated.append(option)
                elif rating == highest:
                    best_rated.append(option)

            #now if there is more than 1 random pick
            if len(best_rated) > 1:
                #random
                index = randint(0, len(best_rated) - 1)
                return best_rated[index]
            else:
                #must be at least 1.
                return best_rated[0]
        elif len(options) == 1:
            return options[0]
        else:
            return None
