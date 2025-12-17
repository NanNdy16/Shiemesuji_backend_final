# Shiemesuji Backend API Documentation

## Base URL
```
http://localhost:3000
```

## Overview
API backend untuk sistem monitoring curah hujan (CH), tinggi muka air (TMA), dan klimatologi.

---

## Authentication (JWT)

### Cara Kerja
API ini menggunakan **JWT (JSON Web Token)** untuk autentikasi:

1. **Login** - Kirim credentials ke endpoint login, dapatkan token
2. **Gunakan Token** - Sertakan token di header `Authorization` untuk akses protected endpoints
3. **Token Expiry** - Token berlaku 24 jam
4. **Key Rotation** - Secret key di-rotate otomatis setiap **7 hari**. Key disimpan secara persisten di server. Token lama akan invalid setelah rotasi.

### Header Authorization
```
Authorization: Bearer <token>
```

### Token Payload
```json
{
  "id": 1,
  "username": "user",
  "id_pos": "A.31",
  "role": "ch|tma|klimatologi|admin",
  "iat": 1702800000,
  "exp": 1702886400
}
```

---

## Authentication Endpoints

### 1. Admin Login
**POST** `/api/admin/login`

Login untuk administrator sistem.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "message": "Login admin berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Admin tidak ditemukan"
}
```
```json
{
  "message": "Password salah"
}
```

---

### 2. Login Curah Hujan (CH)
**GET** `/api/auth/ch`

Cek status endpoint CH.

**Response (200):**
```json
{
  "message": "Auth CH aktif"
}
```

---

**POST** `/api/auth/ch`

Login untuk user Curah Hujan.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "message": "Login CH berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "CH_A.31",
    "id_pos": "A.31",
    "nama_pos": "KOTABUMI - KELAPA TUJUH"
  }
}
```

**Error Response (401):**
```json
{
  "message": "User CH tidak ditemukan"
}
```
```json
{
  "message": "Password salah"
}
```

**Error Response (500):**
```json
{
  "message": "Server error"
}
```

---

### 3. Login TMA (Tinggi Muka Air)
**GET** `/api/auth/tma`

Cek status endpoint TMA.

**Response (200):**
```json
{
  "message": "Auth TMA aktif"
}
```

---

**POST** `/api/auth/tma`

Login untuk user TMA.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "message": "Login TMA berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "TMA_xxx",
    "id_pos": "xxx",
    "nama_pos": "Nama Pos TMA"
  }
}
```

**Error Response (401):**
```json
{
  "message": "User TMA tidak ditemukan"
}
```
```json
{
  "message": "Password salah"
}
```

---

### 4. Login Klimatologi
**GET** `/api/auth/klimatologi`

Cek status endpoint Klimatologi.

**Response (200):**
```json
{
  "message": "Auth Klimatologi aktif"
}
```

---

**POST** `/api/auth/klimatologi`

Login untuk user Klimatologi.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "message": "Login Klimatologi berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "KLIM_xxx",
    "id_pos": "xxx",
    "nama_pos": "Nama Pos Klimatologi"
  }
}
```

**Error Response (401):**
```json
{
  "message": "User Klimatologi tidak ditemukan"
}
```
```json
{
  "message": "Password salah"
}
```

---

## Admin Protected Endpoints

Endpoint berikut memerlukan JWT token dengan role `admin`:

```
Authorization: Bearer <admin_token>
```

### 1. Create User CH
**POST** `/api/admin/user-ch` *(belum terdaftar di app.js)*

**Request Body:**
```json
{
  "username": "string",
  "id_pos": "string",
  "nama_pos": "string"
}
```

**Response (200):**
```json
{
  "message": "User CH berhasil dibuat"
}
```

> Password default: `bbws_perairan`

---

### 2. Create User TMA
**POST** `/api/admin/user-tma` *(belum terdaftar di app.js)*

**Request Body:**
```json
{
  "username": "string",
  "id_pos": "string",
  "nama_pos": "string"
}
```

**Response (200):**
```json
{
  "message": "User TMA berhasil dibuat"
}
```

---

### 3. Create User Klimatologi
**POST** `/api/admin/user-klimatologi` *(belum terdaftar di app.js)*

**Request Body:**
```json
{
  "username": "string",
  "id_pos": "string",
  "nama_pos": "string"
}
```

**Response (200):**
```json
{
  "message": "User Klimatologi berhasil dibuat"
}
```

---

## JWT Authentication Errors

| Status Code | Error Code | Message | Keterangan |
|-------------|------------|---------|------------|
| 401 | `MISSING_TOKEN` | Akses ditolak. Token tidak ditemukan | Header Authorization tidak ada |
| 401 | `TOKEN_EXPIRED` | Token sudah kadaluarsa | Token expired (24h) |
| 401 | `INVALID_TOKEN` | Token tidak valid | Signature salah atau key sudah di-rotate |
| 403 | - | Akses admin ditolak | Token valid tapi role bukan admin |
| 403 | - | Akses CH/TMA/Klimatologi ditolak | Token valid tapi role tidak sesuai |

---

## Database Configuration

```javascript
{
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shiemesuji'
}
```

---

## Error Handling

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Missing required fields |
| 401 | Unauthorized - Token tidak ditemukan |
| 403 | Forbidden - Token invalid atau role tidak sesuai |
| 404 | Not Found - User not found |
| 500 | Internal Server Error |

---

## Running the Server

```bash
cd src
bun run app.js
```

Server akan berjalan di `http://localhost:3000`

### Server Logs
Saat server start, akan muncul:
```
[JWT] Key manager initialized with 7-day persistent rotation
Server running on port 3000
```

Saat key di-rotate (setiap 7 hari):
```
[JWT] New secret key generated. Expires at: 2025-12-24T06:51:14.018Z
```
