import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphql } from "graphql";
import { renderers } from "../../renderers.mjs";
function compressResponse(data, acceptEncoding) {
  const jsonString = JSON.stringify(data);
  if (acceptEncoding?.includes("br")) {
    return new Response(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Encoding": "br",
        "Vary": "Accept-Encoding"
      }
    });
  } else if (acceptEncoding?.includes("gzip")) {
    return new Response(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Encoding": "gzip",
        "Vary": "Accept-Encoding"
      }
    });
  }
  return new Response(jsonString, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Vary": "Accept-Encoding"
    }
  });
}
const users = [
  { id: 1, email: "admin@getnexo.com", name: "Admin", role: "admin" },
  { id: 2, email: "user@getnexo.com", name: "User", role: "user" }
];
const products = [
  { id: 1, name: "Produto 1", price: 99.99, stock: 100 },
  { id: 2, name: "Produto 2", price: 149.99, stock: 50 }
];
const orders = [
  { id: 1, userId: 1, products: [{ id: 1, quantity: 2 }], total: 199.98, status: "pending" }
];
const typeDefs = `
    type User {
        id: ID!
        email: String!
        name: String!
        role: String!
    }

    type Product {
        id: ID!
        name: String!
        price: Float!
        stock: Int!
    }

    type OrderItem {
        id: ID!
        quantity: Int!
    }

    type Order {
        id: ID!
        userId: ID!
        products: [OrderItem!]!
        total: Float!
        status: String!
        user: User
    }

    type Query {
        users: [User!]!
        user(id: ID!): User
        products: [Product!]!
        product(id: ID!): Product
        orders: [Order!]!
        order(id: ID!): Order
    }

    type Mutation {
        createUser(email: String!, name: String!, role: String): User!
        createProduct(name: String!, price: Float!, stock: Int!): Product!
        createOrder(userId: ID!, productIds: [ID!]!, quantities: [Int!]!): Order!
    }
`;
const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find((u) => u.id == id),
    products: () => products,
    product: (_, { id }) => products.find((p) => p.id == id),
    orders: () => orders,
    order: (_, { id }) => orders.find((o) => o.id == id)
  },
  Order: {
    user: (order) => users.find((u) => u.id == order.userId)
  },
  Mutation: {
    createUser: (_, { email, name, role }) => {
      const newUser = { id: users.length + 1, email, name, role: role || "user" };
      users.push(newUser);
      return newUser;
    },
    createProduct: (_, { name, price, stock }) => {
      const newProduct = { id: products.length + 1, name, price, stock };
      products.push(newProduct);
      return newProduct;
    },
    createOrder: (_, { userId, productIds, quantities }) => {
      const orderProducts = productIds.map((id, index) => ({
        id: parseInt(id),
        quantity: quantities[index]
      }));
      const total = orderProducts.reduce((sum, item) => {
        const product = products.find((p) => p.id == item.id);
        return sum + product.price * item.quantity;
      }, 0);
      const newOrder = {
        id: orders.length + 1,
        userId: parseInt(userId),
        products: orderProducts,
        total,
        status: "pending"
      };
      orders.push(newOrder);
      return newOrder;
    }
  }
};
const schema = makeExecutableSchema({ typeDefs, resolvers });
const POST = async ({ request }) => {
  const { query, variables } = await request.json();
  const result = await graphql({
    schema,
    source: query,
    variableValues: variables
  });
  const acceptEncoding = request.headers.get("accept-encoding");
  return compressResponse(result, acceptEncoding);
};
const GET = async ({ request }) => {
  const acceptEncoding = request.headers.get("accept-encoding");
  return compressResponse({ message: "GraphQL endpoint - use POST" }, acceptEncoding);
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
