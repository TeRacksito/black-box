-- migrate:up
ALTER TABLE users
ADD COLUMN change_pass_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN change_pass_token_expires_at TIMESTAMP DEFAULT NULL;

-- migrate:down
ALTER TABLE users
DROP COLUMN change_pass_token,
DROP COLUMN change_pass_token_expires_at;