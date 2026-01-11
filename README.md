## API Endpoints

### Auth
POST /api/auth/register  
POST /api/auth/login  

### Users (JWT Protected)
GET /api/users  
GET /api/users/:id  
POST /api/users  
PUT /api/users/:id  
DELETE /api/users/:id  

### Referrals (JWT Protected)
GET /api/referrals/my-code  
GET /api/referrals/downline  
GET /api/referrals/stats  

### Auth Header
Authorization: Bearer <JWT_TOKEN>
