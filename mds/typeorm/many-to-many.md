# Many-to-Many (M)

## Definition

**Many-to-Many (M):** Records in entity A are related to many records in entity B, and vice versa. `Students` can enroll in many `Courses`, and each `Course` can have many `Students`.

## Creating the Relationship

```ts
// student.entity.ts
import { Entity, ManyToMany, JoinTable } from "typeorm";
import { Course } from "./course.entity";

export class Student {
  @JoinTable()
  @ManyToMany(() => Course, (course) => course.students)
  course: Course[];
}
```

```ts
// course.entity.ts
import { Entity, ManyToMany, JoinTable } from "typeorm";
import { Student } from "./student.entity";

export class Course {
  @ManyToMany(() => Student, (student) => student.courses)
  students: Student[];
}
```

**`@ManyToMany()` Decorator:** Defines a many-to-many relationship between two entities, where each entity can have multiple related instances of the other.

**`@JoinTable()` Decorator:** Used on one side of the relationship to designate the owning side. Instructs TypeORM to create a **junction table** to manage relationships.

**Junction Table:** TypeORM automatically creates a junction table containing foreign keys from both entities.
