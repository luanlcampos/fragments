# tests/integration/fragment-post.hurl
POST http://localhost:8080/v1/fragments

# Set the Authorization with base64 string
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# Send a json file
Content-Type: text/plain 
# Set fragment json data
```Hello S3!```

# Successful upload code
HTTP/1.1 201

[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragments.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.type" == "text/plain"
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# GET the fragment we just posted by its URL
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ=

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == ```Hello S3!```


# DELETE the fragment we just posted by its URL
DELETE {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ=

HTTP/1.1 200

# GET deleted fragment
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ=

HTTP/1.1 404


