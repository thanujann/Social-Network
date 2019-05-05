Thanujan Nandakumar's Social Network

The social network was built using Node.js and a MySQL database. It has basic components 
such as groups, topics, posts, responding to posts, reacting to posts, and subscribing 
to topics. A person can become a group member (to any number of groups). Each group member 
belongs to a group. A person can also initiate a subscription to any number of topics or 
unsubscribe from any number of topics. Each topic can have multiple sub topics. A person 
can also create any number of posts. A post is categorized by a topic. A post can also 
have any number of response posts, or reactions (thumbs up or thumbs down).

------
Setup:
------
First, the MySQL database needs to be set up:
 1. Navigate to the folder which contains the setup.sql file
 2. Login to MySQL and run "source setup.sql"

Next, the app server needs to be started.
 1. Change the MySQL credentials in the 'app.js' file to match your local MySQL credentials.
	*Note: If changing the SQL credentials leads to a ER_NOT_SUPPORTED_AUTH_MODE error,
	then you can create a new MySQL user (from the root) and set the native password, as follows:

	CREATE USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
	
	Then, grant all privileges to the user, as follows:
	
	GRANT ALL PRIVILEGES ON *.* TO 'username'@'localhost';
	
	Finally, using this new user's credentials, the social network can be accessed.
	Make sure to run "source setup.sql" on the new user's mysql instance, to get the database.
 2. Run "npm install" on the command terminal.
	*Note: This needs to be run in the folder where the package.json file is.
 3. Run "node app.js" to start the app server.
 
Finally, the social network can be accessed on the designated port (Default 3000):
 1. Open another command terminal (or a web browser)
 2. Use the social network by using 'curl localhost:PORT/..' commands on the command terminal (or directly on the web browser address bar)
 
 

------------------
Possible Commands:
------------------
1. Create a user -> (/createUser/firstName/:firstName/lastName/:lastName/YYYY/:birthYear/MM/:birthMonth/DD/:birthDay)
Returns the id of the newly created user.

Example:
(Create a user named Thanujan Nandakumar born on July 24th, 1997)
curl localhost:3000/createUser/firstName/Thanujan/lastName/Nandakumar/YYYY/1997/MM/07/DD/24

--

2. Create a topic -> (/createTopic/name/:name)
Returns the id of the newly created topic.

Example:
(Create a topic named Music)
curl localhost:3000/createTopic/name/Music

--

3. Create a sub-topic -> (/topic/:topicId/createSubTopic/name/:subTopicName)
Returns the topic id of the newly created sub-topic.

Example:
(Create a sub-topic named Rap, under the topic with id = 1)
curl localhost:3000/topic/1/createSubTopic/name/HipHop

--

4. Create a group -> (/createGroup/name/:name)
Returns the id of the newly created group.

Example:
(Create a group named Hawks)
curl localhost:3000/createGroup/name/Hawks

--

5. Create a post on a topic -> (/user/:personId/createPost/topic/:topicId/text/:text)
Returns the id of the newly created post.

Example:
(Create a post for user 1 (personId = 1) on Music (topicId = 1) that says "This is a music post")
curl localhost:3000/user/1/createPost/topic/1/text/This%20is%20a%20music%20post

--

6. Subscribe a user to a topic -> (/user/:personId/subscribe/:topicId)
On success, returns status = success and on fail, throws error.

Example:
(Subscribe user 1 (personId = 1) to Music (topicId = 1))
curl localhost:3000/user/1/subscribe/1

--

7. Unsubscribe a user from a topic -> (/user/:personId/unsubscribe/:topicId)
On success, returns status = success and on fail, throws error.

Example:
(Unsubscribe user 1 (personId = 1) from Music (topicId = 1))
curl localhost:3000/user/1/unsubscribe/1

--

8. Respond to a post with a thumbs up -> (/user/:personId/likePost/:postId)
On success, returns status = success and on fail, throws error.

Example:
(Make user 1 (personId = 1) like a post (postId = 1))
curl localhost:3000/user/1/likePost/1

--

9. Respond to a post with a thumbs down -> (/user/:personId/dislikePost/:postId)
On success, returns status = success and on fail, throws error.

Example:
(Make user 1 (personId = 1) dislike a post (postId = 1))
curl localhost:3000/user/1/dislikePost/1

--

10. Respond to a post with a response post -> (/user/:personId/post/:postId/createResponse/text/:text)
Returns the post id of the response post.

Example:
(Make user 1 (personId = 1) respond to a post (postId = 1) with "This is a response")
curl localhost:3000/user/1/post/1/createResponse/text/This%20is%20a%20response

--

11. Join a group -> (/user/:personId/joinGroup/:groupId)
On success, returns status = success and on fail, throws error.

Example:
(Make user 1 (personId = 1) join the Warriors group (groupId = 1))
curl localhost:3000/user/1/joinGroup/1

--

12. Search for all users -> (/users)
Returns all of the existing users on the social network (id, first name, last name, birth date, and time last active).

Example:
curl localhost:3000/users

--

13. Search for a person by id -> (/user/:personId)
Returns the id, first name, last name, birth date, and time last active of the person.

Example:
(Search for Student (personId = 1))
curl localhost:3000/user/1

--

14. Search for all groups -> (/groups)
Returns the id and name of each existing group.

Example:
curl localhost:3000/groups

--

15. Search for the group members of a group (by id) -> (/group/:groupId/members)
Returns the user data for each member of the group.

Example:
(Search for the group members of the Warriors group (groupId = 1))
curl localhost:3000/group/:groupId/members

--

16. Search for all topics -> (/topics)
Returns the id and name of all topics.

Example:
curl localhost:3000/topics

--

17. Search for all sub-topics of a topic (by id) -> (/topic/:topicId/subtopics)
Returns the id and name of each sub-topic of the topic.

Example:
(Search for the sub-topics of Music (topicId = 1))
curl localhost:3000/topic/1/subtopics

--

18. Search for a all topics subscribed to by a user (by id) -> (/user/:personId/subscriptions)
Returns the id and name of each topic the user is subscribed to.

Example:
(Search for all subscriptions of user 1 (personId = 1))
curl localhost:3000/user/1/subscriptions

--

19. Search for all posts -> (/posts)
Returns the id, person id, topic id, date created, and text of every post, in order of most recent.

Example:
curl localhost:3000/posts

--

20. Search for all responses to a post (by id) -> (/post/:postId/responses)
Returns the id, person id, topic id, date created, and text of every response post to the post.

Example:
(Search for all the responses to a post (postId = 1))
curl localhost:3000/post/1/responses

--

21. Search for all reactions to a post (by id) -> (/post/:postId/reactions)
Returns the user data of every user that has reacted to the post (split into likes and dislikes).

Example:
(Search for all the reactions to a post (postId = 1))
curl localhost:3000/post/1/reactions

--

22. Check the feed for a user (by id) -> (/user/:userId/feed)
Returns the post data of every post that has a topic id that the user is following. 
Also returns suggested posts, based on posts that have topic ids that are sub-topics of topics that the user is following.
Only shows posts that the user hasn't already seen.

Example:
(Check the feed for user 1 (personId = 1))
curl localhost:3000/user/1/feed