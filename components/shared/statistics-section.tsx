import { cn, formatFileSize } from "@/lib/utils";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import Reveal from "./reveal";

interface StatCardProps {
  label: string;
  value?: string | number;
  animatedValue?: number;
  format?: (value: number) => string;
  suffix?: string;
  className?: string;
}

function StatCard({
  label,
  value,
  animatedValue,
  format,
  suffix = "",
  className = "",
}: StatCardProps) {
  const display =
    animatedValue !== undefined ? (
      <AnimatedNumber value={animatedValue} format={format} />
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

  return (
    <section ref={ref} className={cn("block text-center", className)}>
      <Reveal as="div" className="space-y-5">
        <h2 className="h2">Compression Statistics</h2>
        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <StatCard
            label="Total Saved"
            value={formatFileSize(totalSavedSize)}
            className="col-span-2 sm:col-span-3"
          />
          <StatCard
            label="Total Images"
            animatedValue={compressedImages.length}
          />
          <StatCard
            label="Total Time"
            animatedValue={processTime / 1000}
            format={(value) => value.toFixed(1)}
            suffix=" sec"
          />
          <StatCard
            label="Avg. per Image"
            animatedValue={
              compressedImages.length
                ? processTime / compressedImages.length / 1000
                : 0
            }
            format={(value) => value.toFixed(2)}
            suffix=" sec"
          />
          <StatCard
            label="Original Size"
            value={formatFileSize(totalOriginalSize)}
          />
          <StatCard
            label="Compressed Size"
            value={formatFileSize(totalCompressedSize)}
          />
          <StatCard
            label="Compression Ratio"
            animatedValue={compressionRatio}
            format={(value) => value.toFixed(1)}
            suffix="%"
          />
        </div>
      </Reveal>
    </section>
  );
}
