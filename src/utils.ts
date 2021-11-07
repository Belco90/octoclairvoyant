import lowerCase from 'lodash/lowerCase'
import { Content } from 'mdast'
import * as semver from 'semver'
import title from 'title'

import { HIGH_PRIORITY_GROUP_TITLES, LOW_PRIORITY_GROUP_TITLES } from '~/common'
import {
  MiscGroupTitles,
  Release,
  ReleaseLike,
  ReleaseVersion,
  Repository,
  RepositoryQueryParams,
  SemVerGroupTitles,
} from '~/models'

export function mapRepositoryToQueryParams(
  repository?: Repository
): RepositoryQueryParams {
  return {
    owner: repository?.owner?.login ?? '',
    repo: repository?.name ?? '',
  }
}

export function mapStringToRepositoryQueryParams(
  str: string
): RepositoryQueryParams | null {
  try {
    const [owner, repo] = str.split('/')
    return { owner, repo }
  } catch (_: unknown) {
    return null
  }
}

type FilterReleasesNodes = {
  releases: Array<Release>
  from: ReleaseVersion
  to: ReleaseVersion
}

export function getReleaseVersion(release: ReleaseLike): string {
  if (release.tag_name === 'latest') {
    return release.name || release.tag_name
  }

  return release.tag_name
}

export function filterReleasesByVersionRange(
  args: FilterReleasesNodes
): Array<Release> {
  const { releases, from, to: originalTo } = args

  const to =
    originalTo.toLowerCase() === 'latest'
      ? getReleaseVersion(releases[0])
      : originalTo

  // Filter version range as (from, to]
  return releases.filter(
    ({ tag_name }) => semver.gt(tag_name, from) && semver.lte(tag_name, to)
  )
}

export function isStableRelease(release: Release): boolean {
  const { tag_name } = release

  return Boolean(semver.valid(tag_name)) && !semver.prerelease(tag_name)
}

const customTitleSpecials: Array<string> = ['DOM', 'ESLint', 'UI']

export function getRepositoryNameDisplay(repoName: string): string {
  return title(repoName.replace(/[_-]/g, ' '), {
    special: customTitleSpecials,
  })
}

export function getMdastContentNodeTitle(mdastNode: Content): string {
  const nodeChildren = 'children' in mdastNode ? mdastNode.children : null

  if (nodeChildren && 'value' in nodeChildren[0]) {
    return nodeChildren[0].value
  }

  return 'unknown'
}

// TODO: add tests for all variants
export function getReleaseGroupTitle(
  mdastNode: Content
): MiscGroupTitles | SemVerGroupTitles | string {
  const nodeTitle = getMdastContentNodeTitle(mdastNode)
  const mdastTitle = lowerCase(nodeTitle)

  // Check features before than breaking changes to group here "Major Features"
  // and avoid grouping them under breaking changes group
  if (/^.*(feature|minor).*$/i.exec(mdastTitle)) {
    return SemVerGroupTitles.features
  }

  if (/^.*(breaking.*change|major).*$/i.exec(mdastTitle)) {
    return SemVerGroupTitles.breakingChanges
  }

  if (/^.*(bug|fix|patch).*$/i.exec(mdastTitle)) {
    return SemVerGroupTitles.bugFixes
  }

  if (/^.*thank.*$/.exec(mdastTitle)) {
    return MiscGroupTitles.thanks
  }

  if (/^.*artifact.*$/.exec(mdastTitle)) {
    return MiscGroupTitles.artifacts
  }

  if (/^.*credit.*$/.exec(mdastTitle)) {
    return MiscGroupTitles.credits
  }

  return mdastTitle
}

const getTitlePriorityGroup = (titleParam: string): -1 | 0 | 1 => {
  if (HIGH_PRIORITY_GROUP_TITLES.includes(titleParam)) {
    return -1
  }

  if (LOW_PRIORITY_GROUP_TITLES.includes(titleParam)) {
    return 1
  }

  return 0
}

// TODO: add tests for all variants
export function compareReleaseGroupTitlesSort(a: string, b: string): number {
  const aPriority = getTitlePriorityGroup(a)
  const bPriority = getTitlePriorityGroup(b)

  // They belong to different priorities group, sort by highest one
  if (aPriority !== bPriority) {
    return aPriority - bPriority
  }

  // They belong to neutral priority group, maintain sort unchanged
  if (aPriority === 0) {
    return 0
  }

  // They belong to high or low priority group,
  // sort by most important one within their group
  const priorityGroupReference =
    aPriority === -1 ? HIGH_PRIORITY_GROUP_TITLES : LOW_PRIORITY_GROUP_TITLES

  const indexOfA = priorityGroupReference.indexOf(a)
  const indexOfB = priorityGroupReference.indexOf(b)

  if (indexOfA < indexOfB) {
    return -1
  }

  if (indexOfA > indexOfB) {
    return 1
  }

  // Maintain sort unchanged just in case
  return 0
}

export const releasesComparator = (
  a: Release,
  b: Release,
  order: 'asc' | 'desc' = 'desc'
): number => {
  const { tag_name: verA } = a
  const { tag_name: verB } = b

  if (semver.gt(verA, verB)) {
    return order === 'desc' ? -1 : 1
  }

  if (semver.lt(verA, verB)) {
    return order === 'desc' ? 1 : -1
  }

  return 0
}
