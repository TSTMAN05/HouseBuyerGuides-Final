import { Plus_Jakarta_Sans } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "HouseBuyerGuides.com | First-Time Homebuyer Programs by City",
    template: "%s | HouseBuyerGuides.com",
  },
  description:
    "Find every down payment assistance program, grant, and first-time buyer benefit by city and state. NC and SC homebuyer guides.",
  openGraph: {
    siteName: "HouseBuyerGuides.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
