CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT UUID(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(128) NOT NULL,
  created_at TIMESTAMP DEFAULT UTC_TIMESTAMP(),
  updated_at TIMESTAMP
);

CREATE TABLE tasks (
  task_id UUID PRIMARY KEY DEFAULT UUID(),
  user_id UUID NOT NULL,
  description VARCHAR(255) NOT NULL,
  priority INT DEFAULT 1,
  status BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT UTC_TIMESTAMP(),
  updated_at TIMESTAMP,
  completed_at TIMESTAMP,
  CONSTRAINT fk_todos_users FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_user_id ON tasks(user_id);

CREATE INDEX idx_user_id_status ON tasks (user_id, status);

INSERT INTO users (user_id, username, password_hash) VALUES ('33c17e0e-ec23-44d1-a19e-00f3a07e2a77', 'johndoe', 'supersecretpassword');
INSERT INTO tasks (task_id, user_id, description, status) VALUES (UUID(), '33c17e0e-ec23-44d1-a19e-00f3a07e2a77', 'Dishes', false);