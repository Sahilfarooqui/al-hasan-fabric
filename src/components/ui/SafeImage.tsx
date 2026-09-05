'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

type Props = Omit<ImageProps, 'src'> & {
  src: string;
  fallbackSrc?: string;
};

const FALLBACK = 'https://picsum.photos/seed/alhasan-fallback/800/1000';

function isDataOrBlob(src: string) {
  return src.startsWith('data:') || src.startsWith('blob:');
}

export default function SafeImage({ src, fallbackSrc = FALLBACK, alt, className, onLoad, onError, ...rest }: Props) {
  const [current, setCurrent] = useState(src || fallbackSrc);
  const [useNative, setUseNative] = useState(isDataOrBlob(src || ''));

  if (useNative || isDataOrBlob(current)) {
    const { fill, priority } = rest;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={current || fallbackSrc}
        alt={alt || ''}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : undefined}
        onLoad={onLoad as never}
        onError={() => {
          if (current !== fallbackSrc) setCurrent(fallbackSrc);
        }}
      />
    );
  }

  return (
    <Image
      src={current}
      alt={alt || ''}
      className={className}
      onLoad={onLoad}
      onError={(e) => {
        setCurrent(fallbackSrc);
        setUseNative(true);
        onError?.(e);
      }}
      {...rest}
    />
  );
}
