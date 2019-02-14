-- Drops guitars table
DROP TABLE IF EXISTS guitars;

-- Creates guitars table
CREATE TABLE IF NOT EXISTS guitars (
    id SERIAL PRIMARY KEY,
    -- id int NOT NULL GENERATED ALWAYS AS IDENTITY,
    user_id varchar(50) NOT NULL,
    brand varchar(50) NOT NULL,
    model varchar(50) NOT NULL,
    year smallint NULL,
    color varchar(50) NULL
    -- CONSTRAINT guitars ak id UNIQUE (id) NOT DEFERRABLE INITIALLY IMMEDIATE,
    -- CONSTRAINT guitars pk PRIMARY KEY (id)
);

