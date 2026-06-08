import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import { ToastContainer } from "@/components/ui/Toast";
import "./globals.css";

const display = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["400","600","700","800"] });
const body    = DM_Sans({ subsets: ["latin"], variable: "--font-body",    weight: ["400","500","600"] });

export const metadata: Metadata = {
  title: "QRAlert — Smart Vehicle Emergency System",
  description: "Scan any QRAlert sticker to contact a vehicle owner, report wrong parking, or trigger emergency help.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased bg-white text-ink-900">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
