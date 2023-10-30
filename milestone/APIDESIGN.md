Action | Inputs/Data | Pre conditions | post conditions | API Endpoint

User creates an account |
Username (string) (player_id)
Password (string)
Avatar_id
|
username cannot contain special characters (letters and numbers only)
Password cannot contain special characters (letters and numbers only)
Username must be unique (no duplicates in the database)
Password length needs to be longer than 4?
|
Saves the new user into a database (username, password, avatar)
Encryption of password?
Username becomes player_id?
|
POST /login/create

