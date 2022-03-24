# tests/integration/fragment-post.hurl

POST http://localhost:8080/v1/fragments
# Get base64 user:password -> echo -n 'user1@email.com:password1' | base64
# Set the Authorization with wrong value
Authorization: Basic dXNlcjWRONGwuY29tOnBhc3N3b3JkMQ==

# Set post content type
Content-Type: text/css

# Set fragment data (String goes inside ``` ```)
```body {width: 100%}```

# 1. We expect to get back an HTTP 201
HTTP/1.1 401

[Asserts]
# check status
jsonpath "$.status" == "error"

# Check error msg
jsonpath "$.error.code" == 401
jsonpath "$.error.message" isString
jsonpath "$.error.message" == "Unauthorized"
