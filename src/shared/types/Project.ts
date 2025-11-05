// /src/shared/types/Project.ts
'use strict';

export type ProjectType = 'frontend-ui' | 'ux-figma' | 'full';
export type ProjectSource = 'figma' | 'github' | 'mixed';

export interface ProjectLinks {
  figma?: string;
  figmaEmbedUrl?: string;
  github?: string;
  live?: string;
  blog?: string;
  article?: string;
}

export interface ProjectMetaFigma {
  fileKey?: string;
  fileName?: string;
  thumbnailUrl?: string;
  lastModified?: string; // ISO string
}

export interface ProjectMetaGitHub {
  repo?: string; // "owner/name"
  stars?: number;
  lastCommitAt?: string; // ISO string
  topics?: string[];
  description?: string;
}

export interface Project {
  _id: string;
  slug: string;
  type: ProjectType;
  title: string;
  excerpt?: string;
  description?: string;
  coverImage?: string;
  tags: string[];
  links: ProjectLinks;

  // optional (backend-provided)
  source?: ProjectSource;
  meta?: {
    figma?: ProjectMetaFigma;
    github?: ProjectMetaGitHub;
  };

  createdAt?: string;
  updatedAt?: string;
}
