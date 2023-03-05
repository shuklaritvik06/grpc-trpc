import { randomUUID } from "crypto";
import { z } from "zod";

enum Cars {
  Ramesh = "Ramesh",
  Suresh = "Suresh"
}

const UserSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    username: z.string().min(1).max(10),
    age: z.number().default(18),
    birthday: z.date(),
    isProgrammer: z.boolean().optional().nullable(),
    undef: z.undefined(),
    isDriver: z.literal(true).optional(),
    hobbies: z.string().array(),
    relative: z.enum(["Ramesh", "Suresh"] as const),
    cars: z.nativeEnum(Cars).optional(),
    tup: z.tuple([z.string()]).rest(z.number())
  })
  .passthrough();

type User = z.infer<typeof UserSchema>;

const user_data: User = {
  id: "1",
  username: "Ramesh",
  age: 12,
  birthday: new Date(),
  isProgrammer: true,
  hobbies: ["Hello"],
  relative: "Ramesh",
  cars: Cars.Ramesh,
  hello: "Rakesh",
  tup: ["", 1, 2, 3, 4]
};

console.log(UserSchema.parse(user_data));
console.log(UserSchema.shape.age);
console.log(UserSchema.partial().parse(user_data));

//   Schema.partial()
//   .pick({
//     username: true,
//     age: true,
//     cars: true
//   })
//   .omit({
//     cars: true
//   });

// Discriminated Union
const employeeSchema = z
  .object({
    id: z.discriminatedUnion("status", [
      z.object({
        status: z.literal("success"),
        data: z.string()
      }),
      z.object({
        status: z.literal("error"),
        error: z.instanceof(Error)
      })
    ])
  })
  .strict();

type Employee = z.infer<typeof employeeSchema>;
// const employee: Employee = {
//   id: {
//     status: "error",
//     error: new Error("Hi I am error!")
//   }
// };
// console.log(employeeSchema.safeParse(employee));

// Record

const KeyVal = z.record(z.string(), z.number());
const recordVal = {
  Hello: 1
};
console.log(KeyVal.parse(recordVal));

// Map

const friends = new Map([
  [
    "Hello",
    {
      name: "Rakesh"
    }
  ],
  [
    "Hey",
    {
      name: "Ramesh"
    }
  ]
]);
const friendSchema = z.map(
  z.string(),
  z.object({
    name: z.string()
  })
);

console.log(friendSchema.parse(friends));

// Set

const setSchema = z.set(z.number());
console.log(setSchema.parse(new Set([1, 2, 4])));

// Promise

const promiseSchema = z.promise(z.number());
const promise = new Promise((resolve, reject) => {
  resolve(2);
});
console.log(promiseSchema.parse(promise));

// Email and Refining!

const emaill = z.string().refine((val) => val.endsWith("@gmail.com"), {
  message: "Email must end with gmail.com"
});
console.log(emaill.parse("ritvik@gmail.com"));
console.log(z.string().email("Not a email").parse("ritvik@g.com"));
console.log(z.string().ip().parse("102.12.12.12"));
console.log(z.string().emoji("Not a emoji!").parse("🎉"));
console.log(z.string().uuid().parse(randomUUID()));
console.log(z.string().url().parse("https://www.github.com"));
console.log(z.string().trim().parse("Hello     "));
const Strings = z.array(z.string()).superRefine((val, ctx) => {
  if (val.length > 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 3,
      type: "array",
      inclusive: true,
      message: "Too many items"
    });
  }

  if (val.length !== new Set(val).size) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `No duplicates allowed.`
    });
  }
});

console.log(Strings.parse(["R", "A", "K", "J"]));
