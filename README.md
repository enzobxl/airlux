# AirNet

AirNet is an API designed to manage connections through a NAT using reverse SSH tunnels. This project is built
with [AdonisJS](https://adonisjs.com/), providing a simple and efficient solution to connect devices, such as Raspberry Pi, to a remote
server.

## Features

- **Port Management via API**:
    - When a Raspberry Pi boots up, it requests an available port from the server through the API.
    - The server maintains a list of assigned ports associated with the MAC addresses of the Raspberry Pi devices.
- **Port Release**:
    - When a Raspberry Pi is shut down or inactive, its port is released and made available for other devices.
- **Reverse SSH Tunnels**:
    - SSH commands are used to forward ports from the server to Raspberry Pi devices.
- **Web Interface**:
    - A web interface allows users to view available Raspberry Pi devices and connect to them easily.

## Architecture

AirNet is built on a containerized and server-based architecture:

- **Docker Containers**: Each Raspberry Pi is simulated by a Docker container.
- **AdonisJS API**:
    - Manages requests for port assignments.
    - Stores information in a MySQL database.
- **Traefik**:
    - Provides dynamic routing to services exposed through reverse SSH tunnels.
- **Raspberry Pi**:
    - Dynamically registers with the server and establishes a reverse SSH tunnel to forward local services.

## Installation and Deployment

### Prerequisites

- [Docker](https://www.docker.com/) installed on your machine.
- [Node.js](https://nodejs.org/) and [AdonisJS CLI](https://docs.adonisjs.com/guides/installation) installed.

### Steps

1. Clone the repository:
   ```bash
   git clone <REPO_URL>
   cd airlux

2. Setup project environment:
   ```bash
   cp .env.example .env
   # modify .env file

3. Start MySQL container:
   ```bash
   docker compose -f docker/mysql/docker-compose.yml up -d

4. Run database migration and setup:
   ```bash
   node ace migration:run
   node ace setup

5. Start the API:
   ```bash
   node ace serve
