# Restaurant-server-fikar API Documentation

## Models

_User_
- username : string (optional)
- email: string (required, uniq, email format)
- password: string (required, length min 5, length max 20)
- role: string
- phoneNumber: string
- address: string

_Category_
- name: string (required)

_Food_
- name: string (required)
- description: string (required)
- price: integer (required, min price 1000)
- imgUrl: string (required)
- authorId: integer
- categoryId: integer
- status: string

_History_
- name: string
- description: string
- updatedBy: string
- FoodId: integer

_Favorite_
- UserId: integer (required)
- FoodId: integer (required)

## List of available endpoints:

- `GET /user`
- `POST /user/register`
- `POST /user/login`
- `POST /user/login-google`

- `GET /public/`
- `POST /public/register`
- `POST /public/login`
- `POST /public/login-google`
- `GET /public/food`
- `GET /public/category`
- `GET /public/qrcode`
- `GET /public/food/:id`

## Routes below need authentication

- `GET /public/favorite`
- `POST /public/favorite/:id`
- `DELETE /public/favorite/:id`

- `GET /category`

- `POST /food`
- `GET /food`
- `GET /food/:id`

- `GET /history`

## Routes below need authentication & authorization

- `PUT /food/:id`
- `DELETE /food/:id`
- `PATCH /food/:id`

&nbsp;

## 1. GET /user
_Response (200 - OK)_
```
{
    "statusCode": 200,
    "data": <array of object>
}
```

## 2. POST /user/register
Request:

- body:
```json
{
    "username": "string",
    "email": "string",
    "password": "string",
    "phoneNumber": "string",
    "address": "string"
}
```
_Response (201 - Created)_
```
{
    "statusCode": 201,
    "message": "Succes created user",
    "data": {
        "id": "integer,
        "username": "string",
        "email": "string",
        "role": "string"
    }
}
```
_Response (400 - Bad Request)_
```
{
    "statusCode": 400,
    "msg": [
        "Invalid email format",
        "Password at least 5 characters"
    ]
}
```

### POST /login

Request:

- body:
```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_
```json
{
  "access_token": "string"
}

```
_Response (200 - OK)_
```
{
    statusCode: 200,
    message: "Succes Login",
    access_token: "string"
}
```

### POST /food
Description => Create new food

- Response (201) // berhasil

```
{
    "statusCode": 201,
    "message": "Food created successfully",
    "data": {
        "id": 10,
        "name": "contoh",
        "description": "contohdeksripsi",
        "price": 200000,
        "imageUrl": "https://www.chefspencil.com/wp-content/uploads/Risotto-Alla-Milanese.jpg.webp",
        "authorId": 1,
        "categoryId": 1,
        "updatedAt": "2022-04-26T13:54:45.582Z",
        "createdAt": "2022-04-26T13:54:45.582Z"
    }
}
```

- Response (400) // gagal, validasi tidak terpenuhi

```
{
    "statusCode": 400,
    "error": {
        "msg": [
            "Food.name cannot be null",
        ]
    }
}
```
### GET /food

Description => Get all food data

Request:
- headers:
```json
{
  "access_token": "string"
}
```
- Response (200) // berhasil

```
{
    "statusCode": 200,
    "data": [
        {
            "id": 1,
            "name": "Ramen",
            "description": "Legend has it that there are several ramen-crazed “gen X-ers” on the hunt for the best Ramen in Sydney, and they’re coming out in droves.",
            "price": 100000,
            "imageUrl": "https://www.gffoodservice.com.au/content/uploads/2021/03/article-image-asian_fusion-3-@1x.jpg",
            "authorId": 1,
            "categoryId": 1,
            "createdAt": "2022-04-26T12:40:48.067Z",
            "updatedAt": "2022-04-26T12:40:48.067Z"
        },
        {
            "id": 2,
            "name": "Fish and chips",
            "description": "Brits have been eating fish and chips since the 19th century. This beloved British street food is traditionally served wrapped in a piece of white paper or newspaper.",
            "price": 200000,
            "imageUrl": "https://www.expatica.com/app/uploads/sites/10/2014/05/fish-chips-1536x1024.jpg",
            "authorId": 1,
            "categoryId": 2,
            "createdAt": "2022-04-26T12:40:48.067Z",
            "updatedAt": "2022-04-26T12:40:48.067Z"
        },
        ...
}
```

### GET /food/:id

Description => Get detail food by Id

Request:
- headers:
```json
{
  "access_token": "string"
}
```
- Response (200) // berhasil
```
{
    statusCode: 200,
    data: {
        id: 1,
        name: "Ramen",
        description: "Legend has it that there are several ramen-crazed “gen X-ers” on the hunt for the best Ramen in Sydney, and they’re coming out in droves.",
        price: 100000,
        imageUrl: "https://www.gffoodservice.com.au/content/uploads/2021/03/article-image-asian_fusion-3-@1x.jpg",
        authorId: 1,
        categoryId: 1,
        createdAt: "2022-04-26T12:40:48.067Z",
        updatedAt: "2022-04-26T12:40:48.067Z"
    }
}
```
- Response (404) // gagal, todo tidak ditemukan

```
{
    "statusCode": 404,
    "error": {
        "msg": "Food not found!"
    }
}
```
### PUT /food/:id
Description => Edit detail food by Id
Request:
- headers:
```json
{
  "access_token": "string"
}
```
- Response (200) // berhasil
```
{
    "statusCode": 200,
    "message": "Food has been updated successfully",
    "data": [
        1
    ]
}
```
- Response (400) // gagal, validasi tidak terpenuhi

```
{
    "statusCode": 400,
    "error": {
        "msg": [
            "Please fill name",
        ]
    }
}
```
- Response (404) // gagal, todo tidak ditemukan
```
{
    "statusCode": 404,
    "error": {
        "msg": "Food not found!"
    }
}
```

### DELETE /food/:id
Request:
- headers:
```json
{
  "access_token": "string"
}
```
- Response (200) // berhasil

```
{
    "statusCode": 200,
    "message": "Food 1 deleted successfully"
}
```
- Response (404) // gagal, todo tidak ditemukan
```
{
    "statusCode": 404,
    "error": {
        "msg": "Food not found!"
    }
}
```

## Global Error
_Response (401 - Unauthorized)_
```json
{
    "statusCode": 401,
    "error": {
        "message": "Invalid (email / password)"
    }
}
```
_Response (403 - Forbidden)_
```json
{
    "statusCode": 403,
    "error": {
        "message": "Forbidden to access"
    }
}
```
_Response (500) // gagal, kesalahan server_
```
{
    statusCode: 500,
    error: {
        message: "Internal Server Error"
    }
}
```