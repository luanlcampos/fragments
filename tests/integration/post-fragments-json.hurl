# tests/integration/fragment-post.hurl
POST http://localhost:8080/v1/fragments

# Get base64 user:password -> echo -n 'user1@email.com:password1' | base64
# Set the Authorization
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# Send a json file
Content-Type: application/json 
# Set fragment json data
{"data": "JSON post integration test"}

# 1. We expect to get back an HTTP 201
HTTP/1.1 201

[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragments.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.type" == "application/json"
# 38 is the length of our fragment json data
jsonpath "$.fragments.size" == 38
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Type: application/json
Content-Length: 38
[Asserts]
body == ```{"data": "JSON post integration test"}```
