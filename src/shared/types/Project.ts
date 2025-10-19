// /src/shared/types/Project.ts
'use strict';

export interface ProjectLinks {
  figma?: string;
  figmaEmbedUrl?: string;
  github?: string;
  live?: string;
  blog?: string;
}

export type ProjectType = 'frontend-ui' | 'ux-figma' | 'full';

export interface Project {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  tags?: string[];
  links?: ProjectLinks;
  type: ProjectType;
  createdAt: string;
  updatedAt: string;
}
