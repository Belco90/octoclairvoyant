import React from 'react';
import { Box, Heading, Stack, Tag, Text } from '@chakra-ui/core';
import { ProcessedReleaseChange, Release, Repository } from 'models';
import { filterReleasesByVersionRange } from 'utils';
import Link from 'components/Link';
import useProcessReleases from 'hooks/useProcessReleases';
import ProcessedReleaseChangeDescription from 'components/ProcessedReleaseChangeDescription';

interface RepositoryReleasesChangelogProps {
  repository: Repository | null;
  fromVersion: string;
  toVersion: string;
}

const RepositoryReleasesChangelog = ({
  repository,
  fromVersion,
  toVersion,
}: RepositoryReleasesChangelogProps) => {
  const [filteredReleases, setFilteredReleases] = React.useState<
    Release[] | null
  >(null);

  const processedReleases = useProcessReleases(filteredReleases);

  const releases = repository?.releases;

  React.useEffect(
    function filterReleases() {
      if (releases && fromVersion && toVersion) {
        setFilteredReleases(
          filterReleasesByVersionRange({
            releases,
            from: fromVersion,
            to: toVersion,
          })
        );
      } else {
        setFilteredReleases(null);
      }
    },
    [releases, fromVersion, toVersion]
  );

  if (!repository) {
    return null;
  }

  return (
    <>
      <Heading as="h1" size="2xl" mb={4}>
        <Link href={repository.url} isExternal>
          {repository.name}
        </Link>
      </Heading>

      {fromVersion && toVersion ? (
        <Heading fontSize="sm" mb={4}>
          Comparing releases from{' '}
          <Tag size="sm" variantColor="orange">
            {fromVersion}
          </Tag>{' '}
          to{' '}
          <Tag size="sm" variantColor="orange">
            {toVersion}
          </Tag>
        </Heading>
      ) : (
        <Text as="i" color="gray.500">
          No releases selected to compare
        </Text>
      )}

      {processedReleases ? (
        <Stack spacing={6}>
          {Object.keys(processedReleases).map((title: string) => (
            <Box key={title}>
              <Heading as="h2" size="xl">
                {title}
              </Heading>
              <Box mb={4}>
                {processedReleases[title].map(
                  (processedReleaseChange: ProcessedReleaseChange) => (
                    <ProcessedReleaseChangeDescription
                      key={processedReleaseChange.id}
                      repository={repository}
                      processedReleaseChange={processedReleaseChange}
                    />
                  )
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      ) : (
        <Text as="i" color="gray.500">
          No processed releases to show
        </Text>
      )}
    </>
  );
};

export default RepositoryReleasesChangelog;
