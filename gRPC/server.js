const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("./todo.proto", {});
const g = grpc.loadPackageDefinition(packageDef);
const todoPackage = g.todo;

const server = new grpc.Server();
server.bind("0.0.0.0:5000", grpc.ServerCredentials.createInsecure());
server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
  readTodosStream: readTodosStream
});
server.start();

const Todos = [];
function createTodo(call, callback) {
  const item = {
    id: Todos.length + 1,
    text: call.request.text
  };
  Todos.push(item);
  callback(null, item);
}
function readTodos(call, callback) {
  callback(null, {
    items: Todos
  });
}
function readTodosStream(call, callback) {
  Todos.forEach((t) => call.write(t));
  call.end();
}
