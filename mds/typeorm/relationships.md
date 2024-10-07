# Types of Relationships

_Relationships in Relational Databases._

### One-to-One (1:1)

- Definition: Each record in Entity "A" corresponds to exactly one record in Entity "B", and vice versa.
- Example: A `User` has one `Profile`, and a `Profile` belongs to one `User`.

### One-to-Many (1:N) and Many-to-One (N:1)

- One-to-Many: A single record in Entity "A" is related to multiple records in Entity "B".
- Many-to-One: Multiple records in Entity "A" relate to a single record in Entity "B".
- Example: Multiple `Posts` has one `Author` (Many-to-One), and an `Author` can have many `Posts` (One-to-Many).

### Many-to-Many (M)

- Definition: Records in Entity "A" can relate to many records in Entity "B", and vice versa.
- Example: A `Student` can enroll in many `Courses`, and a `Course` can have many `Students`.

### Unidirectional vs. Bidirectional Relationships

- **Unidirectional:** Only one side of the relationship has a reference to the other.
- **Bidirectional:** Both entities reference each other.
- **Implication:** Bidirectional relationships require additional configuration but allow navigation from both entities.

TypeORM provides decorators to define relationships between entities.
