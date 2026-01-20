#!/bin/bash
# Test script for Documo webhook with actual payload structure

# Base64 encode credentials (replace with your actual credentials)
CREDENTIALS=$(echo -n "your_webhook_username:your_webhook_password" | base64)

# Sample payload matching Documo's actual structure
curl -X POST http://localhost:8000/api/webhooks/documo/fax \
  -H "Authorization: Basic $CREDENTIALS" \
  -H "x-webhook-event: fax.v1.inbound.complete" \
  -H "Content-Type: application/json" \
  -d '{
  "messageId": "e0e72262-bf92-47ed-a78c-69547479cad8",
  "deliveryId": "2220202171131453000",
  "watermark": "2220202171154972000",
  "messageNumber": "",
  "status": "success",
  "pagesCount": 5,
  "pagesComplete": 5,
  "duration": 140000,
  "faxNumber": "+12349999999",
  "faxCsid": "Fax CSID",
  "faxCallerId": "1234567890",
  "faxECM": 256,
  "faxSpeed": 33600,
  "faxDetected": true,
  "faxProtocol": 0,
  "faxAttempt": 1,
  "direction": "inbound",
  "channelType": "web",
  "deviceId": "93fbdb1cb82d9b4bbf3d034b85c704e4037eb37b997636e2f19f337b3426622c",
  "faxbridgeId": null,
  "accountId": "f452a5c9-8867-4b41-a1a7-4979d81d68af",
  "errorInfo": "",
  "errorCode": "0",
  "resultCode": "0",
  "resultInfo": "",
  "isArchived": false,
  "isFilePurged": false,
  "country": "US",
  "createdAt": "2022-02-02T17:11:31.453Z",
  "resolvedDate": "2022-02-02T17:11:54.972Z",
  "deletedAt": null
}'
