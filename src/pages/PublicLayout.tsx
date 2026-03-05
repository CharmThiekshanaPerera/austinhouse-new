import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const PublicLayout = () => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const variants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <>
      <Navbar />
      <div className="relative">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={location.pathname}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }
            }
            className="w-full"
            style={{ willChange: "transform, opacity" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default PublicLayout;
