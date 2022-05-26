<p align="center">
<h1 align="center">Birth Day Greeting API</h1>
</p>

## About Project

This is a simple API to create User and send birthday message

## Project Stack:
- Programming Language Node Js
- Framework [Express](http://expressjs.com/en/starter/installing.html).
- Database MySql / MariaDB.

<br>

## Requirement
1. Node 10+ and NPM 5+
2. MySql 5.7+ / MariaDB 10+

<br>

## RUN In Development mode
1. config .env -> use .env.example as reference 
2. Setup Database, port, Hookbin End Point in .env file
3. run command below in console from root directory:

```
    npm install
```
4. To run the application:
```
    npm start
```

<br>

## Node dependencies

```
"dependencies": {
    "await-to-js": "^3.0.0",
    "axios": "^0.27.2",
    "bcrypt": "^5.0.1",
    "bcrypt-promise": "^2.0.0",
    "body-parser": "^1.20.0",
    "cookie-parser": "~1.4.4",
    "cors": "^2.8.5",
    "debug": "~2.6.9",
    "dotenv": "^16.0.1",
    "express": "^4.16.4",
    "moment": "^2.29.3",
    "moment-timezone": "^0.5.34",
    "morgan": "~1.9.1",
    "mysql2": "^2.3.3",
    "node-schedule": "^2.1.0",
    "parse-error": "^0.2.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "sequelize": "^6.19.2",
    "validator": "^13.7.0"
  },
```

<br>

## API Reference
### Create user 

End Point:
```
POST /v1/user
```
Curl example:
```
curl --location --request POST 'localhost:3000/v1/user' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'first_name=<first name>' \
--data-urlencode 'last_name=<last name>' \
--data-urlencode 'dob=<date of birth>' \
--data-urlencode 'location=<user location>'
```

This method is controlled by the following parameters:
Body x-www-form-urlencoded

| Parameter   | Descriptions                                 |
| ----------- | -------------------------------------------- |
| first_name  | String, min: 3, max: 100, required, not null |
| last_name   | String, min: 3, max: 100, required, not null |
| dob         | Date, format YYYY-MM-DD                      |
| location    | String, see available location list at [Location API](###7.-Location-List) |

This method has following success response:
```
{
    "success": true,
    "message": "Success to register user.",
    "user": {
        "id": <id>,
        "first_name": <first_name>,
        "last_name": <last_name>,
        "dob": <dob>,
        "location": <location>
    }
}
```

### Read user
End Point:
```
GET /v1/user
```
Curl example:
```
curl --location --request GET 'localhost:3000/v1/user' \
--header 'id: <user_id>'
```

This method is controlled by the following header parameter:

| Parameter   | Descriptions                                 |
| ----------- | -------------------------------------------- |
| id          | User ID, integer                             |

This method has following success response:
```
{
    "success": true,
    "user": {
        "id": <id>,
        "first_name": <first_name>,
        "last_name": <last_name>,
        "dob": <dob>,
        "location": <location>
    }
}
```
### Update user
End Point:
```
PUT /v1/user
```
Curl example:
```
curl --location --request PUT 'localhost:3000/v1/user' \
--header 'id: 1' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'first_name=<first name>' \
--data-urlencode 'last_name=<last name>' \
--data-urlencode 'dob=<date of birth>' \
--data-urlencode 'location=<user location>'
```
This method is controlled by the following header parameter:

| Parameter   | Descriptions                                 |
| ----------- | -------------------------------------------- |
| id          | User ID, integer                             |

This method is controlled by the following parameters:
using Header
Body x-www-form-urlencoded

| Parameter   | Descriptions                                 |
| ----------- | -------------------------------------------- |
| first_name  | String, min: 3, max: 100, required, not null |
| last_name   | String, min: 3, max: 100, required, not null |
| dob         | Date, format YYYY-MM-DD                      |
| location    | String, see available location list at [Location API](###7.-Location-List) |

This method has following success response:
```
{
    "success": true,
    "message": "Success to update user data.",
    "user": {
        "id": <id>,
        "first_name": <first_name>,
        "last_name": <last_name>,
        "dob": <dob>,
        "location": <location>
    }
}
```
### Delete user /v1/user method DELETE
End Point:
```
DELETE /v1/user
```
Curl example:
```
curl --location --request DELETE 'localhost:3000/v1/user' \
--header 'id: <user_id>'
```

This method is controlled by the following header parameter:

| Parameter   | Descriptions                                 |
| ----------- | -------------------------------------------- |
| id          | User ID, integer, reqired, not null          |

This method has following success response:
```
{
    "success": true,
    "message": "Success to delete user."
}
```
### User List
End Point:
```
GET /v1/users
```
Curl example:
```
curl --location --request GET 'localhost:3000/v1/users'
```

This method has following success response:
```
{
    "success": true,
    "users": [
        {
            "id": <id>,
            "first_name": <first_name>,
            "last_name": <last_name>,
            "dob": <dob>,
            "location": <location>
        },
        ...
    ]
}
```
### Update Greeting /v1/users method PUT
To update greeting message you can use this API End Point

End Point:
```
PUT /v1/greeting
```
Curl example:
```
curl --location --request PUT 'localhost:3000/v1/greeting' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'text=<greeting text>'
```
This method is controlled by the following parameters:
using Header
Body x-www-form-urlencoded

| Parameter   | Descriptions                                 |
| ----------- | -------------------------------------------- |
| Greeting    | Text, required, not null                     |

This method has following success response:
```
{
    "success": true,
    "message": "Success to update user data.",
    "greeting": <greeting text>
}
```
### Location List
End Point:
```
GET /v1/location
```
Curl example:
```
curl --location --request GET 'localhost:3000/v1/locations'
```

This method has following success response:
```
{
    "success": true,
    "message": "Location list.",
    "locations": [
        "Asia/Jakarta",
        ...
    ]
}
```
<br>
