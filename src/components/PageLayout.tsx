
import { motion } from "framer-motion";
import NavigationBar from "./NavigationBar";
import { ReactNode } from "react";

type PageLayoutProps = {
  children: ReactNode;
  fullWidth?: boolean;
};

const PageLayout = ({ children, fullWidth = false }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-teal-50">
      <NavigationBar />
      <main className="pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={fullWidth ? "w-full px-4 py-8" : "container mx-auto px-4 py-8"}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default PageLayout;
