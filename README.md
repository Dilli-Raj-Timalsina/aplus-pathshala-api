
# Backend part of A+ pathshala :

Create a common website and mobile application for xyz coaching/college institute .
The fundamental idea is to leverage offline institute to online .
The core  services of the website are:
i) live class,
         ii) student and teacher’s authentication and authorization,
         iii)online payment system,
         iv)recorded course management,
         v)online quiz and exam,
website/application should be able to manage 1000 concurrent user,

## Contributing

Contributions are always welcome!

Mail on dillirajtimalsina354@gmail.com / directly DM on https://www.linkedin.com/in/dilli-raj-timalsina/ for Contributing guide or directly open a PR .
You can create and solve issues .

we will add few best contributors in our internal team  as well .

Types of contribution you can do:
1 : Documentation contribution
2 : code contribution 
3 : project idea direction
4 : feature idea and issue creation 

#Documentation:
Sure, here is the API documentation for the /api/v1/student/signup and /api/v1/student/login endpoints:

Signup
This endpoint allows a student to sign up by providing their name, email, and password. The API returns a JWT in a cookie that can be used to authenticate the student in subsequent requests.

Endpoint	Request Method	Request Body	Response Body
/api/v1/student/signup	POST	{ "name": "John Doe", "email": "johndoe@example.com", "password": "password123" }	If successful: { "status": "success", "message": "User created successfully" }. Otherwise: { "status": "error", "message": <error-message> }
Request Body Requirements
name: The name of the student (required)
email: The email address of the student (required)
password: The password for the student account (required)


