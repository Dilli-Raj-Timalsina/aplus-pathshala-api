# Backend part of A+ Pathshala :

<ul>
    <li>Create a website and mobile application for XYZ Educational Institute with common backend.</li>
    <li>The fundamental idea is to leverage offline institutes to online.</li>
    <li>The Core services of the website will be:</li>
    <ol type="i">
        <li>live classes</li> 
        <li>students and teachers authentication and authorization</li>
        <li>online payment system</li> 
        <li>recorded course management</li> 
        <li>online quiz and exam</li>
    </ol>
    <li>website/application should be able to manage 1000 concurrent users.</li> 
</ul>

## Contributing Guidelines :

**Contributors are always welcome!**

Here are the ways you can contribute :

<ol type="i">
    <li>Code contribution</li>
    <li>Project idea direction</li>
    <li>Documentation contribution</li>
    <li>Feature ideas & issue creation</li>
    <li>Create and solve own issues</li>
</ol>

**We will add the best contributors in our internal team as well !**

For any guidance, mail to dillirajtimalsina354@gmail.com or get connected on [LinkedIn](https://www.linkedin.com/in/dilli-raj-timalsina) or you may directly open a Pull Request.

<hr>

Here is the API documentation for the /api/v1/student/signup and /api/v1/student/login endpoints :

### Signup :

This endpoint allows a student to sign up by providing their name, email, and password.
The API returns a JWT in a cookie that can be used to authenticate the student in subsequent requests.

#### Request Body Requirements :

- name: The name of the student (required)
- email: The email address of the student (required)
- password: The password for the student account (required)

### Endpoint Request Method for /api/v1/student/signup :

#### Request Body :

`POST { "name": "John Doe", "email": "johndoe@example.com", "password": "password123" }`

#### Response Body :

If successful: `{ "status": "success", "message": "User created successfully" }`<br>
Otherwise: `{ "status": "error", "message": <error-message> }`
