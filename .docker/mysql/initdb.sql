CREATE DATABASE IF NOT EXISTS code_micro_videos;
CREATE DATABASE IF NOT EXISTS code_micro_videos_test;

CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';