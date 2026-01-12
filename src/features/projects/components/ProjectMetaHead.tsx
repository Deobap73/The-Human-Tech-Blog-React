// /src/features/projects/components/ProjectMetaHead.tsx

'use strict';

import React from 'react';
import Helmet from '../seo/Helmet';

interface Props {
  title: string;
  excerpt?: string;
  coverImage?: string;
  canonical: string;
  lang?: string;
}

const ProjectMetaHead: React.FC<Props> = ({ title, excerpt, coverImage, canonical, lang }) => {
  return (
    <Helmet
      title={title}
      description={excerpt}
      canonical={canonical}
      ogImage={coverImage}
      lang={lang}
    />
  );
};

export default ProjectMetaHead;
