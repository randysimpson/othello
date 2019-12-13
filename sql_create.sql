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
('                           XO      OX                           ',1,0,0),
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

//how to update existing records.....
UPDATE unigram_count uc
SET x_wins=ins.x_wins + uc.x_wins, o_wins=ins.o_wins + uc.o_wins, ties=ins.ties + uc.ties
FROM (SELECT DISTINCT insert_state,
  (SELECT SUM(i.x_wins) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as x_wins,
  (SELECT SUM(i.o_wins) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as o_wins,
  (SELECT SUM(i.ties) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as ties
FROM insert_unigram u
LEFT JOIN unigram_count e
	on e.state_id = u.insert_state
WHERE e.state_id is not null) ins
WHERE uc.state_id = ins.insert_state;

//get the items that are needed to insert into unigrams as brand new.
SELECT DISTINCT insert_state,
  (SELECT SUM(i.x_wins) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as x_wins,
  (SELECT SUM(i.o_wins) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as o_wins,
  (SELECT SUM(i.ties) FROM insert_unigram i WHERE i.insert_state = u.insert_state) as ties
FROM insert_unigram u
LEFT JOIN unigram_count e
	on e.state_id = u.insert_state
WHERE e.state_id is null;

//distinct items from bigram insert
SELECT DISTINCT child_insert, parent_insert,
  (SELECT SUM(i.x_wins) FROM insert_bigram i WHERE i.child_insert = u.child_insert AND i.parent_insert = u.parent_insert) as x_wins,
  (SELECT SUM(i.o_wins) FROM insert_bigram i WHERE i.child_insert = u.child_insert AND i.parent_insert = u.parent_insert) as o_wins,
  (SELECT SUM(i.ties) FROM insert_bigram i WHERE i.child_insert = u.child_insert AND i.parent_insert = u.parent_insert) as ties
FROM insert_bigram u

//update items in bigrams
UPDATE bigram_count bc
SET x_wins=ins.x_wins + bc.x_wins, o_wins=ins.o_wins + bc.o_wins, ties=ins.ties + bc.ties
FROM (SELECT DISTINCT child_insert, parent_insert,
  (SELECT SUM(i.x_wins) FROM insert_bigram i WHERE i.child_insert = u.child_insert AND i.parent_insert = u.parent_insert) as x_wins,
  (SELECT SUM(i.o_wins) FROM insert_bigram i WHERE i.child_insert = u.child_insert AND i.parent_insert = u.parent_insert) as o_wins,
  (SELECT SUM(i.ties) FROM insert_bigram i WHERE i.child_insert = u.child_insert AND i.parent_insert = u.parent_insert) as ties
FROM insert_bigram u
LEFT JOIN bigram_count e
  ON e.child_state = u.child_insert
  AND e.parent_state = u.parent_insert
WHERE e.child_state is not null) ins
WHERE bc.child_state = ins.child_insert
	AND bc.parent_state = ins.parent_insert;

//items needed to insert into bigrams brand new
SELECT DISTINCT child_insert, parent_insert,
  (SELECT SUM(i.x_wins) FROM insert_bigram i WHERE i.child_insert = u.child_insert AND i.parent_insert = u.parent_insert) as x_wins,
  (SELECT SUM(i.o_wins) FROM insert_bigram i WHERE i.child_insert = u.child_insert AND i.parent_insert = u.parent_insert) as o_wins,
  (SELECT SUM(i.ties) FROM insert_bigram i WHERE i.child_insert = u.child_insert AND i.parent_insert = u.parent_insert) as ties
FROM insert_bigram u
LEFT JOIN bigram_count e
  ON e.child_state = u.child_insert
  AND e.parent_state = u.parent_insert
WHERE e.child_state is null;