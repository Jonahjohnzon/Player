import type { Metadata } from "next";
import "./globals.css";
import Body from "./Body";


export const metadata: Metadata = {
  title: "Screenopps Player",
  description: "Player for Screenopps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <Body >{children}</Body>
    </html>
  );
}
