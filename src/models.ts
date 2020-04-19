import { Parent } from 'unist';

export interface RepositoryInfo {
  name: string;
  url: string;
}

export type RepositoryQueryVars = {
  name: string;
  owner: string;
};

export interface RepositoryResponse extends RepositoryInfo {
  releases: ReleasesConnection;
}

export type ReleasesConnection = {
  edges: ReleaseEdge[];
};

export type ReleaseEdge = {
  node: Release;
};

export interface Repository extends RepositoryInfo {
  releases: Release[];
}

export interface Release {
  id: string;
  description: string;
  tagName: string;
  isDraft: boolean;
  isPrerelease: boolean;
}

export type VersionRange = [string, string];

// FIXME: generate proper types for processed release
export type ProcessedReleasesCollection = any;

export interface ProcessedReleaseChange extends Omit<Release, 'description'> {
  title: string;
  originalTitle: string;
  // repository: RepositoryInfo;
  descriptionMdast: Parent;
}
