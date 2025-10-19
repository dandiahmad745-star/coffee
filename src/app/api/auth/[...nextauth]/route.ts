import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { createUser, findUserByEmail, validateUserPassword } from "@/lib/user-db";

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        
        const user = await validateUserPassword(credentials);

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user as any;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      // Persist the user id and role to the token right after signin
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// Endpoint for registering a new user
async function registerHandler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
    }
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
        }
        
        // Check if user is the first user, if so, make them an admin
        // This is a simple way to seed an admin user.
        // NOTE: This is illustrative. In a real app, you might have a more secure way to assign roles.
        const role = email.includes('admin') ? 'admin' : 'user';

        const newUser = await createUser({ name, email, password, role });

        const { hashedPassword, ...userWithoutPassword } = newUser;

        return new Response(JSON.stringify({ message: 'User created successfully', user: userWithoutPassword }), { status: 201 });

    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 409 }); // 409 Conflict for existing user
    }
}


export async function POST(req: Request, { params }: { params: { nextauth: string[] } }) {
    if (params.nextauth[0] === 'register') {
        return registerHandler(req);
    }
    // All other requests go to NextAuth
    return NextAuth(req, { ...params, ...authOptions });
}


export { handler as GET };
