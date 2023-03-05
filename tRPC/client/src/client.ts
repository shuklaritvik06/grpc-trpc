import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  loggerLink,
  splitLink,
  wsLink
} from "@trpc/client";
import { AppRouter } from "../../server/api";
const client = createTRPCProxyClient<AppRouter>({
  links: [
    // loggerLink(),
    splitLink({
      condition: (op) => {
        return op.type === "subscription";
      },
      true: wsLink({
        client: createWSClient({
          url: "ws://localhost:3000/trpc"
        })
      }),
      false: httpBatchLink({
        url: "http://localhost:3000/trpc",
        headers: {
          Authorization: "Token"
        }
      })
    })
  ]
});

document.addEventListener("click", () => {
  client.addData.mutate({
    name: "Hello",
    email: "rds@gmail.com"
  });
});
async function main() {
  //   const result = await client.greet.query("Ramesh");
  //   const secret = await client.secretData.query();
  //   const user = await client.users.getUser.query();
  //   console.log(result);
  //   console.log(mut);
  //   console.log(user);
  //   console.log(secret);
  const connection = client.onaddData.subscribe(undefined, {
    onData: (email) => {
      console.log("Added" + email);
    }
  });
  //   connection.unsubscribe();
}

main();
