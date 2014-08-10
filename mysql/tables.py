tables = {}

tables["User"] = """
	userID INT (11) AUTO_INCREMENT UNIQUE,
	username VARCHAR(40),
	password VARCHAR(40),

	rating INT(11) DEFAULT 1200,

	PRIMARY KEY(userID)
"""

tables["Score"] = """
	scoreID INT (11) AUTO_INCREMENT UNIQUE,
	score INT (11),
	name VARCHAR (80),
	IP VARCHAR (80),
	ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	PRIMARY KEY(userID)
"""
