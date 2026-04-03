---
title: My Hotel
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# My Hotel

Ажилчдын нэвтрэх болон удирдлагын API

Base URLs:

# Authentication

# Хэрэглэгч/Нэвтрэх|Бүртгүүлэх

## POST Бүртгүүлэх

POST /api/customers/register/

Имэйл + нууц үгээр шинэ хэрэглэгч бүртгүүлнэ. Амжилттай бол token буцаана.

> Body Parameters

```json
{
  "first_name": "Болд",
  "last_name": "Баатар",
  "email": "bold@gmail.com",
  "phone": "99001122",
  "gender": "male",
  "date_of_birth": "1995-05-20",
  "password": "pass1234",
  "confirm_password": "pass1234"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CustomerRegisterRequest](#schemacustomerregisterrequest)| yes |none|

> Response Examples

> 201 Response

```json
{
  "message": "Бүртгэл амжилттай үүслээ.",
  "token": "a1b2c3d4e5f6...",
  "customer": {
    "id": 1,
    "first_name": "Болд",
    "last_name": "Баатар",
    "email": "bold@gmail.com",
    "phone": "99001122",
    "is_verified": false
  }
}
```

> Validation алдаа

```json
{
  "email": [
    "Энэ имэйл аль хэдийн бүртгэлтэй."
  ]
}
```

```json
{
  "confirm_password": [
    "Нууц үг таарахгүй байна."
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Амжилттай бүртгэгдлээ|[AuthResponse](#schemaauthresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Validation алдаа|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|false|none||none|
|» token|string|false|none||none|
|» customer|[CustomerShort](#schemacustomershort)|false|none||none|
|»» id|integer|false|none||none|
|»» first_name|string|false|none||none|
|»» last_name|string|false|none||none|
|»» email|string|false|none||none|
|»» phone|string|false|none||none|
|»» is_verified|boolean|false|none||none|

## POST Нэвтрэх

POST /api/customers/login/

Имэйл + нууц үгээр нэвтэрнэ. Token буцаана.

> Body Parameters

```json
{
  "email": "bold@gmail.com",
  "password": "pass1234"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|[CustomerLoginRequest](#schemacustomerloginrequest)| yes |none|

> Response Examples

> 200 Response

```json
{
  "message": "Амжилттай нэвтэрлээ.",
  "token": "a1b2c3d4e5f6...",
  "customer": {
    "id": 1,
    "first_name": "Болд",
    "last_name": "Баатар",
    "email": "bold@gmail.com",
    "phone": "99001122",
    "is_verified": false
  }
}
```

> 400 Response

```json
{
  "non_field_errors": [
    "Имэйл эсвэл нууц үг буруу."
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Амжилттай нэвтэрлээ|[AuthResponse](#schemaauthresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Имэйл эсвэл нууц үг буруу|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|false|none||none|
|» token|string|false|none||none|
|» customer|[CustomerShort](#schemacustomershort)|false|none||none|
|»» id|integer|false|none||none|
|»» first_name|string|false|none||none|
|»» last_name|string|false|none||none|
|»» email|string|false|none||none|
|»» phone|string|false|none||none|
|»» is_verified|boolean|false|none||none|

# Хэрэглэгч/Профайл

## POST Гарах

POST /api/customers/logout/

Token-ийг устгаж гарна.

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "message": "Амжилттай гарлаа."
}
```

> Token хүчингүй / хугацаа дууссан

```json
{
  "error": "Хүчингүй token."
}
```

```json
{
  "error": "Token хугацаа дууссан. Дахин нэвтэрнэ үү."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Амжилттай гарлаа|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй / хугацаа дууссан|Inline|

### Responses Data Schema

## GET Профайл харах

GET /api/customers/profile/

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "id": 1,
  "first_name": "Болд",
  "last_name": "Баатар",
  "email": "bold@gmail.com",
  "phone": "99001122",
  "gender": "male",
  "date_of_birth": "1995-05-20",
  "is_verified": true,
  "created_at": "2026-03-17T08:00:00Z"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Профайл мэдээлэл|[CustomerProfile](#schemacustomerprofile)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй эсвэл хугацаа дууссан|None|

## PATCH Профайл засах

PATCH /customers/profile/

Зөвхөн илгээсэн талбаруудыг шинэчилнэ. Email, phone өөрчлөх боломжгүй.

> Body Parameters

```json
{
  "first_name": "Болд",
  "last_name": "Баатар",
  "gender": "male",
  "date_of_birth": "1995-05-20"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| yes |none|
|body|body|[CustomerProfileUpdate](#schemacustomerprofileupdate)| yes |none|

> Response Examples

> 200 Response

```json
{
  "message": "Профайл амжилттай шинэчлэгдлээ.",
  "customer": {
    "id": 1,
    "first_name": "Болд",
    "last_name": "Баатар",
    "email": "bold@gmail.com",
    "phone": "99001122",
    "gender": "male",
    "date_of_birth": "1995-05-20",
    "is_verified": true,
    "created_at": "2026-03-17T08:00:00Z"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Профайл шинэчлэгдлээ|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй эсвэл хугацаа дууссан|None|

### Responses Data Schema

## PATCH Нууц үг солих

PATCH /api/customers/change-password/

Хуучин нууц үгийг шалгаад шинэ нууц үг тохируулна. Нууц үг солигдсоны дараа token цэвэрлэгдэнэ.

> Body Parameters

```json
{
  "old_password": "oldpass123",
  "new_password": "newpass456",
  "confirm_password": "newpass456"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| yes |none|
|body|body|[ChangePasswordRequest](#schemachangepasswordrequest)| yes |none|

> Response Examples

> 200 Response

```json
{
  "message": "Нууц үг амжилттай солигдлоо. Дахин нэвтэрнэ үү."
}
```

> Хуучин нууц үг буруу / нууц үг таарахгүй

```json
{
  "error": "Хуучин нууц үг буруу байна."
}
```

```json
{
  "confirm_password": [
    "Нууц үг таарахгүй байна."
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Нууц үг солигдлоо|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Хуучин нууц үг буруу / нууц үг таарахгүй|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй эсвэл хугацаа дууссан|None|

### Responses Data Schema

## DELETE Бүртгэл устгах

DELETE /api/customers/delete/

Бүртгэлийг идэвхгүй болгоно (soft delete). Token цэвэрлэгдэнэ.

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "message": "Бүртгэл амжилттай устгагдлаа."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Бүртгэл устгагдлаа|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй эсвэл хугацаа дууссан|None|

### Responses Data Schema

# Хэрэглэгч/Захиалга

## POST Захиалга үүсгэх

POST /api/customers/booking/create/

Нэвтэрсэн болон нэвтрээгүй хэрэглэгч захиалга үүсгэж болно. Нэвтэрсэн бол token query param-аар дамжуулна. Coupon код сонголттой.

> Body Parameters

```json
{
  "hotel_id": 141,
  "check_in": "2026-04-10",
  "check_out": "2026-04-12",
  "rooms": [
    {
      "room_type_id": 6,
      "room_category_id": 3,
      "room_count": 1
    }
  ]
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| no |Нэвтэрсэн хэрэглэгчийн token (сонголттой)|
|body|body|[CreateBookingRequest](#schemacreatebookingrequest)| yes |none|

> Response Examples

> 201 Response

```json
{
  "message": "Захиалга амжилттай үүслээ.",
  "booking_code": "1234567890",
  "pin_code": "1234",
  "booking_ids": [
    5,
    6
  ],
  "nights": 2,
  "total_rooms": 1
}
```

> Алдаа

```json
{
  "error": "hotel_id, check_in, check_out, customer_name, customer_phone шаардлагатай."
}
```

```json
{
  "error": "room_type=1 өрөө хүрэлцэхгүй байна."
}
```

```json
{
  "error": "'SAVE10' купон код хүчингүй байна."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Захиалга амжилттай үүслээ|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Алдаа|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй эсвэл хугацаа дууссан|None|

### Responses Data Schema

## GET Захиалгын түүх харах

GET /api/customers/bookings/

Нэвтэрсэн хэрэглэгчийн бүх захиалгуудыг буцаана. status-аар шүүх боломжтой.

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| yes |none|
|status|query|string| no |pending | confirmed | canceled | finished|

#### Enum

|Name|Value|
|---|---|
|status|pending|
|status|confirmed|
|status|canceled|
|status|finished|

> Response Examples

> 200 Response

```json
{
  "count": 2,
  "bookings": [
    {
      "id": 5,
      "hotel_name": "Байгаль Ресорт",
      "room_type": "Deluxe",
      "check_in": "2026-04-10",
      "check_out": "2026-04-12",
      "status": "confirmed",
      "status_label": "Баталгаажсан",
      "total_price": 300000,
      "has_review": false,
      "booking_code": "1234567890",
      "created_at": "2026-03-17T08:00:00Z"
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Захиалгын жагсаалт|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй эсвэл хугацаа дууссан|None|

### Responses Data Schema

## POST Захиалга цуцлах

POST /customers/booking/cancel/

Нэвтэрсэн хэрэглэгч өөрийн захиалгыг booking_code болон pin_code-оор цуцална.

> Body Parameters

```json
{
  "booking_code": "1234567890",
  "pin_code": "1234"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| yes |none|
|body|body|[CancelBookingRequest](#schemacancelbookingrequest)| yes |none|

> Response Examples

> 200 Response

```json
{
  "message": "1 захиалга амжилттай цуцлагдлаа.",
  "booking_code": "1234567890"
}
```

> Цуцлах боломжгүй

```json
{
  "error": "booking_code болон pin_code шаардлагатай."
}
```

```json
{
  "error": "Цуцлах боломжтой захиалга байхгүй байна."
}
```

> 404 Response

```json
{
  "error": "Захиалга олдсонгүй эсвэл таны захиалга биш байна."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Захиалга цуцлагдлаа|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Цуцлах боломжгүй|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй эсвэл хугацаа дууссан|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Захиалга олдсонгүй|Inline|

### Responses Data Schema

## POST Хэрэглэгчийн эрх цуцлах

POST /customers/deactivate/

Идэвхтэй захиалга байвал цуцлах боломжгүй.

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "message": "Таны эрх амжилттай цуцлагдлаа."
}
```

> 400 Response

```json
{
  "error": "Идэвхтэй захиалга байгаа тул эрхээ цуцлах боломжгүй.",
  "active_bookings_count": 1,
  "active_bookings": [
    {
      "id": 5,
      "hotel": "Байгаль Ресорт",
      "check_in": "2026-04-10",
      "check_out": "2026-04-12",
      "status": "confirmed"
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Эрх цуцлагдлаа|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Идэвхтэй захиалга байгаа тул цуцлах боломжгүй|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй эсвэл хугацаа дууссан|None|

### Responses Data Schema

# Хэрэглэгч/Coupon

## GET Хэрэглэгчийн coupon жагсаалт

GET /api/customers/coupons/

Идэвхтэй coupon-уудыг харуулна. Token шаардлагатай.

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "count": 2,
  "coupons": [
    {
      "id": 1,
      "code": "SAVE10",
      "discount_percentage": 10,
      "is_active": true
    },
    {
      "id": 2,
      "code": "HOTEL20",
      "discount_percentage": 20,
      "is_active": true
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Coupon жагсаалт|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй эсвэл хугацаа дууссан|None|

### Responses Data Schema

# Хэрэглэгч/Үнэлгээ

## GET Өөрийн үнэлгээнүүд харах

GET /api/customers/reviews/

Нэвтэрсэн хэрэглэгчийн өгсөн үнэлгээнүүдийг буцаана.

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "count": 1,
  "reviews": [
    {
      "id": 1,
      "hotel": 1,
      "booking": 5,
      "rating": 5,
      "comment": "Маш сайн буудал байлаа!",
      "created_at": "2026-03-20T10:00:00Z"
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Үнэлгээний жагсаалт|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй эсвэл хугацаа дууссан|None|

### Responses Data Schema

## POST Үнэлгээ өгөх

POST /api/customers/reviews/

Захиалга биелсний дараа буудалд үнэлгээ өгнө. Нэг захиалганд нэг л үнэлгээ өгөх боломжтой.

> Body Parameters

```json
{
  "hotel": 141,
  "booking": 171,
  "rating": 4,
  "comment": "Маш сайн буудал байлаа!s"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| yes |none|
|body|body|[CreateReviewRequest](#schemacreatereviewrequest)| yes |none|

> Response Examples

> 201 Response

```json
{
  "message": "Үнэлгээ амжилттай илгээгдлээ.",
  "review": {
    "id": 1,
    "hotel": 1,
    "booking": 5,
    "rating": 5,
    "comment": "Маш сайн буудал байлаа!",
    "created_at": "2026-03-20T10:00:00Z"
  }
}
```

> Алдаа

```json
{
  "booking": [
    "Энэ захиалга таны биш байна."
  ]
}
```

```json
{
  "booking": [
    "Энэ захиалгад аль хэдийн үнэлгээ өгсөн байна."
  ]
}
```

```json
{
  "rating": [
    "Үнэлгээ 1-5 хооронд байх ёстой."
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Үнэлгээ амжилттай илгээгдлээ|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Алдаа|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй эсвэл хугацаа дууссан|None|

### Responses Data Schema

# Хэрэглэгч/Баталгаажуулах

## POST Имэйл OTP илгээх

POST /api/customers/verify/email/send/

Хэрэглэгчийн бүртгэлтэй имэйл рүү OTP код илгээнэ. OTP 10 минут хүчинтэй.

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "message": "OTP код bold@gmail.com хаяг руу илгээгдлээ.",
  "expires_in_seconds": 600,
  "otp_code": "123456"
}
```

> Алдаа

```json
{
  "error": "Имэйл хаяг бүртгэлтэй байхгүй байна."
}
```

```json
{
  "error": "Имэйл аль хэдийн баталгаажсан байна."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OTP илгээгдлээ|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Алдаа|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй эсвэл хугацаа дууссан|None|

### Responses Data Schema

## POST Имэйл OTP баталгаажуулах

POST /api/customers/verify/email/

Имэйлд ирсэн OTP кодыг оруулж баталгаажуулна.

> Body Parameters

```json
{
  "email": "bold@gmail.com",
  "otp_code": "861755"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|token|query|string| yes |none|
|body|body|[VerifyEmailRequest](#schemaverifyemailrequest)| yes |none|

> Response Examples

> 200 Response

```json
{
  "message": "Имэйл амжилттай баталгаажлаа."
}
```

> OTP буруу эсвэл хугацаа дууссан

```json
{
  "error": "Имэйл хаяг таарахгүй байна."
}
```

```json
{
  "error": "OTP код буруу эсвэл хугацаа дууссан байна."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Имэйл баталгаажлаа|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|OTP буруу эсвэл хугацаа дууссан|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Token хүчингүй эсвэл хугацаа дууссан|None|

### Responses Data Schema

## POST OTP баталгаажуулах / нэвтрэх

POST /api/customers/otp/verify/

OTP код зөв бол хэрэглэгчийг нэвтрүүлж token буцаана.

> Body Parameters

```json
{
  "phone": "99001122",
  "otp_code": "882665"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|[VerifyOTPRequest](#schemaverifyotprequest)| yes |none|

> Response Examples

> 200 Response

```json
{
  "message": "Амжилттай нэвтэрлээ.",
  "token": "a1b2c3d4e5f6...",
  "customer": {
    "id": 1,
    "first_name": "Болд",
    "last_name": "Баатар",
    "email": null,
    "phone": "99001122",
    "is_verified": true
  }
}
```

> OTP буруу эсвэл хугацаа дууссан

```json
{
  "error": "OTP код буруу байна."
}
```

```json
{
  "error": "OTP код хугацаа дууссан байна. Дахин авна уу."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Амжилттай нэвтэрлээ|[AuthResponse](#schemaauthresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|OTP буруу эсвэл хугацаа дууссан|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|false|none||none|
|» token|string|false|none||none|
|» customer|[CustomerShort](#schemacustomershort)|false|none||none|
|»» id|integer|false|none||none|
|»» first_name|string|false|none||none|
|»» last_name|string|false|none||none|
|»» email|string|false|none||none|
|»» phone|string|false|none||none|
|»» is_verified|boolean|false|none||none|

## POST OTP илгээх

POST /api/customers/otp/send/

Утасны дугаарт 6 оронтой OTP код илгээнэ. Хэрэглэгч байхгүй бол автоматаар үүсгэнэ. OTP 5 минут хүчинтэй.

> Body Parameters

```json
{
  "phone": "99001122",
  "first_name": "Болд",
  "last_name": "Баатар"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|[SendOTPRequest](#schemasendotprequest)| yes |none|

> Response Examples

> 200 Response

```json
{
  "message": "OTP код 99001122 дугаарт илгээгдлээ.",
  "expires_in_seconds": 300,
  "is_new_customer": true,
  "otp_code": "123456"
}
```

> 400 Response

```json
{
  "phone": [
    "Утасны дугаар буруу форматтай байна."
  ]
}
```

> 403 Response

```json
{
  "error": "Энэ дугаар блоклогдсон байна."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OTP амжилттай илгээгдлээ|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Утасны дугаар буруу|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|Дугаар блоклогдсон|Inline|

### Responses Data Schema

# Data Schema

<h2 id="tocS_CustomerRegisterRequest">CustomerRegisterRequest</h2>

<a id="schemacustomerregisterrequest"></a>
<a id="schema_CustomerRegisterRequest"></a>
<a id="tocScustomerregisterrequest"></a>
<a id="tocscustomerregisterrequest"></a>

```json
{
  "first_name": "Болд",
  "last_name": "Баатар",
  "email": "bold@gmail.com",
  "phone": "99001122",
  "gender": "male",
  "date_of_birth": "1995-05-20",
  "password": "pass1234",
  "confirm_password": "pass1234"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|first_name|string|true|none||none|
|last_name|string|true|none||none|
|email|string(email)|true|none||none|
|phone|string|false|none||none|
|gender|string|false|none||none|
|date_of_birth|string(date)|false|none||none|
|password|string(password)|true|none||none|
|confirm_password|string(password)|true|none||none|

#### Enum

|Name|Value|
|---|---|
|gender|male|
|gender|female|
|gender|other|

<h2 id="tocS_CreateBookingRequest">CreateBookingRequest</h2>

<a id="schemacreatebookingrequest"></a>
<a id="schema_CreateBookingRequest"></a>
<a id="tocScreatebookingrequest"></a>
<a id="tocscreatebookingrequest"></a>

```json
{
  "hotel_id": 1,
  "check_in": "2026-04-10",
  "check_out": "2026-04-12",
  "customer_name": "Болд Баатар",
  "customer_phone": "99001122",
  "customer_email": "bold@gmail.com",
  "rooms": [
    {
      "room_type_id": 1,
      "room_category_id": 2,
      "room_count": 1
    }
  ],
  "coupon_code": "SAVE10"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|hotel_id|integer|true|none||none|
|check_in|string(date)|true|none||none|
|check_out|string(date)|true|none||none|
|customer_name|string|false|none||Нэвтрээгүй үед заавал|
|customer_phone|string|false|none||Нэвтрээгүй үед заавал|
|customer_email|string(email)|false|none||none|
|rooms|[[RoomRequest](#schemaroomrequest)]|true|none||none|
|coupon_code|string|false|none||Сонголттой|

<h2 id="tocS_CustomerLoginRequest">CustomerLoginRequest</h2>

<a id="schemacustomerloginrequest"></a>
<a id="schema_CustomerLoginRequest"></a>
<a id="tocScustomerloginrequest"></a>
<a id="tocscustomerloginrequest"></a>

```json
{
  "email": "bold@gmail.com",
  "password": "pass1234"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|email|string(email)|true|none||none|
|password|string(password)|true|none||none|

<h2 id="tocS_RoomRequest">RoomRequest</h2>

<a id="schemaroomrequest"></a>
<a id="schema_RoomRequest"></a>
<a id="tocSroomrequest"></a>
<a id="tocsroomrequest"></a>

```json
{
  "room_type_id": 1,
  "room_category_id": 2,
  "room_count": 1
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|room_type_id|integer|true|none||none|
|room_category_id|integer|true|none||none|
|room_count|integer|false|none||none|

<h2 id="tocS_SendOTPRequest">SendOTPRequest</h2>

<a id="schemasendotprequest"></a>
<a id="schema_SendOTPRequest"></a>
<a id="tocSsendotprequest"></a>
<a id="tocssendotprequest"></a>

```json
{
  "phone": "99001122",
  "first_name": "Болд",
  "last_name": "Баатар"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|phone|string|true|none||none|
|first_name|string|false|none||none|
|last_name|string|false|none||none|

<h2 id="tocS_CancelBookingRequest">CancelBookingRequest</h2>

<a id="schemacancelbookingrequest"></a>
<a id="schema_CancelBookingRequest"></a>
<a id="tocScancelbookingrequest"></a>
<a id="tocscancelbookingrequest"></a>

```json
{
  "booking_code": "1234567890",
  "pin_code": "1234"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|booking_code|string|true|none||none|
|pin_code|string|true|none||none|

<h2 id="tocS_VerifyOTPRequest">VerifyOTPRequest</h2>

<a id="schemaverifyotprequest"></a>
<a id="schema_VerifyOTPRequest"></a>
<a id="tocSverifyotprequest"></a>
<a id="tocsverifyotprequest"></a>

```json
{
  "phone": "99001122",
  "otp_code": "123456"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|phone|string|true|none||none|
|otp_code|string|true|none||none|

<h2 id="tocS_CreateReviewRequest">CreateReviewRequest</h2>

<a id="schemacreatereviewrequest"></a>
<a id="schema_CreateReviewRequest"></a>
<a id="tocScreatereviewrequest"></a>
<a id="tocscreatereviewrequest"></a>

```json
{
  "hotel": 1,
  "booking": 5,
  "rating": 5,
  "comment": "Маш сайн буудал байлаа!"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|hotel|integer|true|none||none|
|booking|integer|false|none||Сонголттой|
|rating|integer|true|none||none|
|comment|string|false|none||none|

<h2 id="tocS_AuthResponse">AuthResponse</h2>

<a id="schemaauthresponse"></a>
<a id="schema_AuthResponse"></a>
<a id="tocSauthresponse"></a>
<a id="tocsauthresponse"></a>

```json
{
  "message": "string",
  "token": "a1b2c3d4e5f67890...",
  "customer": {
    "id": 1,
    "first_name": "Болд",
    "last_name": "Баатар",
    "email": "bold@gmail.com",
    "phone": "99001122",
    "is_verified": false
  }
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|message|string|false|none||none|
|token|string|false|none||none|
|customer|[CustomerShort](#schemacustomershort)|false|none||none|

<h2 id="tocS_VerifyEmailRequest">VerifyEmailRequest</h2>

<a id="schemaverifyemailrequest"></a>
<a id="schema_VerifyEmailRequest"></a>
<a id="tocSverifyemailrequest"></a>
<a id="tocsverifyemailrequest"></a>

```json
{
  "email": "bold@gmail.com",
  "otp_code": "123456"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|email|string(email)|true|none||none|
|otp_code|string|true|none||none|

<h2 id="tocS_ChangePasswordRequest">ChangePasswordRequest</h2>

<a id="schemachangepasswordrequest"></a>
<a id="schema_ChangePasswordRequest"></a>
<a id="tocSchangepasswordrequest"></a>
<a id="tocschangepasswordrequest"></a>

```json
{
  "old_password": "oldpass123",
  "new_password": "newpass456",
  "confirm_password": "newpass456"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|old_password|string(password)|true|none||none|
|new_password|string(password)|true|none||none|
|confirm_password|string(password)|true|none||none|

<h2 id="tocS_CustomerShort">CustomerShort</h2>

<a id="schemacustomershort"></a>
<a id="schema_CustomerShort"></a>
<a id="tocScustomershort"></a>
<a id="tocscustomershort"></a>

```json
{
  "id": 1,
  "first_name": "Болд",
  "last_name": "Баатар",
  "email": "bold@gmail.com",
  "phone": "99001122",
  "is_verified": false
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|false|none||none|
|first_name|string|false|none||none|
|last_name|string|false|none||none|
|email|string|false|none||none|
|phone|string|false|none||none|
|is_verified|boolean|false|none||none|

<h2 id="tocS_CustomerProfile">CustomerProfile</h2>

<a id="schemacustomerprofile"></a>
<a id="schema_CustomerProfile"></a>
<a id="tocScustomerprofile"></a>
<a id="tocscustomerprofile"></a>

```json
{
  "id": 1,
  "first_name": "Болд",
  "last_name": "Баатар",
  "email": "bold@gmail.com",
  "phone": "99001122",
  "gender": "male",
  "date_of_birth": "1995-05-20",
  "is_verified": true,
  "created_at": "2026-03-17T08:00:00Z"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|id|integer|false|none||none|
|first_name|string|false|none||none|
|last_name|string|false|none||none|
|email|string|false|none||none|
|phone|string|false|none||none|
|gender|string|false|none||none|
|date_of_birth|string(date)|false|none||none|
|is_verified|boolean|false|none||none|
|created_at|string(date-time)|false|none||none|

<h2 id="tocS_CustomerProfileUpdate">CustomerProfileUpdate</h2>

<a id="schemacustomerprofileupdate"></a>
<a id="schema_CustomerProfileUpdate"></a>
<a id="tocScustomerprofileupdate"></a>
<a id="tocscustomerprofileupdate"></a>

```json
{
  "first_name": "Болд",
  "last_name": "Баатар",
  "gender": "male",
  "date_of_birth": "1995-05-20"
}

```

### Attribute

|Name|Type|Required|Restrictions|Title|Description|
|---|---|---|---|---|---|
|first_name|string|false|none||none|
|last_name|string|false|none||none|
|gender|string|false|none||none|
|date_of_birth|string(date)|false|none||none|

#### Enum

|Name|Value|
|---|---|
|gender|male|
|gender|female|
|gender|other|

