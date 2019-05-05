-- Thanujan Nandakumar
-- This file is for setting up the database for the social network
-- It also populates the database with some initial data

-- Drop and create a new database --
DROP DATABASE IF EXISTS db_social_network_tnandaku;
CREATE DATABASE db_social_network_tnandaku;
USE db_social_network_tnandaku;

-- Create table for the users --
CREATE TABLE IF NOT EXISTS Person(
	id INT AUTO_INCREMENT,
	firstName VARCHAR(50) NOT NULL,
	lastName VARCHAR(50) NOT NULL,
	birthDate DATE,
	lastActive TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',
	PRIMARY KEY (id)
) ENGINE=INNODB;

-- Create tables related to topics --
CREATE TABLE IF NOT EXISTS Topic(
	id INT AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL,
	PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Sub_Topic(
	topicId INT NOT NULL,
	subTopicId INT NOT NULL,
	FOREIGN KEY SubTopic_Topic_topic_FK(topicId) REFERENCES Topic(id),
	FOREIGN KEY SubTopic_Topic_subtopic_FK(subTopicId) REFERENCES Topic(id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Subscription(
	personId INT NOT NULL,
	topicId INT NOT NULL,
	FOREIGN KEY Subscription_Person_FK(personId) REFERENCES Person(id),
	FOREIGN KEY Subscription_Topic_FK(topicId) REFERENCES Topic(id)
) ENGINE=INNODB;

-- Create tables related to groups --
CREATE TABLE IF NOT EXISTS Group_Info(
	id INT AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL,
	PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Group_Member(
	groupId INT NOT NULL,
	personId INT NOT NULL,
	FOREIGN KEY GroupMember_GroupInfo_FK(groupId) REFERENCES Group_Info(id),
	FOREIGN KEY GroupMember_Person_FK(PersonId) REFERENCES Person(id)
) ENGINE=INNODB;

-- Create tables related to posting --
CREATE TABLE IF NOT EXISTS Post(
	id INT AUTO_INCREMENT,
	personId INT NOT NULL,
	topicId INT NOT NULL,
	text VARCHAR(255),
	dateCreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY Post_Person_FK(personId) REFERENCES Person(id),
	FOREIGN KEY Post_Topic_FK(topicId) REFERENCES Topic(id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Response_Post(
	responsePostId INT NOT NULL,
	parentPostId INT NOT NULL,
	FOREIGN KEY ResponsePost_Post_response_FK(responsePostId) REFERENCES Post(id),
	FOREIGN KEY ResponsePost_Post_parent_FK(parentPostId) REFERENCES Post(id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Post_Reaction(
	postId INT NOT NULL,
	personId INT NOT NULL,
	isLiked BOOL NOT NULL,
	UNIQUE (postId, personId),
	FOREIGN KEY PostReaction_Post_FK(postId) REFERENCES Post(id),
	FOREIGN KEY PostReaction_Person_FK(personId) REFERENCES Person(id)
) ENGINE=INNODB;



-- Populate Database --
-- Create 3 users
INSERT INTO Person (firstName, lastName, birthDate) VALUES ('Thanujan', 'Nandakumar', '1997-07-24'); -- personId = 1
INSERT INTO Person (firstName, lastName, birthDate) VALUES ('Test', 'User', '1999-03-02'); -- personId = 2
INSERT INTO Person (firstName, lastName, birthDate) VALUES ('Waterloo', 'Student', '1996-04-15'); -- personId = 3

-- Create 4 topics
INSERT INTO Topic (name) VALUES ('Programming'); -- topicId = 1
INSERT INTO Topic (name) VALUES ('Math'); -- topicId = 2
INSERT INTO Topic (name) VALUES ('Food'); -- topicId = 3
INSERT INTO Topic (name) VALUES ('Health'); -- topicId = 4

-- Create 3 posts
INSERT INTO Post (personId, topicId, text) VALUES (1, 1, 'Programming question?'); -- postId = 1
INSERT INTO Post (personId, topicId, text) VALUES (2, 2, 'Math question?'); -- postId = 2
INSERT INTO Post (personId, topicId, text) VALUES (3, 4, 'Health question?'); -- postId = 3

-- Create 3 responses
INSERT INTO Post(personId, topicId, text) VALUES (1, 2, 'Response to Math question'); -- postId = 4
INSERT INTO Response_Post(responsePostId, parentPostId) VALUES (4, 2);
INSERT INTO Post(personId, topicId, text) VALUES (2, 4, 'Response to Health question'); -- postId = 5
INSERT INTO Response_Post(responsePostId, parentPostId) VALUES (5, 3);

-- Make user 2 like the first post
INSERT INTO Post_Reaction (postId, personId, isLiked) VALUES (1, 2, 1);

-- Make user 3 dislike the second post
INSERT INTO Post_Reaction (postId, personId, isLiked) VALUES (2, 3, 0);

-- Add a sub topic to Food
INSERT INTO Topic (name) VALUES ('Pizza'); -- topicId = 5
INSERT INTO Sub_Topic (topicId, subTopicId) VALUES (3, 5);

-- Make user 1 follow the Food topic
INSERT INTO Subscription (personId, topicId) VALUES (1, 3);

-- Create a group
INSERT INTO Group_Info (name) VALUES ('Warriors'); -- groupId = 1

-- Add user 2 to the Warriors group
INSERT INTO Group_Member (groupId, personId) VALUES (1, 2);

-- Create 2 posts for Food and Pizza
INSERT INTO Post (personId, topicId, text) VALUES (1, 3, 'Food statement'); -- postId = 6
INSERT INTO Post (personId, topicId, text) VALUES (1, 5, 'Pizza Statement'); -- postId = 7