import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

const PageTransition = ({ children }: { children: ReactNode }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={pageVariants}
      initial={false}
      animate="animate"
      exit="exit"
      layout
      style={{ willChange: "transform, opacity" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
