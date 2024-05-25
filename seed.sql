DROP DATABASE IF EXISTS lfg;

DROP DATABASE IF EXISTS lfg_test;

CREATE DATABASE lfg;

CREATE DATABASE lfg_test;

\c lfg

CREATE TABLE platforms (
    id VARCHAR(50) UNIQUE PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO platforms (id, name)
VALUES ('windows', 'Windows'),
('mac', 'Mac'),
('iOS', 'iOS'),
('android', 'Android'),
('x360', 'Xbox 360'),
('x1', 'Xbox 1'),
('xXS', 'Xbox Series X|S'),
('ps3', 'PlayStation 3'),
('ps4', 'PlayStation 4'),
('ps5', 'PlayStation 5'),
('switch', 'Nintendo Switch');

CREATE TABLE games (
    id VARCHAR(200) PRIMARY KEY,
    title VARCHAR(200) UNIQUE NOT NULL,
    release_year INTEGER NOT NULL,
    game_cover VARCHAR(500) NOT NULL
);

INSERT INTO games (id, title, release_year, game_cover)
VALUES ('destiny_2', 'Destiny 2', 2017, 'https://upload.wikimedia.org/wikipedia/en/0/05/Destiny_2_%28artwork%29.jpg'),
('diablo_3', 'Diablo 3', 2012, 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Diablo_III_cover.png/220px-Diablo_III_cover.png'),
('diablo_4', 'Diablo 4', 2023, 'https://www.gameinformer.com/sites/default/files/styles/product_box_art/public/2022/12/09/e606eff3/diabloiv.jpg'),
('dota_2', 'Dota 2', 2013, 'https://i.redd.it/rjxu8q8u1ga91.jpg'),
('league_of_legends', 'League of Legends', 2009, 'https://i.pinimg.com/originals/c5/6c/77/c56c774ee09e3e16bf12460dea765109.jpg'),
('halo_infinite', 'Halo: Infinite', 2021, 'https://imageio.forbes.com/specials-images/imageserve/5f19afb531a9833d9fbc3177/Halo-box-art/960x0.jpg?format=jpg&width=960'),
('valorant', 'Valorant', 2020, 'https://sm.ign.com/ign_nordic/cover/v/valorant/valorant_w15j.jpg'),
('overwatch_2', 'Overwatch 2', 2022, 'https://cdn.mobygames.com/covers/11037272-overwatch-2-playstation-4-front-cover.jpg'),
('fortnite', 'Fortnite', 2017, 'https://static.wikia.nocookie.net/fortnite/images/a/ae/Fortnite_%28Update_v28.00%29'),
('super_smash_bros_ultimate', 'Super Smash Bros Ultimate', 2018, 'https://cdn.mobygames.com/covers/7432106-super-smash-bros-ultimate-nintendo-switch-front-cover.jpg'),
('minecraft', 'Minecraft', 2011, 'https://upload.wikimedia.org/wikinews/en/7/7a/Minecraft_game_cover.jpeg'),
('dead_by_daylight', 'Dead By Daylight', 2016, 'https://upload.wikimedia.org/wikipedia/en/b/b7/Dead_by_Daylight_Steam_header.jpg');

CREATE TABLE platforms_games (
    platform_id VARCHAR(50) REFERENCES platforms,
    game_id VARCHAR(200) REFERENCES games,
    unique (platform_id, game_id)
);

INSERT INTO platforms_games (platform_id, game_id)
VALUES ('windows', 'destiny_2'),
('ps4', 'destiny_2'),
('ps5', 'destiny_2'),
('x1', 'destiny_2'),
('xXS', 'destiny_2'),
('windows', 'diablo_3'),
('mac', 'diablo_3'),
('ps3', 'diablo_3'),
('ps4', 'diablo_3'),
('x360', 'diablo_3'),
('x1', 'diablo_3'),
('switch', 'diablo_3'),
('windows', 'diablo_4'),
('ps5', 'diablo_4'),
('xXS', 'diablo_4'),
('windows', 'dota_2'),
('mac', 'dota_2'),
('windows', 'league_of_legends'),
('mac', 'league_of_legends'),
('windows', 'halo_infinite'),
('x1', 'halo_infinite'),
('xXS', 'halo_infinite'),
('windows', 'valorant'),
('mac', 'valorant'),
('windows', 'overwatch_2'),
('ps4', 'overwatch_2'),
('ps5', 'overwatch_2'),
('x1', 'overwatch_2'),
('xXS', 'overwatch_2'),
('switch', 'overwatch_2'),
('windows', 'fortnite'),
('mac', 'fortnite'),
('iOS', 'fortnite'),
('android', 'fortnite'),
('x1', 'fortnite'),
('xXS', 'fortnite'),
('ps4', 'fortnite'),
('ps5', 'fortnite'),
('switch', 'fortnite'),
('switch', 'super_smash_bros_ultimate'),
('windows', 'minecraft'),
('mac', 'minecraft'),
('ps4', 'minecraft'),
('ps5', 'minecraft'),
('x1', 'minecraft'),
('xXS', 'minecraft'),
('switch', 'minecraft'),
('iOS', 'minecraft'),
('android', 'minecraft'),
('windows', 'dead_by_daylight'),
('iOS', 'dead_by_daylight'),
('android', 'dead_by_daylight'),
('ps4', 'dead_by_daylight'),
('ps5', 'dead_by_daylight'),
('x1', 'dead_by_daylight'),
('xXS', 'dead_by_daylight'),
('switch', 'dead_by_daylight');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(40) UNIQUE NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL,
    karma INTEGER DEFAULT 100
);

CREATE TABLE users_games (
    user_id INTEGER REFERENCES users,
    game_id VARCHAR(200) REFERENCES games,
    unique (user_id, game_id)
);

CREATE TABLE users_platforms (
    user_id INTEGER REFERENCES users,
    platform_id VARCHAR(50) REFERENCES platforms,
    unique (user_id, platform_id)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    body VARCHAR(500) NOT NULL,
    author INTEGER REFERENCES users,
    date_posted DATE NOT NULL,
    date_requested DATE NOT NULL,
    people_requested INTEGER NOT NULL,
    people_accepted INTEGER NOT NULL,
    game VARCHAR(200) REFERENCES games,
    casual BOOLEAN NOT NULL
);

CREATE TABLE rsvps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users,
    post_id INTEGER REFERENCES posts,
    status VARCHAR(25) NOT NULL DEFAULT('pending'),
    unique (user_id, post_id)
);

\c lfg_test

CREATE TABLE platforms (
    id VARCHAR(50) UNIQUE PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO platforms (id, name)
VALUES ('windows', 'Windows'),
('mac', 'Mac'),
('iOS', 'iOS'),
('android', 'Android'),
('x360', 'Xbox 360'),
('x1', 'Xbox 1'),
('xXS', 'Xbox Series X|S'),
('ps3', 'PlayStation 3'),
('ps4', 'PlayStation 4'),
('ps5', 'PlayStation 5'),
('switch', 'Nintendo Switch');

CREATE TABLE games (
    id VARCHAR(200) PRIMARY KEY,
    title VARCHAR(200) UNIQUE NOT NULL,
    release_year INTEGER NOT NULL,
    game_cover VARCHAR(500) NOT NULL
);

INSERT INTO games (id, title, release_year, game_cover)
VALUES ('destiny_2', 'Destiny 2', 2017, 'https://upload.wikimedia.org/wikipedia/en/0/05/Destiny_2_%28artwork%29.jpg'),
('diablo_3', 'Diablo 3', 2012, 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Diablo_III_cover.png/220px-Diablo_III_cover.png'),
('diablo_4', 'Diablo 4', 2023, 'https://www.gameinformer.com/sites/default/files/styles/product_box_art/public/2022/12/09/e606eff3/diabloiv.jpg'),
('dota_2', 'Dota 2', 2013, 'https://i.redd.it/rjxu8q8u1ga91.jpg'),
('league_of_legends', 'League of Legends', 2009, 'https://i.pinimg.com/originals/c5/6c/77/c56c774ee09e3e16bf12460dea765109.jpg'),
('halo_infinite', 'Halo: Infinite', 2021, 'https://imageio.forbes.com/specials-images/imageserve/5f19afb531a9833d9fbc3177/Halo-box-art/960x0.jpg?format=jpg&width=960'),
('valorant', 'Valorant', 2020, 'https://sm.ign.com/ign_nordic/cover/v/valorant/valorant_w15j.jpg'),
('overwatch_2', 'Overwatch 2', 2022, 'https://cdn.mobygames.com/covers/11037272-overwatch-2-playstation-4-front-cover.jpg'),
('fortnite', 'Fortnite', 2017, 'https://static.wikia.nocookie.net/fortnite/images/a/ae/Fortnite_%28Update_v28.00%29'),
('super_smash_bros_ultimate', 'Super Smash Bros Ultimate', 2018, 'https://cdn.mobygames.com/covers/7432106-super-smash-bros-ultimate-nintendo-switch-front-cover.jpg'),
('minecraft', 'Minecraft', 2011, 'https://upload.wikimedia.org/wikinews/en/7/7a/Minecraft_game_cover.jpeg'),
('dead_by_daylight', 'Dead By Daylight', 2016, 'https://upload.wikimedia.org/wikipedia/en/b/b7/Dead_by_Daylight_Steam_header.jpg');

CREATE TABLE platforms_games (
    platform_id VARCHAR(50) REFERENCES platforms,
    game_id VARCHAR(200) REFERENCES games,
    unique (platform_id, game_id)
);

INSERT INTO platforms_games (platform_id, game_id)
VALUES ('windows', 'destiny_2'),
('ps4', 'destiny_2'),
('ps5', 'destiny_2'),
('x1', 'destiny_2'),
('xXS', 'destiny_2'),
('windows', 'diablo_3'),
('mac', 'diablo_3'),
('ps3', 'diablo_3'),
('ps4', 'diablo_3'),
('x360', 'diablo_3'),
('x1', 'diablo_3'),
('switch', 'diablo_3'),
('windows', 'diablo_4'),
('ps5', 'diablo_4'),
('xXS', 'diablo_4'),
('windows', 'dota_2'),
('mac', 'dota_2'),
('windows', 'league_of_legends'),
('mac', 'league_of_legends'),
('windows', 'halo_infinite'),
('x1', 'halo_infinite'),
('xXS', 'halo_infinite'),
('windows', 'valorant'),
('mac', 'valorant'),
('windows', 'overwatch_2'),
('ps4', 'overwatch_2'),
('ps5', 'overwatch_2'),
('x1', 'overwatch_2'),
('xXS', 'overwatch_2'),
('switch', 'overwatch_2'),
('windows', 'fortnite'),
('mac', 'fortnite'),
('iOS', 'fortnite'),
('android', 'fortnite'),
('x1', 'fortnite'),
('xXS', 'fortnite'),
('ps4', 'fortnite'),
('ps5', 'fortnite'),
('switch', 'fortnite'),
('switch', 'super_smash_bros_ultimate'),
('windows', 'minecraft'),
('mac', 'minecraft'),
('ps4', 'minecraft'),
('ps5', 'minecraft'),
('x1', 'minecraft'),
('xXS', 'minecraft'),
('switch', 'minecraft'),
('iOS', 'minecraft'),
('android', 'minecraft'),
('windows', 'dead_by_daylight'),
('iOS', 'dead_by_daylight'),
('android', 'dead_by_daylight'),
('ps4', 'dead_by_daylight'),
('ps5', 'dead_by_daylight'),
('x1', 'dead_by_daylight'),
('xXS', 'dead_by_daylight'),
('switch', 'dead_by_daylight');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(40) UNIQUE NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL,
    karma INTEGER DEFAULT 100
);

CREATE TABLE users_games (
    user_id INTEGER REFERENCES users,
    game_id VARCHAR(200) REFERENCES games,
    unique (user_id, game_id)
);

CREATE TABLE users_platforms (
    user_id INTEGER REFERENCES users,
    platform_id VARCHAR(50) REFERENCES platforms,
    unique (user_id, platform_id)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    body VARCHAR(500) NOT NULL,
    author INTEGER REFERENCES users,
    date_posted DATE NOT NULL,
    date_requested DATE NOT NULL,
    people_requested INTEGER NOT NULL,
    people_accepted INTEGER NOT NULL,
    game VARCHAR(200) REFERENCES games,
    casual BOOLEAN NOT NULL
);

CREATE TABLE rsvps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users,
    post_id INTEGER REFERENCES posts,
    status VARCHAR(25) NOT NULL DEFAULT('pending'),
    unique (user_id, post_id)
);