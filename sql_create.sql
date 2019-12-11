CREATE TABLE unigram_count (
  state_id VARCHAR(64) PRIMARY KEY,
  x_wins INT,
  o_wins INT,
  ties INT
)

CREATE TABLE bigram_count (
  child_state VARCHAR(64),
  parent_state VARCHAR(64),
  x_wins INT,
  o_wins INT,
  ties INT
)

CREATE TABLE insert_unigram(
  insert_state VARCHAR(64),
  x_wins INT,
  o_wins INT,
  ties INT
)

CREATE TABLE insert_bigram(
  child_insert VARCHAR(64),
  parent_insert VARCHAR(64),
  x_wins INT,
  o_wins INT,
  ties INT
)

//test data
INSERT INTO insert_unigram (insert_state,x_wins,o_wins,ties) VALUES 
('                           XO      OX                           ',1,,0),
('                           XO      XX      X                    ',1,0,0),
('                          OOO      XX      X                    ',1,0,0),
('      X                   OOO      XX      X                    ',0,0,1),
('      X                   OOO      XX      X                    ',0,1,0)



INSERT INTO insert_bigram (child_insert,parent_insert,x_wins,o_wins,ties) VALUES 
('                           XO      OX                           ','                           XO      XX      X                    ',1,0,0),
('                           XO      XX      X                    ','                          OOO      XX      X                    ',1,0,0),
('                          OOO      XX      X                    ','                     X    OOX      XX      X                    ',0,1,0)


INSERT INTO unigram_count (state_id,x_wins,o_wins,ties) VALUES 
('                           XO      OX                           ',0,1,0),
('                           XO      XX      X                    ',0,1,0),
('                     X    OOX      XX      X                    ',0,1,0),
('OOXXXXXXOOXXOOOOOOXOOOOXOXOOOOXXOXOOOOXXOOOOOXOXOOOOXOXXXXXXXXXX',0,1,0)


INSERT INTO bigram_count (child_state,parent_state,x_wins,o_wins,ties) VALUES 
('                           XO      OX                           ','                           XO      XX      X                    ',0,1,0),
('                           XO      XX      X                    ','                          OOO      XX   O  X                    ',0,1,0)

//get all the distinct items in insert count
SELECT DISTINCT insert_state,
  (SELECT SUM(i.x_wins) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as x_wins,
  (SELECT SUM(i.o_wins) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as o_wins,
  (SELECT SUM(i.ties) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as ties
FROM insert_unigram u


//get the items that are needed to insert into unigrams as brand new.
SELECT DISTINCT insert_state,
  (SELECT SUM(i.x_wins) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as x_wins,
  (SELECT SUM(i.o_wins) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as o_wins,
  (SELECT SUM(i.ties) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as ties
FROM insert_unigram u
LEFT JOIN unigram_count e
	on e.state_id = u.insert_state
WHERE e.state_id is null;

//how to update existing records.....
SELECT i.insert_state, i.x_wins + u.x_wins as x_wins, i.o_wins + u.o_wins as o_wins, i.ties + u.ties as ties
FROM insert_unigram i
LEFT JOIN unigram_count u
	on u.state_id = i.insert_state
WHERE u.state_id is not null;


//UPDATE unigram_count up SET x_wins=(), o_wins=(), ties=()
WHERE up.insert_state = SELECT DISTINCT insert_state,
  (SELECT SUM(i.x_wins) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as x_wins,
  (SELECT SUM(i.o_wins) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as o_wins,
  (SELECT SUM(i.ties) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as ties
FROM insert_unigram u
LEFT JOIN unigram_count e
	on e.state_id = u.insert_state
WHERE e.state_id is not null;