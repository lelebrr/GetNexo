import type { APIRoute } from 'astro';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql } from 'graphql';

// Função para compressão de resposta
function compressResponse(data: any, acceptEncoding: string | null): Response {
    const jsonString = JSON.stringify(data);

    // Verificar se cliente suporta compressão
    if (acceptEncoding?.includes('br')) {
        // Brotli compression (simulado - em produção usar zlib)
        return new Response(jsonString, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Encoding': 'br',
                'Vary': 'Accept-Encoding'
            }
        });
    } else if (acceptEncoding?.includes('gzip')) {
        // Gzip compression (simulado - em produção usar zlib)
        return new Response(jsonString, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip',
                'Vary': 'Accept-Encoding'
            }
        });
    }

    // Sem compressão
    return new Response(jsonString, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Vary': 'Accept-Encoding'
        }
    });
}

// Mock data
const users = [
    { id: 1, email: 'admin@getnexo.com', name: 'Admin', role: 'admin' },
    { id: 2, email: 'user@getnexo.com', name: 'User', role: 'user' },
];

const products = [
    { id: 1, name: 'Produto 1', price: 99.99, stock: 100 },
    { id: 2, name: 'Produto 2', price: 149.99, stock: 50 },
];

const orders = [
    { id: 1, userId: 1, products: [{ id: 1, quantity: 2 }], total: 199.98, status: 'pending' },
];

// GraphQL Schema
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

// Resolvers
const resolvers = {
    Query: {
        users: () => users,
        user: (_: any, { id }: { id: string }) => users.find((u: any) => u.id == id),
        products: () => products,
        product: (_: any, { id }: { id: string }) => products.find((p: any) => p.id == id),
        orders: () => orders,
        order: (_: any, { id }: { id: string }) => orders.find((o: any) => o.id == id),
    },
    Order: {
        user: (order: any) => users.find((u: any) => u.id == order.userId),
    },
    Mutation: {
        createUser: (_: any, { email, name, role }: { email: string; name: string; role?: string }) => {
            const newUser = { id: users.length + 1, email, name, role: role || 'user' };
            users.push(newUser);
            return newUser;
        },
        createProduct: (_: any, { name, price, stock }: { name: string; price: number; stock: number }) => {
            const newProduct = { id: products.length + 1, name, price, stock };
            products.push(newProduct);
            return newProduct;
        },
        createOrder: (_: any, { userId, productIds, quantities }: { userId: string; productIds: string[]; quantities: number[] }) => {
            const orderProducts = productIds.map((id: string, index: number) => ({
                id: parseInt(id),
                quantity: quantities[index]
            }));
            const total = orderProducts.reduce((sum: number, item: any) => {
                const product = products.find((p: any) => p.id == item.id);
                return sum + (product!.price * item.quantity);
            }, 0);
            const newOrder = {
                id: orders.length + 1,
                userId: parseInt(userId),
                products: orderProducts,
                total,
                status: 'pending'
            };
            orders.push(newOrder);
            return newOrder;
        },
    },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

export const POST: APIRoute = async ({ request }) => {
    const { query, variables } = await request.json();

    const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
    });

    const acceptEncoding = request.headers.get('accept-encoding');
    return compressResponse(result, acceptEncoding);
};

export const GET: APIRoute = async ({ request }) => {
    const acceptEncoding = request.headers.get('accept-encoding');
    return compressResponse({ message: 'GraphQL endpoint - use POST' }, acceptEncoding);
};