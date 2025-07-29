import { motion } from "framer-motion";

const ProductSkeleton = () => (
  <motion.div
    className="bg-white rounded-xl overflow-hidden shadow-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="relative aspect-[3/4] bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
    </div>
  </motion.div>
);

export default function Loading() {
  return null;
}
