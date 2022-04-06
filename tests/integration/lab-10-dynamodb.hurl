# tests/integration/lab-10-dynamodb.hurl

# 1. Post a new json fragment
POST http://localhost:8080/v1/fragments
# Set the Authorization
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# Send a json file
Content-Type: application/json 
# Set fragment json data
{"service": "DynamoDB"}

# 2. We expect to get back an HTTP 201
HTTP/1.1 201
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragments.id"

# 3. Try to GET the fragment we just posted by its URL
GET {{url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Type: application/json
Content-Length: 38
[Asserts]
jsonpath "$.status" == "ok"
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragments.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.type" == "application/json"


# 4. Post a md fragment
POST http://localhost:8080/v1/fragments

# Set the Authorization with base64 string
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# Send a json file
Content-Type: text/markdown 
# Set fragment json data
```DynamoDB is **great**.```


# 5. We expect to get back an HTTP 201
HTTP/1.1 201

[Capture]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragments.id"

# 6. Try to GET the fragment we just posted by its URL
GET {{url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Type: application/json
Content-Length: 38
[Asserts]
jsonpath "$.status" == "ok"
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragments.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.type" == "text/markdown"

# 7. Get the list of fragments 
GET http://localhost:8080/v1/fragments

HTTP/1.1 200
[Asserts]
jsonpath "$.[0] == fragment1_id"
jsonpath "$.[1] == fragment2_id"


# 8. Delete the first fragment
DELETE http://localhost:8080/v1/fragments/fragment1_id

HTTP/1.1 200


# 9. Get the the first fragment and expect 404
GET http://localhost:8080/v1/fragments/fragment1_id

HTTP/1.1 404

# 7. Get the list of fragments 
GET http://localhost:8080/v1/fragments

HTTP/1.1 200
[Asserts]
jsonpath "$.[0] == fragment2_id"
