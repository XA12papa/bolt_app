
import { Roboto } from "next/font/google";
import "./globals.css";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,

} from '@clerk/nextjs'
import Sidesbar from "@/components/Sidesbar";



const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
    <ClerkProvider >
      <body>
        <Sidesbar/>
        {children}
      </body>
    </ClerkProvider>

    </html>
  );
}
