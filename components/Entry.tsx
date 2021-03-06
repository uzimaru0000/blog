import * as React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { H1, H5, H6, Plane } from './base/Typography';
import Tag from './Tag';
import Markdown from './Markdown';
import media from 'styled-media-query';

interface Props {
  id: string;
  title: string;
  date: Date;
  tags: string[];
  content: string;
  isExtend?: boolean;
}

export default (props: Props) => (
  <Wrapper isExtend={props.isExtend}>
    <InnerWrapper>
      <Title>{props.title}</Title>
      <Date>{dateFormat(props.date)}</Date>
      <Tags>
        {props.tags.map((x) => (
          <Tag key={x} href={`/tag/${encodeURIComponent(x)}`}>
            {x}
          </Tag>
        ))}
      </Tags>
      {props.isExtend ? (
        <Markdown source={props.content} />
      ) : (
        <Content>{props.content}</Content>
      )}
      {!props.isExtend && (
        <ReadMoreWrapper>
          <ReadMore as="a" href={`/entry/${props.id}`}>
            <FontAwesomeIcon icon="angle-right" />
            READ MORE
          </ReadMore>
        </ReadMoreWrapper>
      )}
    </InnerWrapper>
  </Wrapper>
);

const dateFormat = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  return `${year} / ${month} / ${day}`;
};

const Wrapper = styled.div<{ isExtend?: boolean }>`
  width: 100%;
  padding: 32px;
  ${(props) =>
    !props.isExtend &&
    media.lessThan('medium')`
    box-shadow: 0 0 4px 0 var(--color-text-50);
    border-radius: 16px;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  `}
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled(H1)`
  border-left: 16px solid var(--color-primary);
  padding-left: 24px;
`;

const Date = styled(H6)`
  color: var(--color-text-50);
  padding-left: 40px;
`;

const Tags = styled.div`
  padding: 16px 0 8px 40px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  & ${Tag} {
    margin: 0 8px 8px 0;
  }
`;

const Content = styled.pre`
  ${Plane}
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
  width: 100%;
  max-height: 160px;
  margin-bottom: 1rem;

  ${media.lessThan('medium')`
    display: none;
  `}
`;

const ReadMoreWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const ReadMore = styled(H5)`
  position: relative;
  color: var(--color-text);
  border: 1px solid var(--color-primary);
  padding: 8px 32px;
  text-decoration: none;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 8px;
    height: 100%;
    background: var(--color-primary);
    transition: 0.3s ease;
    z-index: -1;
  }

  &:hover::after {
    width: 100%;
  }

  &:hover {
    color: var(--color-base);
  }

  & *:first-child {
    margin-right: 8px;
  }
`;
