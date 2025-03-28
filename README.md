## Follow below instructions to run the project locally;

### Backend -

- Ensure you have `Node.js version >=20` installed.
- `cd` into the `backend/web` folder, and run `npm install`.
- Create a `.env` file inside the same directory, with two variables:
  - `MONGO_URI` - Your mongodb connection string
  - `PORT` - The port on which the api will run.
- Finally, run `npm start` to fire-up the api server.
- If everything is set correctly, you should see `wallet-system-api listening on port <PORT>`.

### Frontend -

- Ensure you have `Node.js version >=20` installed.
- `cd` into the `frontend` folder, and run `npm install`.
- Create a `.env` file inside the same directory, with one variable:
  - `VITE_APP_API_URL` - The url of the api, for e.g, `http://localhost:9000/api`.
- Finally, run `npm run dev` to fire-up the frontend.

## 🚀 API Endpoints

### 📌 1. Create Wallet

- **URL**: `/api/setup`
- **Method**: POST
- **Description**: Creates a new wallet with initial balance, or returns an existing wallet's details.
- **Request body**:

```
{
  "name": "John Doe",
  "balance": 1000
}
```

#### **Success Responses:**

- New wallet

```
{
  "_id": "67e6c9593a800b0400dacd11",
  "name": "bishesh",
  "balance": 100,
  "date": "2025-03-28T16:07:53.671Z"
}
```

- Wallet found with the name:

```
{
  "message": "Wallet already exists with this username",
  "data": {
    "_id": "67e6c9593a800b0400dacd11",
    "name": "bishesh",
    "balance": 100,
    "date": "2025-03-28T16:07:53.671Z",
    "__v": 0
  }
}
```

#### **Error Responses:**

- No Name provided.

```
{ message: "Name is required" }
```

- Invalid balance value

```
{ message: "Invalid balance value" }
```

### 📌 2. Get Wallet by ID

- **URL**: `/api/wallet/:walletId`
- **Method**: GET
- **Description**: Fetches a wallet by its ID.
- **Sample Request:**

```
GET /api/wallet/65e8765a9c6d5c00123b4f56
```

#### ✅ Success Response

```
{
  "message": "Wallet found",
  "data": {
    "_id": "67e6c9593a800b0400dacd11",
    "balance": 100,
    "name": "bishesh",
    "date": "2025-03-28T16:07:53.671Z"
  }
}
```

#### ⚠️ Error Responses

- No wallet found

```
{ message: "Wallet not found" }
```

- Invalid wallet ID

```
{ message: "Invalid wallet id" }
```

### 📌 3. Transact (Deposit/Withdraw)

- **URL**: `/api/transact/:walletId`
- **Method**: POST
- **Description**: Allows depositing or withdrawing funds from a wallet.

  - Deposit: Positive amount → increases the balance.

  - Withdraw: Negative amount → decreases the balance.

#### Request Parameters-

##### Path Parameter:

- walletId → String → The ID of the wallet to be transacted.

##### Body Parameters:

- amount → Number → The transaction amount.

  - Positive → Deposit

  - Negative → Withdraw

- description → String (Optional) → Details about the transaction.

#### Sample Requests

##### ✅ Deposit Request

```
POST /api/wallet/65e8765a9c6d5c00123b4f56/transact
```

```
{
  "amount": 500,
  "description": "Salary deposit"
}
```

##### ✅ Withdraw Request

```
POST /api/wallet/65e8765a9c6d5c00123b4f56/transact
```

```
{
  "amount": -200,
  "description": "Grocery expenses"
}
```

#### ✅ Success Response

```
{
  "message": "Transaction successful",
  "data": {
    "balance": 1300.75,
    "transactionId": "65e8888a9c6d5c00123b4f99"
  }
}
```

#### ⚠️ Error Responses

- Invalid Wallet ID

```
{
  "message": "Invalid wallet id"
}
```

- Invalid Amount

```
{
  "message": "Invalid amount"
}
```

- Wallet Not Found

```
{
  "message": "Wallet not found"
}
```

- Insufficient Funds

```
{
  "message": "Insufficient funds"
}
```

### 📌 4. Find Wallet Transactions

- **URL**: `/api/transactions`
- **Method**: GET
- **Description**: Fetches paginated transactions for a specific wallet ID.

  - Supports `skip` and `limit` parameters for pagination.

#### Request Parameters

##### Query Parameters:

- walletId → String → (Required) The ID of the wallet whose transactions you want to retrieve.

- skip → Number → (Optional) Number of transactions to skip.

- limit → Number → (Optional) Maximum number of transactions to return.

#### Sample Requests

##### ✅ Get Transactions with Default Pagination

```
GET /api/wallet/transactions?walletId=65e8765a9c6d5c00123b4f56
```

##### ✅ Get Transactions with Pagination

```
GET /api/wallet/transactions?walletId=65e8765a9c6d5c00123b4f56&skip=10&limit=5
```

#### Success Response

```
{
  "message": "Transactions fetched",
  "data": [
    {
      "_id": "65e8899a9c6d5c00123b4f33",
      "walletId": "65e8765a9c6d5c00123b4f56",
      "amount": 200,
      "description": "Payment received",
      "type": "CREDIT",
      "balance": 1200.50,
      "createdAt": "2025-03-28T14:45:12.789Z"
    },
    {
      "_id": "65e8899a9c6d5c00123b4f34",
      "walletId": "65e8765a9c6d5c00123b4f56",
      "amount": -50,
      "description": "Coffee purchase",
      "type": "DEBIT",
      "balance": 1150.50,
      "createdAt": "2025-03-28T15:10:32.789Z"
    }
  ]
}
```

#### ⚠️ Error Responses

- Missing Wallet ID

```
{
  "message": "Invalid wallet id"
}
```

- Invalid Wallet ID Format

```
{
  "message": "Invalid wallet ID format"
}
```

- Wallet Not Found

```
{
  "message": "Wallet not found"
}
```

- Invalid Skip Value

```
{
  "message": "Invalid skip value"
}
```

- Invalid Limit Value

```
{
  "message": "Invalid limit value"
}
```

### Database Design

#### Collections

1. **Wallet**

   - Stores wallet details and balance.
   - Schema

   ```
   {

     "name": "String", (required and unique)
     "balance": "Number", (default 0)
     "date": "Date" (default Date.now)
   }
   ```

2. **Transaction**
   - Stores individual wallet transactions.
   - Includes references to the wallet and maintains balance history.
   - Schema
   ```
   {
     "walletId": "ObjectId", (required and indexed)
     "amount": "Number", (required)
     "description": "String",
     "type": "String", // CREDIT or DEBIT
     "balance": "Number", (required)
     "date": "Date" (default Date.now)
   }
   ```

### Query Design

1. **Transactions with Atomic Consistency**

   - MongoDB Sessions & Transactions:
   - Ensures atomic updates when modifying wallet balance and creating a transaction.
   - Prevents race conditions during concurrent operations by using `session.startTransaction()` and `session.commitTransaction()`.

2. **Efficient Pagination for Transactions**
   - Uses `.skip()` and `.limit()` for paginated retrieval.
   - Ensures efficient querying without overloading the database.
