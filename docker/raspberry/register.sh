#!/bin/bash

HOST="airlux.m1-iot.ynov.cloud"
USER="airlux-raspberry"
API_REGISTER_ENDPOINT="localhost:3333/register"
MAC=$(cat /sys/class/net/eth0/address)
USER_AGENT="my-user-agent"
KEY=$(cat /home/register/device_key.pub)

HTTP_PORTS=("22" "80")
TCP_PORTS=("44" "8173")

echo "HTTP ports: ${HTTP_PORTS[*]}"
echo "TCP ports: ${TCP_PORTS[*]}"

LOCAL_PORTS=("${HTTP_PORTS[@]}" "${TCP_PORTS[@]}")
echo "Local ports: ${LOCAL_PORTS[*]}"

request_payload=$(jq -n \
    --arg mac "$MAC" \
    --argjson httpPorts "$(printf '%s\n' "${HTTP_PORTS[@]}" | jq -R . | jq -s .)" \
    --argjson tcpPorts "$(printf '%s\n' "${TCP_PORTS[@]}" | jq -R . | jq -s .)" \
    --arg key "$KEY" \
    --arg userAgent "$USER_AGENT" \
    '{
        mac: $mac,
        httpPorts: $httpPorts,
        tcpPorts: $tcpPorts,
        key: $key,
        userAgent: $userAgent
    }')

echo "Request payload: $request_payload"

echo "Getting ports from API: $API_REGISTER_ENDPOINT, mac=$MAC, http_ports=${HTTP_PORTS[*]}, tcp_ports=${TCP_PORTS[*]}"
response=$(curl --silent --location "$API_REGISTER_ENDPOINT" \
    --header 'Content-Type: application/json' \
    --data "$request_payload")

echo "API response: $response"
if [[ -z "$response" || "$response" == "null" ]]; then
    echo "Error: Empty or invalid response from API"
    exit 1
fi

REMOTE_HTTP_PORTS=($(echo "$response" | jq -r '.httpPorts // [] | .[]'))
REMOTE_TCP_PORTS=($(echo "$response" | jq -r '.tcpPorts // [] | .[]'))
REMOTE_PORTS=("${REMOTE_HTTP_PORTS[@]}" "${REMOTE_TCP_PORTS[@]}")

echo "Remote ports: ${REMOTE_PORTS[*]}"

for i in "${!LOCAL_PORTS[@]}"; do
    LOCAL_PORT=${LOCAL_PORTS[$i]}
    REMOTE_PORT=${REMOTE_PORTS[$i]}
    echo "Checking if local port $LOCAL_PORT is used"
    if lsof -Pi :"$LOCAL_PORT" -sTCP:LISTEN -t >/dev/null ; then
        echo "Local port $LOCAL_PORT is used"
        echo "Creating reverse SSH tunnel for port $LOCAL_PORT to $REMOTE_PORT"
        autossh -M 0 -f -N -o "ServerAliveInterval 30" -o "ServerAliveCountMax 3" -R "$REMOTE_PORT":localhost:"$LOCAL_PORT" $USER@$HOST
    else
        echo "Local port $LOCAL_PORT is not used"
    fi
done

tail -f /dev/null
