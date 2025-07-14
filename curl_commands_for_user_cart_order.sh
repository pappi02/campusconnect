# 1. Create a new user (register)
curl -X POST http://localhost:8000/users/register/ -H "Content-Type: application/json" -d "{\"full_name\":\"Test User\", \"email\":\"testuser@example.com\", \"phone\":\"1234567890\", \"role\":\"customer\"}"

# 2. Log in to get token
curl -X POST http://localhost:8000/users/login/ -H "Content-Type: application/json" -d "{\"email\":\"testuser@example.com\", \"password\":\"TestPass123\"}"

# Note: Extract the token from the login response for the next steps

# 3. Add a product to cart (replace <TOKEN> and <PRODUCT_ID>)
curl -X POST http://localhost:8000/orders/cart/ -H "Content-Type: application/json" -H "Authorization: Token <TOKEN>" -d "{\"product_id\": <PRODUCT_ID>, \"quantity\": 1}"

# 4. Create an order from the cart (replace <TOKEN>)
curl -X POST http://localhost:8000/orders/orders/ -H "Content-Type: application/json" -H "Authorization: Token <TOKEN>" -d "{}"
=======
# Updated Curl commands to create a user, log in, add a product to cart, and proceed to order

# 1. Create a new user (register)
curl -X POST http://localhost:8000/users/register/ -H "Content-Type: application/json" -d "{\"full_name\":\"Test User\", \"email\":\"testuser@example.com\", \"phone\":\"1234567890\", \"role\":\"customer\", \"password\":\"TestPass123\"}"

# 2. Log in to get token
curl -X POST http://localhost:8000/users/login/ -H "Content-Type: application/json" -d "{\"email\":\"testuser@example.com\", \"password\":\"TestPass123\"}"

# Note: Extract the token from the login response for the next steps

# 3. Add a product to cart (replace <TOKEN> and <PRODUCT_ID>)
curl -X POST http://localhost:8000/orders/cart/ -H "Content-Type: application/json" -H "Authorization: Token <TOKEN>" -d "{\"product_id\": <PRODUCT_ID>, \"quantity\": 1}"

# 4. Create an order from the cart (replace <TOKEN>)
curl -X POST http://localhost:8000/orders/orders/ -H "Content-Type: application/json" -H "Authorization: Token <TOKEN>" -d "{}"
