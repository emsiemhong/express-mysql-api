# Agriculture Products API

This API provides access to agriculture-related data including users, categories, and products.

## Endpoints

### Get All Users

Returns a list of all users in the database.

- **URL**: `/api/users`
- **Method**: `GET`
- **Response**: JSON array containing user details.

### Get All Categories

Returns a list of all available categories.

- **URL**: `/api/categories`
- **Method**: `GET`
- **Response**: JSON array containing category details.

### Get All Products

Returns a list of all products with associated category, creator user, and image details.

- **URL**: `/api/products`
- **Method**: `GET`
- **Response**: JSON array containing product details.

## Example Usage

### Get All Users

#### Request

GET /api/users

#### Response

```json
[
  {
    "user_id": 1,
    "username": "John",
    "email": "john@example.com"
  },
  {
    "user_id": 2,
    "username": "Emma",
    "email": "emma@example.com"
  },
  // ... Other users
]
```

### Get All Categories

#### Request

GET /api/categories

#### Response

```
[
  {
    "category_id": 1,
    "category_name": "Fruits"
  },
  {
    "category_id": 2,
    "category_name": "Vegetables"
  },
  // ... Other categories
]
```

### Get All Products

#### Request

GET /api/products

```
[
  {
    "ProductName": "Apple",
    "Category": "Fruits",
    "CreatedBy": "John",
    "Image": "apple_image_url.png"
  },
  {
    "ProductName": "Tomato",
    "Category": "Vegetables",
    "CreatedBy": "Emma",
    "Image": "tomato_image_url.png"
  },
  // ... Other products
]
```

### Setup
1. Clone the repository.
2. Install dependencies using npm install.
3. Install MySQL and MySQL Workbench
   1. Create password 'test' for root user
   2. create database, named 'agriculture'
   3. import existing [mysql_dump.sql](https://github.com/emsiemhong/learning-resources/blob/main/agriculture-dashboard/mysql-dump/agriculture_test_dump.sql)
      1. This database need to do normalization to make API work
4. Start the server using node api/index.js.