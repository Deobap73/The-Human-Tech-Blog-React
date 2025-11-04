'use strict';

/**
 * Path: /src/features/projects/pages/ProjectsFilterBar.tsx
 * NOTE:
 *  This file now re-exports the component located in /components/FiltersBar.tsx
 *  to avoid breaking imports while migrating structure to "Figma to code" style.
 */

import FiltersBar from '../components/FiltersBar';
export default FiltersBar;
export type { ProjectTab } from '../components/FiltersBar';
