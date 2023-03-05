const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("./todo.proto", {});
const g = grpc.loadPackageDefinition(packageDef);
const todoPackage = g.todo;

const client = new todoPackage.Todo(
  "localhost:5000",
  grpc.credentials.createInsecure()
);
client.createTodo(
  {
    text: "I am todo"
  },
  (err, resp) => {
    console.log(resp);
  }
);

client.readTodos({}, (err, resp) => {
  console.log(resp);
});

const call = client.readTodosStream();
call.on("data", (item) => {
  console.log(item);
});
call.on("end", () => {
  console.log("Done");
});
