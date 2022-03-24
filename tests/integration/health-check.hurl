# Health check
GET http://localhost:8080
# Check if response is non-cacheable
Cache-Control: no-cache
# Extra checks to perform against the response

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"                                # Check if status is ok
jsonpath "$.author" isString                               # Check if author is a string
jsonpath "$.githubUrl" matches /^https:\/\/github.com\/.+/ # Check if github url is valid
jsonpath "$.version" matches /^\d+\.\d+\.\d+$/             # Check version format
