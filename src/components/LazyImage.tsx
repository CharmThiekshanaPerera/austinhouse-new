import { useState, useCallback } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  skeletonClassName?: string;
}

const LazyImage = ({ src, alt, className, skeletonClassName, ...props }: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => { setError(true); setLoaded(true); }, []);

  return (
    <div className={`relative ${skeletonClassName || ""}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent animate-shimmer bg-[length:200%_100%]" />
        </div>
      )}
      {!error && (
        <img
          src={src}
          alt={alt}
          className={`${className || ""} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
