import { cn, formatFileSize } from "@/lib/utils";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { motion, useInView, type Variants } from "motion/react";
import Reveal from "./reveal";
import { useRef } from "react";

interface StatCardProps {
  label: string;
  value?: string | number;
  animatedValue?: number;
  format?: (value: number) => string;
  suffix?: string;
  className?: string;
  active?: boolean;
}

function StatCard({
  label,
  value,
  animatedValue,
  format,
  suffix = "",
  className = "",
  active = true,
}: StatCardProps) {
  const display =
    animatedValue !== undefined ? (
      <AnimatedNumber value={animatedValue} format={format} active={active} />
    ) : (
      value
    );

  return (
    <div
      className={cn(
        "rounded-4xl border p-4 flex-col-center bg-card",
        className,
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold">
        {display}
        {suffix}
      </span>
    </div>
  );
}

const statsGridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

interface StatisticsSectionProps {
  compressedImages: TProcessedImage[];
  processTime: number;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export default function StatisticsSection({
  compressedImages,
  processTime,
  className = "",
  ref,
}: StatisticsSectionProps) {
  // Sum original sizes
  const totalOriginalSize = compressedImages.reduce(
    (sum, img) => sum + (img.originalFile?.size || 0),
    0,
  );

  // Sum compressed sizes
  const totalCompressedSize = compressedImages.reduce(
    (sum, img) => sum + (img.size || 0),
    0,
  );

  // Calculate total saved size
  const totalSavedSize = totalOriginalSize - totalCompressedSize;

  // Calculate compression ratio
  const compressionRatio =
    totalOriginalSize > 0
      ? 100 - (totalCompressedSize / totalOriginalSize) * 100
      : 0;

  const statsGridRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsGridRef, {
    once: true,
    margin: "-40px",
  });

  return (
    <section ref={ref} className={cn("block text-center", className)}>
      <Reveal as="div" className="space-y-5">
        <h2 className="h2">Compression Statistics</h2>
        {/* Stats grid */}
        <motion.div
          ref={statsGridRef}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={statsGridVariants}
        >
          <motion.div
            variants={statCardVariants}
            className="col-span-2 sm:col-span-3"
          >
            <StatCard
              label="Total Saved"
              animatedValue={totalSavedSize}
              format={formatFileSize}
              active={statsInView}
            />
          </motion.div>
          <motion.div variants={statCardVariants}>
            <StatCard
              label="Total Images"
              animatedValue={compressedImages.length}
              active={statsInView}
            />
          </motion.div>
          <motion.div variants={statCardVariants}>
            <StatCard
              label="Total Time"
              animatedValue={processTime / 1000}
              format={(value) => value.toFixed(1)}
              suffix=" sec"
              active={statsInView}
            />
          </motion.div>
          <motion.div variants={statCardVariants}>
            <StatCard
              label="Avg. per Image"
              animatedValue={
                compressedImages.length
                  ? processTime / compressedImages.length / 1000
                  : 0
              }
              format={(value) => value.toFixed(2)}
              suffix=" sec"
              active={statsInView}
            />
          </motion.div>
          <motion.div variants={statCardVariants}>
            <StatCard
              label="Original Size"
              animatedValue={totalOriginalSize}
              format={formatFileSize}
              active={statsInView}
            />
          </motion.div>
          <motion.div variants={statCardVariants}>
            <StatCard
              label="Compressed Size"
              animatedValue={totalCompressedSize}
              format={formatFileSize}
              active={statsInView}
            />
          </motion.div>
          <motion.div variants={statCardVariants}>
            <StatCard
              label="Compression Ratio"
              animatedValue={compressionRatio}
              format={(value) => value.toFixed(1)}
              suffix="%"
              active={statsInView}
            />
          </motion.div>
        </motion.div>
      </Reveal>
    </section>
  );
}
