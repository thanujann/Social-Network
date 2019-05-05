var bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3000

// Setup MySQL connection
var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	port     : 3306,
	user     : 'username',
	password : 'password',
	database : 'db_social_network_tnandaku',
	multipleStatements: true
});
connection.connect();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Create user 
app.get('/createUser/firstName/:firstName/lastName/:lastName/YYYY/:birthYear/MM/:birthMonth/DD/:birthDay', (req, res) => {
	let insertPersonSql = `INSERT INTO Person (firstName, lastName, birthDate) VALUES ('${req.params.firstName}', '${req.params.lastName}', '${req.params.birthYear}-${req.params.birthMonth}-${req.params.birthDay}')`;
	connection.query(insertPersonSql, (error, result) => {
		if (error) throw error;

		var response = {};
		response["status"] = "success";
		response["userId"] = result.insertId;
		res.send(response);
	})
})

// Create topic
app.get('/createTopic/name/:name', (req, res) => {
	let insertTopicSql = `INSERT INTO Topic (name) VALUES ('${req.params.name}')`;
	connection.query(insertTopicSql, (error, result) => {
		if (error) throw error;

		var response = {};
		response["status"] = "success";
		response["topicId"] = result.insertId;
		res.send(response);
	})
})

// Create subtopic
app.get('/topic/:topicId/createSubTopic/name/:subTopicName', (req, res) => {
	connection.beginTransaction((transactionError) => {
      	if(transactionError) throw transactionError;

		let insertTopicSql = `INSERT INTO Topic (name) VALUES ('${req.params.subTopicName}')`;
		connection.query(insertTopicSql, (error, result) => {
			if (error) throw error;

			let insertSubTopicSql = `INSERT INTO Sub_Topic (topicId, subTopicId) VALUES (${req.params.topicId}, ${result.insertId})`;
			connection.query(insertSubTopicSql, (error, subTopicResult) => {
				if (error) {
		              connection.rollback(() => { throw error });
		        }

				connection.commit((commitError) => {
		        	if (commitError) {
		              connection.rollback(() => { throw commitError });
		            }

					var response = {};
					response["status"] = "success";
					response["subTopicId"] = result.insertId;
					res.send(response);
		        })
			})
		})
	})
})

// Create group
app.get('/createGroup/name/:name', (req, res) => {
	let insertGroupSql = `INSERT INTO Group_Info (name) VALUES ('${req.params.name}')`;
	connection.query(insertGroupSql, (error, result) => {
		if (error) throw error;

		var response = {};
		response["status"] = "success";
		response["groupId"] = result.insertId;
		res.send(response);
	})
})

// Create a post on a topic
app.get('/user/:personId/createPost/topic/:topicId/text/:text', (req, res) => {
	let insertPostSql = `INSERT INTO Post (personId, topicId, text) VALUES (${req.params.personId}, ${req.params.topicId}, '${req.params.text}')`;
	connection.query(insertPostSql, (error, result) => {
		if (error) throw error;

		var response = {};
		response["status"] = "success";
		response["postId"] = result.insertId;
		res.send(response);
	})
})

// Subscribe to a topic
app.get('/user/:personId/subscribe/:topicId', (req, res) => {
	let subscribeSql = `INSERT INTO Subscription (personId, topicId) VALUES (${req.params.personId}, ${req.params.topicId})`;
	connection.query(subscribeSql, (error, result) => {
		if (error) throw error;

		var response = {};
		response["status"] = "success";
		res.send(response);
	})
})

// Unsubscribe from topic
app.get('/user/:personId/unsubscribe/:topicId', (req, res) => {
	let unsubscribeSql = `DELETE FROM Subscription WHERE personId = ${req.params.personId} AND topicId = ${req.params.topicId}`;
	connection.query(unsubscribeSql, (error, result) => {
		if (error) throw error;

		var response = {};
		response["status"] = "success";
		res.send(response);
	})
})

// Respond to a post with a thumbs up
app.get('/user/:personId/likePost/:postId', (req, res) => {
	let thumbsUpSql = `INSERT INTO Post_Reaction (postId, personId, isLiked) VALUES (${req.params.postId}, ${req.params.personId}, 1) ON DUPLICATE KEY UPDATE isLiked = 1`;
	connection.query(thumbsUpSql, (error, result) => {
		if (error) throw error;

		var response = {};
		response["status"] = "success";
		res.send(response);
	})
})

// Respond to a post with a thumbs down
app.get('/user/:personId/dislikePost/:postId', (req, res) => {
	let thumbsDownSql = `INSERT INTO Post_Reaction (postId, personId, isLiked) VALUES (${req.params.postId}, ${req.params.personId}, 0) ON DUPLICATE KEY UPDATE isLiked = 0`;
	connection.query(thumbsDownSql, (error, result) => {
		if (error) throw error;

		var response = {};
		response["status"] = "success";
		res.send(response);
	})
})

// Respond to a post with a response post
app.get('/user/:personId/post/:postId/createResponse/text/:text', (req, res) => {
	let getTopicIdSql = `SELECT topicId FROM Post WHERE id = ${req.params.postId}`;
	connection.query(getTopicIdSql, (error, result) => {
		if (error) throw error;

		connection.beginTransaction((transactionError) => {
		  	if(transactionError) throw transactionError

			let insertPostSql = `INSERT INTO Post (personId, topicId, text) VALUES (${req.params.personId}, ${result[0].topicId}, '${req.params.text}')`;
			connection.query(insertPostSql, (error, postInsertResult) => {
				if (error) throw error;

				let insertResponseSql = `INSERT INTO Response_Post (responsePostId, parentPostId) VALUES (${postInsertResult.insertId}, ${req.params.postId})`;
				connection.query(insertResponseSql, (error, responseInsertResult) => {
					if (error) {
						connection.rollback(() => { throw error })
					}

					connection.commit((commitError) => {
			        	if (commitError) {
			              connection.rollback(() => { throw commitError });
			            }

						var response = {};
						response["status"] = "success";
						response["responsePostId"] = postInsertResult.insertId;
						res.send(response);
			        })
				})
			})
		})
	})
})

// Join a group
app.get('/user/:personId/joinGroup/:groupId', (req, res) => {
	let joinGroupSql = `INSERT INTO Group_Member (groupId, personId) VALUES (${req.params.groupId}, ${req.params.personId})`;
	connection.query(joinGroupSql, (error, result) => {
		if (error) throw error;

		var response = {};
		response["status"] = "success";
		res.send(response);
	})
})

// Search for all people
app.get('/users', (req, res) => {
	let getPersonSql = `SELECT * FROM Person`
	connection.query(getPersonSql, (error, results) => {
		if (error) throw error;

		var response = {};
		response["users"] = results;
		res.send(response);
	})
})

// Search for a person by id
app.get('/user/:personId', (req, res) => {
	let getPersonSql = `SELECT * FROM Person WHERE id = ${req.params.personId}`
	connection.query(getPersonSql, (error, results) => {
		if (error) throw error;

		var response = {};
		response["user"] = results;
		res.send(response);
	})
})

// Search for all groups (ids and names)
app.get('/groups', (req, res) => {
	let getGroupsSql = `SELECT * FROM Group_Info`
	connection.query(getGroupsSql, (error, results) => {
		if (error) throw error;

		var response = {};
		response["groups"] = results;
		res.send(response);
	})
})

// Search for group members of a group
app.get('/group/:groupId/members', (req, res) => {
	let selectGroupMemberSql = `SELECT personId FROM Group_Member WHERE groupID = ${req.params.groupId}`
	connection.query(selectGroupMemberSql, (error, results) => {
		if (error) throw error;

		var response = {};
		response["groupid"] = req.params.groupId;
		let personIds = results.map((result) => result.personId)
		if (personIds.length == 0)
		{
			response["members"] = {};    	
			res.send(response);
		}
		else
		{
		    let personSql = `SELECT * FROM Person WHERE id = `.concat(personIds.join(" OR id = "));
		    connection.query(personSql, (error, members) => {
		    	if (error) throw error;

		    	response["members"] = members;    	
		    	res.send(response);
		    })
		}
	})
})

// Search for topics
app.get('/topics', (req, res) => {
	let topicSql = `SELECT * FROM Topic`
	connection.query(topicSql, (error, results) => {
		if (error) throw error;

		var response = {};
		response["topics"] = results;
		res.send(response);
	})
})

// Search for sub-topics of a topic
app.get('/topic/:topicId/subtopics', (req, res) => {
	let selectSql = `SELECT subTopicId FROM Sub_Topic WHERE topicId = ${req.params.topicId}`
	connection.query(selectSql, (error, results) => {
		if (error) throw error;

		var response = {};
		response["topicid"] = req.params.topicId;
		let subTopicIds = results.map((result) => result.subTopicId);
		if (subTopicIds.length == 0)
		{
			response["subtopics"] = {};    	
			res.send(response);
		}
		else
		{
		    let topicSelectSql = `SELECT * FROM Topic WHERE id = `.concat(subTopicIds.join(" OR id = "));
		    connection.query(topicSelectSql, (error, subtopics) => {
		    	if (error) throw error;

		    	response["subtopics"] = subtopics;    	
		    	res.send(response);
		    })
		}
	})
})

// Search for a user's subscriptions
app.get('/user/:personId/subscriptions', (req, res) => {
	let getTopicIdSql = `SELECT topicId FROM Subscription WHERE personId = ${req.params.personId}`
	connection.query(getTopicIdSql, (error, results) => {
		if (error) throw error;

		var response = {};
		response["userid"] = req.params.personId;
		let topicIds = results.map((result) => result.topicId)
		if (topicIds.length == 0)
		{
			response["subscriptions"] = {};    	
			res.send(response);
		}
		else
		{
		    let topicSelectSql = `SELECT * FROM Topic WHERE id = `.concat(topicIds.join(" OR id = "));
		    connection.query(topicSelectSql, (error, topics) => {
		    	if (error) throw error;

		    	response["subscriptions"] = topics;    	
		    	res.send(response);
		    })
		}
	})
})

// Search for posts
app.get('/posts', (req, res) => {
	let selectSql = `SELECT * FROM Post ORDER BY dateCreated DESC`
	connection.query(selectSql, (error, results) => {
		if (error) throw error;

		var response = {};
		response["posts"] = results;
		res.send(response);
	})
})


// Get responses for a post
app.get('/post/:postId/responses', (req, res) => {
	let responsePostSql = `SELECT * FROM Response_Post WHERE parentPostId = ${req.params.postId}`
	connection.query(responsePostSql, (error, results) => {
		if (error) throw error;

		var response = {};
		response["postid"] = req.params.postId;
		let responsePostIds = results.map((result) => result.responsePostId)
		if (responsePostIds.length == 0)
		{
			response["responses"] = {};    	
			res.send(response);
		}
		else
		{
		    let selectSql = `SELECT * FROM Post WHERE id = `.concat(responsePostIds.join(" OR id = ")).concat(" ORDER BY dateCreated DESC");
		    connection.query(selectSql, (error, responses) => {
		    	if (error) throw error;

		    	response["responses"] = responses;    	
		    	res.send(response);
		    })
		}
	})
})

// Get reactions for a post
app.get('/post/:postId/reactions', (req, res) => {
	let sqlStatement = `SELECT personId, isLiked FROM Post_Reaction WHERE postId = ${req.params.postId}`
	connection.query(sqlStatement, (error, results) => {
		if (error) throw error;

		var response = {};
		response["postId"] = req.params.postId;

		var likes = [];
		var dislikes = [];
		results.forEach(reaction => {
			if (reaction.isLiked) {
				likes.push(reaction.personId);
			} else {
				dislikes.push(reaction.personId);
			}
		})

		let sqlStatement = `SELECT * FROM Person`;
		if (likes.length != 0) {
			sqlStatement = sqlStatement.concat(" WHERE id = ").concat(likes.join(" OR id = "));
		} else {
			response["likes"] = {};
		}

		connection.query(sqlStatement, (error, likesResults) => {
			if (error) throw error

			if (likes.length != 0) {
				response["likes"] = likesResults;
			}

			if (dislikes.length == 0)
			{
				response["dislikes"] = {};
				res.send(response);
			}
			else
			{
				let sqlStatement = `SELECT * FROM Person WHERE id = `.concat(dislikes.join(" OR id = "))
				connection.query(sqlStatement, (error, dislikesResults) => {
					if (error) throw error

					response["dislikes"] = dislikesResults;
					res.send(response);
				})
			}
		})
 	})
})

// Check feed for user
app.get('/user/:userId/feed', (req, res) => {
	let getLastActiveStatement = `SELECT lastActive FROM Person WHERE id = ${req.params.userId}`;
	connection.query(getLastActiveStatement, (error, result) => {
		if (error) throw error;

		let timeLastActive = result[0].lastActive;
	  	let sqlStatement = `SELECT topicId FROM Subscription WHERE personId = ${req.params.userId}`
	 	connection.query(sqlStatement, (error, results) => {
		    if (error) throw error;

		    var response = {};
		    response["userid"] = req.params.userId;
		    let topicIds = results.map((result) => result.topicId)
		    if (topicIds.length == 0)
		    {
		    	response["posts"] = {};
		    	response["suggestedPosts"] = {};    	
		    	res.send(response);
		    }
		    else
		    {
		    	let getMainPostsStatement = `SELECT * FROM Post WHERE (dateCreated > '${timeLastActive}') AND (topicId = `.concat(topicIds.join(" OR topicId = ")).concat(") ORDER BY dateCreated DESC");
			    connection.query(getMainPostsStatement, (error, mainPosts) => {
			    	if (error) throw error;

					response["posts"] = mainPosts;
				    let getSubTopicIdStatement = `SELECT DISTINCT subTopicId FROM Sub_Topic WHERE topicId = `.concat(topicIds.join(" OR topicId = "));
				    connection.query(getSubTopicIdStatement, (error, subtopics) => {
				    	if (error) throw error;

				    	let subtopicIds = subtopics.map((subtopic) => subtopic.subTopicId)
				    	if (subtopicIds.length == 0)
					    {
					    	response["suggestedPosts"] = {};    	
					    	res.send(response);
					    }
					    else
					    {
					    	let suggestedTopicIds = subtopicIds.filter(e => !topicIds.includes(e));
					    	let getSuggestedPostsStatement = `SELECT * FROM Post WHERE (dateCreated > '${timeLastActive}') AND (topicId = `.concat(suggestedTopicIds.join(" OR topicId = ")).concat(") ORDER BY dateCreated DESC");
						    connection.query(getSuggestedPostsStatement, (error, suggestedPosts) => {
						    	if (error) throw error;
						    	
						    	response["suggestedPosts"] = suggestedPosts;    	
						    	res.send(response);
						    })
						}
					})
				})
			}
		})
	})

  	let updateLastActiveStatement = `UPDATE Person SET lastActive = CURRENT_TIMESTAMP WHERE id = ${req.params.userId}`;
	connection.query(updateLastActiveStatement, (error, result) => {
		if (error) throw error;
	})
})

app.listen(port, () => console.log(`The social network is up! (Port: ${port})`))