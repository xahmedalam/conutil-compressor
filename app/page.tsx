"use client";

import { Magnetic } from "@/components/motion-primitives/magnetic";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import CompressionSettingsCard from "@/components/shared/compression-settings-card";
import FaqSection from "@/components/shared/faq-section";
import ImageCarousel from "@/components/shared/image-carousel";
import Reveal from "@/components/shared/reveal";
import StatisticsSection from "@/components/shared/statistics-section";
import UploadBox from "@/components/shared/upload-box";
import { Button } from "@/components/ui/button";
import { LINKEDIN_URL, quickPresets, X_URL } from "@/constants";
import { processAllImages } from "@/core/compressor";
import JSZip from "jszip";
import {
  ArrowDownToLine,
  FileArchive,
  Linkedin,
  Loader2,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export default function Home() {
  const [images, setImages] = useState<File[]>([]);
  const [initialSettings, setInitialSettings] = useState<TCompressionSettings>({
    ...quickPresets[0],
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processTime, setProcessTime] = useState(0);
  const [compressedImages, setCompressedImages] = useState<TProcessedImage[]>(
    [],
  );
  const processIdRef = useRef(0);
  const statisticsSectionRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    // Keep images only
    const filteredFiles = acceptedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );
    setImages((prev) => [...prev, ...filteredFiles]);
    setCompressedImages([]);
    setProgress(0);
    setProcessTime(0);
  }, []);

  const handleSettingsDone = useCallback(
    async (settings: TCompressionSettings) => {
      if (images.length === 0) return;
      setLoading(true);
      setInitialSettings(settings);
      setCompressedImages([]);
      setProgress(0);
      setProcessTime(0);

      // Track the latest run so older results do not overwrite
      processIdRef.current += 1;
      const currentProcessId = processIdRef.current;

      await processAllImages(
        images,
        settings,
        (value) => {
          if (processIdRef.current !== currentProcessId) return;
          startTransition(() => {
            setProgress(value);
          });
        },
        (processedImages, time) => {
          if (processIdRef.current !== currentProcessId) return;
          setCompressedImages(processedImages);
          setProcessTime(time);
          setLoading(false);
        },
      );
    },
    [images],
  );

  const downloadDisabled = useMemo(
    () => compressedImages.length === 0 || isDownloading || isZipping,
    [compressedImages.length, isDownloading, isZipping],
  );

  useEffect(() => {
    if (compressedImages.length === 0) return;

    statisticsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [compressedImages.length]);

  const handleDownload = useCallback(async () => {
    if (compressedImages.length === 0) return;

    setIsDownloading(true);

    for (const image of compressedImages) {
      const link = document.createElement("a");
      const url = URL.createObjectURL(image.blob);
      const nameArray = image.name.split(".");
      const baseName = nameArray.slice(0, -1).join(".");
      const ext = nameArray[nameArray.length - 1];
      link.href = url;

      if (ext === "jpg") {
        link.download = `${baseName}.jpg`;
      } else {
        link.download = `${baseName}.${initialSettings.format}`;
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    setIsDownloading(false);
  }, [compressedImages, initialSettings.format]);

  const handleDownloadZip = useCallback(async () => {
    if (compressedImages.length === 0) return;

    setIsDownloading(true);
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const filenameCount = new Map<string, number>();

      for (const image of compressedImages) {
        let filename = "";
        const nameArray = image.name.split(".");
        const baseName = nameArray.slice(0, -1).join(".");
        const ext = nameArray[nameArray.length - 1];

        if (ext === "jpg") {
          filename = `${baseName}.jpg`;
        } else {
          filename = `${baseName}.${initialSettings.format}`;
        }

        if (filenameCount.has(filename)) {
          const count = filenameCount.get(filename) ?? 1;
          filenameCount.set(filename, count + 1);
          const lastDotIndex = filename.lastIndexOf(".");
          filename = `${filename.substring(0, lastDotIndex)}_${count}${filename.substring(lastDotIndex)}`;
        } else {
          filenameCount.set(filename, 1);
        }

        zip.file(filename, image.blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(zipBlob);
      link.href = url;
      link.download = "compressed-images.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsZipping(false);
      setIsDownloading(false);
    }
  }, [compressedImages, initialSettings.format]);

  if (loading) {
    return (
      <div className="w-screen h-screen fixed top-0 left-0 flex-col-center bg-background">
        {progress < images.length ? (
          <>
            <div className="h2">
              {progress}/{images.length}
            </div>
            <p>Images are being compressed</p>
          </>
        ) : (
          <>
            <div className="h2">{(processTime / 1000).toFixed(1)} sec</div>
            <p>Compression completed</p>
          </>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen container mx-auto flex flex-col items-center gap-11 px-4 py-11 md:p-14">
      {/* Hero Section */}
      <section className="flex flex-col gap-4">
        <TextEffect as="h1" per="line" preset="fade-in-blur">
          {"IN BROWSER\nBULK IMAGE\nCOMPRESSOR"}
        </TextEffect>
        <TextEffect as="p" per="word" preset="fade" delay={0.4}>
          {
            "The only local image compressor that doesn't suck or get you into subscription hell."
          }
        </TextEffect>
      </section>
      {/* Upload Box */}
      <Reveal>
        <UploadBox onDrop={handleDrop} />
      </Reveal>
      {/* Added Images */}
      <Reveal>
        <ImageCarousel files={images} type="original" />
      </Reveal>
      {/* Settings */}
      <Reveal>
        <CompressionSettingsCard
          initialSettings={initialSettings}
          onDone={handleSettingsDone}
          imagesLength={images.length}
        />
      </Reveal>
      {/* Compressed Results */}
      <Reveal>
        <ImageCarousel files={compressedImages} type="compressed" />
      </Reveal>
      {/* Statistics */}
      <StatisticsSection
        ref={statisticsSectionRef}
        compressedImages={compressedImages}
        processTime={processTime}
      />
      {/* Downloads */}
      <Reveal className="grid sm:grid-cols-2 gap-4">
        <Magnetic intensity={0.4}>
          <Button
            className="w-full"
            onClick={handleDownload}
            disabled={downloadDisabled}
          >
            {isDownloading && !isZipping ? (
              <>
                <Loader2 className="animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <ArrowDownToLine />
                Download
              </>
            )}
          </Button>
        </Magnetic>
        <Magnetic intensity={0.4}>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleDownloadZip}
            disabled={downloadDisabled}
          >
            {isZipping ? (
              <>
                <Loader2 className="animate-spin" />
                Creating Zip...
              </>
            ) : (
              <>
                <FileArchive />
                Download as Zip
              </>
            )}
          </Button>
        </Magnetic>
      </Reveal>
      {/* About */}
      <Reveal>
        <div className="bg-card border-t border-b p-9 space-y-5 lg:px-14 lg:py-11 lg:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/founder.jpg"
                alt="Founder"
                className="size-16 rounded-full"
              />
              <div className="-space-y-0.5">
                <div className="text-lg sm:text-xl font-medium">Ahmed Alam</div>
                <div className="text-sm text-muted-foreground leading-tight">
                  Full-stack Developer
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 *:hover:opacity-75 *:transition-opacity">
              <Link href={X_URL} target="_blank">
                <Twitter />
              </Link>
              <Link href={LINKEDIN_URL} target="_blank">
                <Linkedin />
              </Link>
            </div>
          </div>
          <p className="text-xl text-primary text-left">
            I made this because I was annoyed with popups, subscription, and
            uploading my images to random sites for just to compress. It{"'"}s a
            basic tool that should be local and free.
          </p>
        </div>
      </Reveal>
      {/* FAQs */}
      <FaqSection />
    </main>
  );
}
