CREATE TABLE state (
  id INT,
  state NVARCHAR(64) UNIQUE NOT NULL,
  seq_no INT
)

CREATE TABLE unigram_count (
  state_id INT UNIQUE NOT NULL,
  x_wins INT,
  o_wins INT,
  ties INT
)

CREATE TABLE bigram_count (
  child_state_id INT,
  parent_state_id INT,
  x_wins INT,
  o_wins INT,
  ties INT
)

CREATE TABLE insert_state(
  id INT,
  state NVARCHAR(64),
  seq_no INT
)

CREATE TABLE insert_unigram(
  insert_id INT,
  x_wins INT,
  o_wins INT,
  ties INT
)

CREATE TABLE insert_bigram(
  child_insert_id INT,
  parent_insert_id INT,
  x_wins INT,
  o_wins INT,
  ties INT
)
