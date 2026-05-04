#!/bin/bash
AUTH=$(echo -n '894825716@qq.com:H5Ze AcJY H5Tn MMar tUzd HA6i' | base64)
HOST="https://chineseyiwu.com/wp-json/wp/v2"

echo "Fetching page 1494..."
curl -s -H "Authorization: Basic $AUTH" "$HOST/pages/1494?context=edit" > page_1494.json

cat page_1494.json | grep -o "free-quote" | head -n 5
