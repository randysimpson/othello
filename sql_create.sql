CREATE TABLE unigram_count (
  state_id NVARCHAR(64) PRIMARY KEY,
  x_wins INT,
  o_wins INT,
  ties INT
)

CREATE TABLE bigram_count (
  child_state NVARCHAR(64),
  parent_state NVARCHAR(64),
  x_wins INT,
  o_wins INT,
  ties INT
)

CREATE TABLE insert_unigram(
  insert_state NVARCHAR(64),
  x_wins INT,
  o_wins INT,
  ties INT
)

CREATE TABLE insert_bigram(
  child_insert NVARCHAR(64),
  parent_insert NVARCHAR(64),
  x_wins INT,
  o_wins INT,
  ties INT
)
