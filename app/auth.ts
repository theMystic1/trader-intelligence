// // auth.ts  (project root, next to package.json)
// import NextAuth from "next-auth";

// import Google from "next-auth/providers/google";
// import GitHub from "next-auth/providers/github";
// import Credentials from "next-auth/providers/credentials";
// import User from "@/server/models/user.schema";
// import { dbConnect } from "@/server/server";

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     // ── Google ──
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),

//     // ── GitHub ──
//     GitHub({
//       clientId: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//     }),

//     // ── Credentials (your existing email/password flow) ──
//     Credentials({
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         await dbConnect();
//         const user = await User.findOne({ email: credentials.email }).select(
//           "+password",
//         );
//         if (!user || !user.password) return null;

//         const valid = await user.comparePassword(String(credentials.password));
//         if (!valid) return null;

//         return {
//           id: String(user._id),
//           email: user.email,
//           name: user.username,
//           image: user.avatar,
//           provider: "credentials",
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     // ── Runs after every OAuth sign-in ──
//     // This is where we upsert the user into our own DB
//     async signIn({ user, account, profile }) {
//       if (account?.provider === "credentials") return true;

//       try {
//         await dbConnect();

//         const email = user.email!;
//         const existing = await User.findOne({ email });

//         if (existing) {
//           // Update provider info if they signed up with credentials before
//           if (existing.provider === "credentials") {
//             existing.provider = account!.provider as any;
//             existing.providerId = account!.providerAccountId;
//             existing.avatar = user.image ?? existing.avatar;
//             existing.emailVerified = true;
//             await existing.save({ validateBeforeSave: false });
//           }
//           return true;
//         }

//         // New user — create from OAuth profile
//         const username =
//           (profile?.login as string) ?? // GitHub
//           profile?.name?.replace(/\s+/g, "_").toLowerCase() ?? // Google
//           email.split("@")[0];

//         await User.create({
//           email,
//           username,
//           avatar: user.image,
//           emailVerified: true,
//           provider: account!.provider,
//           providerId: account!.providerAccountId,
//           // password left undefined — pre-save hook handles it safely
//         });

//         return true;
//       } catch (err) {
//         console.error("[OAuth signIn error]", err);
//         return false;
//       }
//     },

//     // ── Attach our DB user id + provider to the JWT ──
//     async jwt({ token, account, profile }) {
//       if (account) {
//         await dbConnect();
//         const dbUser = await User.findOne({ email: token.email });
//         if (dbUser) {
//           token.id = String(dbUser._id);
//           token.provider = dbUser.provider;
//           token.username = dbUser.username;
//           token.avatar = dbUser.avatar;
//         }
//       }
//       return token;
//     },

//     // ── Expose fields to the client session ──
//     async session({ session, token }) {
//       session.user.id = token.id as string;
//       (session.user as any).provider = token.provider as string;
//       (session.user as any).username = token.username as string;
//       session.user.image = token.avatar as string;
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/auth/login", // your custom login page
//     error: "/auth/error",
//   },

//   session: { strategy: "jwt" },
//   secret: process.env.NEXTAUTH_SECRET,
// });
