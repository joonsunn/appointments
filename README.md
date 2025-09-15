# Appointments Backend Service

This is a backend service for managing appointments, built with NestJS and Prisma. It allows for creating and managing configurations, off-days, off-hours, and appointments, and provides an endpoint to check for available slots.

## Getting Started

1.  **Database Setup**: Make sure a PostgreSQL database is running locally at port `5432`.
2.  **Environment Variables**: Create a `.env` file in the root of the project and add the database connection string. See the example below.
3.  **Installation**: Clone this repo and run `pnpm install`.
4.  **Database Migration**: Run `pnpm prisma migrate deploy` to apply existing database migrations.
5.  **Start Server**: Run `pnpm start:dev` to start the development server, which will be available at `http://localhost:3000`.

### `.env` example

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/appointments"
```

## Development

When making changes to the `prisma/schema.prisma` file, you will need to create a new migration file.

1.  **Create Migration**: Run `pnpm prisma migrate dev --name <your-migration-name>` (e.g., `add-user-table`). This will generate a new SQL migration file and apply it to your local database.
2.  **Commit Changes**: Commit the new file inside the `prisma/migrations` directory to version control.

## Entities

### 1. Config

A `config` represents the core configuration for the appointment system. A default configuration is created on the first request if one doesn't exist.

| Property     | Type    | Default             | Remarks                                       |
| ------------ | ------- | ------------------- | --------------------------------------------- |
| id           | String  | UUIDv4              |                                               |
| slotDuration | Integer | 30                  | Duration of each appointment slot in minutes. |
| maxSlots     | Integer | 1                   | Max concurrent appointments per slot.         |
| startTime    | String  | "09:00"             | Business start time in "hh:mm" format.        |
| endTime      | String  | "18:00"             | Business end time in "hh:mm" format.          |
| sunday       | Boolean | `false`             | `true` if it's a business day.                |
| monday       | Boolean | `true`              |                                               |
| tuesday      | Boolean | `true`              |                                               |
| wednesday    | Boolean | `true`              |                                               |
| thursday     | Boolean | `true`              |                                               |
| friday       | Boolean | `true`              |                                               |
| saturday     | Boolean | `false`             |                                               |
| timeZone     | String  | "Asia/Kuala_Lumpur" |                                               |

### 2. Off Days

Stores specific dates that are designated as non-business days (e.g., public holidays).

| Property | Type   | Default |
| -------- | ------ | ------- |
| id       | String | UUIDv4  |
| date     | String |         |

### 3. Off Hours

Stores specific time ranges within a business day that are unavailable for appointments (e.g., lunch breaks).

| Property  | Type   | Default |
| --------- | ------ | ------- |
| id        | String | UUIDv4  |
| startTime | String | "13:00" |
| endTime   | String | "14:00" |

### 4. Appointments

Stores information about a scheduled appointment.

| Property            | Type     | Default |
| ------------------- | -------- | ------- |
| id                  | String   | UUIDv4  |
| appointmentDateTime | DateTime |         |

## Endpoints

### `/slots`

#### `GET /slots/:date`

Retrieves all available appointment slots for a given date.

- **Params**:
  - `date` (string, required): The date to check, in `YYYY-MM-DD` format.
- **Success Response (200)**:
- ```json
  [
    {
      "date": "2024-04-04",
      "time": "10:00",
      "available_slots": 1
    },
    {
      "date": "2024-04-04",
      "time": "10:30",
      "available_slots": 1
    },
    {
      "date": "2024-04-04",
      "time": "11:00",
      "available_slots": 0
    }
  ]
  ```

### `/appointments`

#### `GET /appointments/:id`

Retrieves a single appointment by ID.

- **Params**:
  - `id` (string, required): The UUID of the appointment to retrieve.
- **Success Response (200)**:
  ```json
  {
    "id": "c2a3a1a0-e3c3-4e2c-8b1a-3a1a2a3a4a5a",
    "createdAt": "2025-09-14T08:00:00.000Z",
    "configId": "d2a3a1a0-e3c3-4e2c-8b1a-3a1a2a3a4a5a",
    "updatedAt": "2025-09-14T08:00:00.000Z",
    "appointmentDateTime": "2024-09-15T10:30:00.000Z"
  }
  ```

#### `GET /appointments/by-date/:date`

Retrieves all appointments for a given date.

- **Params**:
  - `date` (string, required): The date to check, in `YYYY-MM-DD` format.
- **Success Response (200)**:
  ```json
  [
    {
      "id": "c2a3a1a0-e3c3-4e2c-8b1a-3a1a2a3a4a5a",
      "createdAt": "2025-09-14T08:00:00.000Z",
      "configId": "d2a3a1a0-e3c3-4e2c-8b1a-3a1a2a3a4a5a",
      "updatedAt": "2025-09-14T08:00:00.000Z",
      "appointmentDateTime": "2024-09-15T10:30:00.000Z"
    }
  ]
  ```

#### `GET /appointments`

Retrieves all appointments.

- **Success Response (200)**:
  ```json
  [
    {
      "id": "c2a3a1a0-e3c3-4e2c-8b1a-3a1a2a3a4a5a",
      "createdAt": "2025-09-14T08:00:00.000Z",
      "configId": "d2a3a1a0-e3c3-4e2c-8b1a-3a1a2a3a4a5a",
      "updatedAt": "2025-09-14T08:00:00.000Z",
      "appointmentDateTime": "2024-09-15T10:30:00.000Z"
    }
  ]
  ```

#### `POST /appointments`

Creates a new appointment.

- **Body**:
  ```json
  {
    "appointmentDateTime": "2024-09-15T10:30:00.000Z"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "id": "c2a3a1a0-e3c3-4e2c-8b1a-3a1a2a3a4a5a",
    "createdAt": "2025-09-14T08:00:00.000Z",
    "configId": "d2a3a1a0-e3c3-4e2c-8b1a-3a1a2a3a4a5a",
    "updatedAt": "2025-09-14T08:00:00.000Z",
    "appointmentDateTime": "2024-09-15T10:30:00.000Z"
  }
  ```

#### `DELETE /appointments/:id`

Deletes an appointment.

- **Params**:
  - `id` (string, required): The UUID of the appointment to delete.
- **Success Response (200)**: Returns the deleted [Appointment](#4-appointments) object.

#### `PATCH /appointments/:id`

Updates an existing appointment.

- **Params**:
  - `id` (string, required): The UUID of the appointment to update.
- **Body**:
  ```json
  {
    "appointmentDateTime": "2024-09-15T11:00:00.000Z"
  }
  ```
- **Success Response (200)**: Returns the updated [Appointment](#4-appointments) object.

### `/configs`

#### `GET /configs`

Retrieves the current system configuration. Creates a default config if one does not exist.

- **Success Response (200)**: Returns a [Config](#1-config) object.

#### `PATCH /configs`

Updates the current system configuration.

- **Body**:
  ```json
  {
    "slotDuration": 60,
    "maxSlots": 2,
    "startTime": "08:00",
    "endTime": "17:00",
    "monday": false
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "id": "d2a3a1a0-e3c3-4e2c-8b1a-3a1a2a3a4a5a",
    "createdAt": "2025-09-14T08:00:00.000Z",
    "updatedAt": "2025-09-14T08:00:00.000Z",
    "slotDuration": 60,
    "maxSlots": 2,
    "startTime": "08:00",
    "endTime": "17:00",
    "sunday": false,
    "monday": false,
    "tuesday": true,
    "wednesday": true,
    "thursday": true,
    "friday": true,
    "saturday": false,
    "timeZone": "Asia/Kuala_Lumpur"
  }
  ```

### `/off-days`

#### `GET /off-days/all`

Retrieves all off-days.

- **Success Response (200)**:
  ```json
  [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "createdAt": "2025-09-14T08:00:00.000Z",
      "updatedAt": "2025-09-14T08:00:00.000Z",
      "date": "2025-12-25"
    }
  ]
  ```

#### `POST /off-days`

Creates a new off-day.

- **Body**:
  ```json
  {
    "date": "2025-12-25"
  }
  ```
- **Success Response (201)**: Returns an [Off Day](#2-off-days) object.

#### `DELETE /off-days/:date`

Deletes an off-day.

- **Params**:
  - `date` (string, required): The date to delete, in `YYYY-MM-DD` format.
- **Success Response (200)**: Returns the deleted [Off Day](#2-off-days) object.

### `/off-hours`

#### `GET /off-hours/all`

Retrieves all off-hour ranges.

- **Success Response (200)**:
  ```json
  [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "createdAt": "2025-09-14T08:00:00.000Z",
      "updatedAt": "2025-09-14T08:00:00.000Z",
      "startTime": "12:00",
      "endTime": "13:00"
    }
  ]
  ```

#### `POST /off-hours`

Creates a new off-hour range.

- **Body**:
  ```json
  {
    "startTime": "12:00",
    "endTime": "13:00"
  }
  ```
- **Success Response (201)**: Returns an [Off Hour](#3-off-hours) object.

#### `PATCH /off-hours/:id`

Updates an existing off-hour range.

- **Params**:
  - `id` (string, required): The UUID of the off-hour to update.
- **Body**:
  ```json
  {
    "startTime": "12:30",
    "endTime": "13:30"
  }
  ```
- **Success Response (200)**: Returns the updated [Off Hour](#3-off-hours) object.

#### `DELETE /off-hours/:id`

Deletes an off-hour range.

- **Params**:
  - `id` (string, required): The UUID of the off-hour to delete.
- **Success Response (200)**: Returns the deleted [Off Hour](#3-off-hours) object.
