|Action | Inputs/Data | Pre conditions | post conditions | API Endpoint |
| -----| -----------| -----------------| ---------------| ------------- |
|User creates an account | <ul><li> Username (string) (player_id)</li><li> Password (string)</li><li> Avatar_id</li></ul> | <ul><li>username cannot contain special characters (letters and numbers only) </li><li>Password cannot contain special characters (letters and numbers only) </li><li>Username must be unique (no duplicates in the database) </li><li>Password length needs to be longer than 4 </li></ul>|<ul><li>Saves the new user into a database (username, password, avatar) </li><li>Encryption of password Username becomes player_id? </li></ul> | POST /login/create |

| User logs in | <ul><li>Username (string) (player_id)</li><li>Password (string)</li><li>isAuthenticated?</li></ul>| User must have an established account that will be stored in the database | Returns true if username and password matches in database | POST /login |

