import type { Metadata } from "next";
import { Anton, Bodoni_Moda, Caveat, DM_Sans, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { asset } from "@/data/images";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const caveat = Caveat({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-italic",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const playfair = Playfair_Display({
  weight: ["500", "600"],
  style: "italic",
  subsets: ["latin"],
  variable: "--font-playfair",
});

const bodoni = Bodoni_Moda({
  weight: ["500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-bodoni",
});

export const metadata: Metadata = {
  title: {
    default: "Butler Signs",
    template: "%s | Butler Signs",
  },
  description:
    "Three generations of Butler Signs — banners, magnetic vehicle signs, A-frames, storefronts, custom truck lettering, and window tint across Maryland, DC and Virginia.",
  icons: {
    icon: asset("1782507889082-99lo9l.png"),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${caveat.variable} ${dmSans.variable} ${jetbrains.variable} ${playfair.variable} ${bodoni.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
