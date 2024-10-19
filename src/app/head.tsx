// app/head.tsx
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
export default function Head() {
    return (
      <>
        <title>Creator Studio</title>
        <meta name="description" content="A platform for creators to enhance their content with AI tools" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        
      </>
    );
  }
  