import { Footer } from "@/components/layout/Footer";
import { NavbarDynamic } from "@/components/layout/NavbarDynamic";
import { ArticleReadingHeaderProvider } from "@/components/layout/ArticleReadingHeaderContext";
import { MotionProvider } from "@/components/motion/MotionProvider";

export default function WithNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <ArticleReadingHeaderProvider>
        <NavbarDynamic />
        {children}
        <Footer />
      </ArticleReadingHeaderProvider>
    </MotionProvider>
  );
}
