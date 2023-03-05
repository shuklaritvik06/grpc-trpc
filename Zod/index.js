"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const zod_1 = require("zod");
var Cars;
(function (Cars) {
    Cars["Ramesh"] = "Ramesh";
    Cars["Suresh"] = "Suresh";
})(Cars || (Cars = {}));
const UserSchema = zod_1.z
    .object({
    id: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]),
    username: zod_1.z.string().min(1).max(10),
    age: zod_1.z.number().default(18),
    birthday: zod_1.z.date(),
    isProgrammer: zod_1.z.boolean().optional().nullable(),
    undef: zod_1.z.undefined(),
    isDriver: zod_1.z.literal(true).optional(),
    hobbies: zod_1.z.string().array(),
    relative: zod_1.z.enum(["Ramesh", "Suresh"]),
    cars: zod_1.z.nativeEnum(Cars).optional(),
    tup: zod_1.z.tuple([zod_1.z.string()]).rest(zod_1.z.number())
})
    .passthrough();
const user_data = {
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
const employeeSchema = zod_1.z
    .object({
    id: zod_1.z.discriminatedUnion("status", [
        zod_1.z.object({
            status: zod_1.z.literal("success"),
            data: zod_1.z.string()
        }),
        zod_1.z.object({
            status: zod_1.z.literal("error"),
            error: zod_1.z.instanceof(Error)
        })
    ])
})
    .strict();
// const employee: Employee = {
//   id: {
//     status: "error",
//     error: new Error("Hi I am error!")
//   }
// };
// console.log(employeeSchema.safeParse(employee));
// Record
const KeyVal = zod_1.z.record(zod_1.z.string(), zod_1.z.number());
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
const friendSchema = zod_1.z.map(zod_1.z.string(), zod_1.z.object({
    name: zod_1.z.string()
}));
console.log(friendSchema.parse(friends));
// Set
const setSchema = zod_1.z.set(zod_1.z.number());
console.log(setSchema.parse(new Set([1, 2, 4])));
// Promise
const promiseSchema = zod_1.z.promise(zod_1.z.number());
const promise = new Promise((resolve, reject) => {
    resolve(2);
});
console.log(promiseSchema.parse(promise));
// Email and Refining!
const emaill = zod_1.z.string().refine((val) => val.endsWith("@gmail.com"), {
    message: "Email must end with gmail.com"
});
console.log(emaill.parse("ritvik@gmail.com"));
console.log(zod_1.z.string().email("Not a email").parse("ritvik@g.com"));
console.log(zod_1.z.string().ip().parse("102.12.12.12"));
console.log(zod_1.z.string().emoji("Not a emoji!").parse("🎉"));
console.log(zod_1.z.string().uuid().parse((0, crypto_1.randomUUID)()));
console.log(zod_1.z.string().url().parse("https://www.github.com"));
console.log(zod_1.z.string().trim().parse("Hello     "));
const Strings = zod_1.z.array(zod_1.z.string()).superRefine((val, ctx) => {
    if (val.length > 3) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.too_big,
            maximum: 3,
            type: "array",
            inclusive: true,
            message: "Too many items"
        });
    }
    if (val.length !== new Set(val).size) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: `No duplicates allowed.`
        });
    }
});
console.log(Strings.parse(["R", "A", "K", "J"]));
