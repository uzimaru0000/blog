import { Image, ImageProps } from '@chakra-ui/react';
import { useMemo } from 'react';
import twemoji from 'twemoji';

export type Props = {
  emoji: string;
} & ImageProps;
export const Twemoji: React.VFC<Props> = ({ emoji, ...props }) => {
  const src = useMemo(() => {
    const codePoint = twemoji.convert.toCodePoint(emoji);
    return url(codePoint);
  }, [emoji]);

  return <Image {...props} alt="emoji" src={src} />;
};
<Image alt="emoji" width="1em" />;

const url = (codePoint: string) => {
  return `https://twemoji.maxcdn.com/v/latest/svg/${
    codePoint.split('-')[0]
  }.svg`;
};
