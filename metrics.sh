#!/bin/bash

# CONFIGURATION
URL="http://localhost:5000/my-rooms"  # Replace with your actual endpoint
COOKIE_FILE="cookie.txt"                   # File containing cookies in Netscape format
# Alternatively, you can use: COOKIE_HEADER="Cookie: sessionId=abc123;" and replace -b "$COOKIE_FILE" with -H "$COOKIE_HEADER"

# FUNCTION TO SEND REQUEST
send_request() {
    echo "Sending request at $(date)"
    curl -X GET "$URL" -b "$COOKIE_FILE" -H "Content-Type: application/json"
    echo -e "\n"
}

# RUN LOOP: 2 requests per minute (every 30 seconds)
while true
do
    send_request
    send_request
    sleep 60
done

