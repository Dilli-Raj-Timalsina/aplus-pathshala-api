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

<!-- API DOCUMENTATION STARTS HERE -->
# API Documentation

This is the documentation for the API endpoints provided by the service. The API is designed to provide various functionalities related to user management.

## Base URL

The base URL for all API endpoints is `{{url}}/api/v1/`

## Authentication

The API requires authentication using a JWT token. Please refer to the authentication endpoint for more information on how to obtain the token.

## User Endpoints

### Creating new Student (Signup) : 

This endpoint allows a student to sign up by providing their name, email, and password.<br>
The API returns a JWT in a cookie that can be used to authenticate the student in subsequent requests.

Creates a new student with the given details.

- **URL:** `/student`
- **Method:** `POST`
- **Request Body:**

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "age": 25
}
```

- **Response:**

```json
{
  "id": "1234567890",
  "name": "John Doe",
  "email": "johndoe@example.com",
  "age": 25,
  "created_at": "2023-05-10T12:00:00Z"
}
```

### Get Student

Retrieves the details of a user with the given ID.

- **URL:** `/student/{student_id}`
- **Method:** `GET`
- **Parameters:**

| Name      | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| `student_id` | string | The ID of the student to retrieve |

- **Response:**

```json
{
  "id": "1234567890",
  "name": "John Doe",
  "email": "johndoe@example.com",
  "age": 25,
  "created_at": "2023-05-10T12:00:00Z"
}
```

### Update Student

Updates the details of a user with the given ID.

- **URL:** `/student/{student_id}`
- **Method:** `PUT`
- **Parameters:**

| Name      | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `student_id` | string | The ID of the student to update |

- **Request Body:**

```json
{
  "name": "Jane Doe",
  "age": 30
}
```

- **Response:**

```json
{
  "id": "1234567890",
  "name": "Jane Doe",
  "email": "johndoe@example.com",
  "age": 30,
  "created_at": "2023-05-10T12:00:00Z"
}
```

### Delete Student

Deletes a user with the given ID.

- **URL:** `/student/{student_id}`
- **Method:** `DELETE`
- **Parameters:**

| Name      | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `student_id` | string | The ID of the student to delete |

- **Response:**

```json
{
  "message": "Student with ID 1234567890 has been deleted."
}
```

## Errors

In case of an error, the API returns a JSON response with an `error` field containing a message describing the error.

Example:

```json
{
  "error": "Invalid authentication token."
}
```
