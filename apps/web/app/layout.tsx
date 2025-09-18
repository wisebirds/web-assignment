import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ReactQueryClientProvider } from "./components/react-query-client-provider";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wisebirds Web Assignment",
  description: "Wisebirds Web Assignment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="ko">
        <body className={geist.className}>{children}</body>
      </html>
    </ReactQueryClientProvider>
  );
}
