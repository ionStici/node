# Introduction to Transactions

How transactions work in TypeORM.

## Table of Contents

- [What are Transactions](#what-are-transactions)
  - [Example of a Transaction](#example-of-a-transaction)
  - [Advantages of Transactions](#advantages-of-transactions)
  - [When to Use Transactions](#when-to-use-transactions)
- [Performing Transactions in TypeORM with Query Runner](#performing-transactions-in-typeorm-with-query-runner)
  - [Overview of Query Runner](#overview-of-query-runner)
  - [Steps to Perform a Transaction](#steps-to-perform-a-transaction)
  - [Key Methods](#key-methods)
  - [Transaction Flow Summary](#transaction-flow-summary)
- [Transactions vs. Normal CRUD Operations](#transactions-vs-normal-crud-operations)

## What are Transactions

- A **transaction** is a complete set of CRUD operations performed on a database.
- These operations are interrelated, meaning if one operation fails, the entire transaction is invalid.
- Transactions ensure data consistency and integrity by rolling back changes if any part of the transaction fails.

### Example of a Transaction

_Imagine a money transfer scenario:_

1. Check the balance of User A.
2. Deduct money from User A's account.
3. Credit User B's account.

If any of these steps fail (e.g. money is deducted from User A but not credited to User B), the transaction should roll back, reverting the changes made.

### Advantages of Transactions

1. **Data Integrity:** All related CRUD operations must succeed for the transaction to be considered successful. If one operation fails, the transaction fails.
2. **Rollback:** If a transaction fails, all changes are reverted to the initial state.
3. **Assurance of Completion:** You only get confirmation when every operation in the transaction is successfully completed, ensuring data accuracy.

### When to Use Transactions

- Use transactions when multiple interrelated CRUD operations need to be performed. This could involve one or multiple entities.
- Transactions are useful for ensuring that complex data operations either succeed entirely or fail without leaving partial changes in the database.

## Performing Transactions in TypeORM with Query Runner

### Overview of Query Runner

- In TypeORM, transactions are handled using the **Query Runner** class.
- A **Query Runner** provides a single connection from a pool of database connections to executed a transaction.
- This connection is used for the entire duration of the transaction, ensuring that all operations are executed within the same context.

### Steps to Perform a Transaction

1. **Create an Instance** of the `queryRunner` class.

2. **Establish a connection:** Use the `connect` method on the `queryRunner` instance to connect to the database.

3. **Start the Transaction:** Use the `startTransaction` method to begin the transaction. All CRUD operation that are part of this transaction are executed afterward.

4. **Perform CRUD Operations:** Add the necessary CRUD operations within the transaction scope. These are the operations you want to execute within the transaction.

5. **Commit or Rollback** Use a`try...catch` block:

   - **Commit the Transaction:** If the operations are successful, use the `commitTransaction` method to finalize the transaction.
   - **Rollback the Transaction:** If any operation fails, handle the error in the `catch` block and use the `rollbackTransaction` method to undo all changes made during the transaction.

6. **Release the Connection:**

   - After the transaction is either committed or rolled back, use the `release` method to close and release the connection from the pool.

### Key Methods

- `connect` : Establishes a connection with the database.
- `startTransaction` : Begins the transaction process.
- `commitTransaction` : Finalizes the transaction when all operations are successful.
- `rollbackTransaction` : Reverts all operations if an error occurs.
- `release` : Releases the connection back to the connection pool.

### Transaction Flow Summary

1. Establish connection.
2. Start transaction.
3. Perform CRUD operations.
4. Commit transaction if successful, or rollback if failed.
5. Release the connection.

This process ensures that all operations within a transaction either succeed together or fail together, maintaining data integrity.

## Transactions vs. Normal CRUD Operations

_When to Use Transactions vs. Normal CRUD Operations in TypeORM._

- **Transactions** ensure proper **commit and rollback** mechanisms, but they are not needed for every operation.
- In **simple CRUD operations**, where there's only one database interaction, using transactions can be overkill.

<div></div>

- **Use transactions** only when you have multiple related database operations that must either succeed or fail as a whole.
- **Avoid using transactions** for single CRUD operations or simple database inserts, as they add unnecessary complexity and overhead.
