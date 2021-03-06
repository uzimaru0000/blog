import * as React from 'react';
import styled from 'styled-components';
import Entry from '../Entry';
import media from 'styled-media-query';
import { WithID, Entry as EntryType } from '../../lib/model';
import Share from '../Share';
import DummyEntry from '../DummyEntry';

export default ({ entry }: { entry: WithID<EntryType> }) => {
  const shareLink = entry
    ? encodeURI(`https://blog.uzimaru.com/entry/${entry.id}`)
    : '';

  return (
    <>
      <CatchUp image={entry && entry.image} />
      <Wrapper>
        {entry ? (
          <>
            <InnerWrapper>
              {entry && <Entry {...entry} isExtend={true} />}
            </InnerWrapper>
            <ShareWrapper>
              <Share
                icon={['fab', 'facebook']}
                url={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`}
                color="#3B5998"
              />
              <Share
                icon={['fab', 'twitter']}
                url={`https://twitter.com/intent/tweet?url=${shareLink}&text=${
                  entry && entry.title
                }`}
                color="#1DA1F2"
              />
              <Share
                icon={['fab', 'get-pocket']}
                url={`https://getpocket.com/save?${shareLink}`}
                color="#EE4056"
              />
            </ShareWrapper>
          </>
        ) : (
          <DummyEntry isExtend={true} />
        )}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  width: 100%;
  background: var(--color-base);
`;

const InnerWrapper = styled.div`
  ${media.greaterThan('medium')`
    margin: 0 auto;
    width: 90%;
    max-width: 980px;
  `}

  ${media.lessThan('medium')`
    width: 100%;
  `}
`;

const CatchUp = styled.div<{ image: string }>`
  position: sticky;
  top: 0;
  width: 100vw;
  z-index: -1;
  height: calc(100vh - 64px);
  background-image: ${({ image }) => `url(${image})`};
  background-color: linear-gradient(
    45deg,
    var(--color-primary),
    var(--color-accent)
  );
  background-size: cover;
  background-position: center;
  transition: 300ms ease;
`;

const ShareWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 1rem 0;

  & a {
    margin-right: 3rem;
  }

  & a:last-child {
    margin-right: 0;
  }
`;
