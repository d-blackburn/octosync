import { useCallback, useEffect, useState } from 'react';
import { Octokit } from '@octokit/rest';
import { User } from '../../github/user';
import { Repository } from '../../github/repository';
import { ProcessStatus } from '../../models/wizards/processStatus';
import { ProcessState } from '../../models/wizards/processState';
import { TemplateSyncData } from '../features/templateSync/models/templateSyncData';

export function useGitHub() {
  const [octokit, setOctokit] = useState<Octokit | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (octokit === null) {
      window.electron.ipcRenderer
        .decryptGitHubToken()
        .then((token) => setOctokit(new Octokit({ auth: token })));
    }
  });

  useEffect(() => {
    if (octokit) {
      octokit?.users
        .getAuthenticated()
        .then((response) => setUser(response.data));
    }
  }, [octokit]);

  const getAllReposForUser = useCallback(async (): Promise<Repository[]> => {
    if (user === null || octokit === null) return [];

    try {
      const userRepos = await octokit.paginate(octokit.rest.repos.listForUser, {
        username: user.login,
      });

      const allOrgRepos = [];
      const organizations = await octokit.paginate(
        octokit.rest.orgs.listForAuthenticatedUser,
      );

      for (const org of organizations) {
        try {
          const orgRepos = await octokit.paginate(
            octokit.rest.repos.listForOrg,
            {
              org: org.login,
            },
          );
          allOrgRepos.push(...orgRepos);
        } catch (error) {
          console.error(
            `Error fetching repos for ${org.login} (ignoring):`,
            error,
          );
        }
      }

      return [...userRepos, ...allOrgRepos] as Repository[];
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }, [octokit, user]);

  const copyLabelsFromRepository = useCallback(
    async (
      source: Repository,
      destinations: Repository[],
      callback: (state: ProcessState) => void,
    ) => {
      if (octokit === null) return;

      try {
        // 1. Get all labels from the source repository
        const sourceLabels = await octokit.paginate(
          octokit.rest.issues.listLabelsForRepo,
          {
            owner: source.owner.login,
            repo: source.name,
          },
        );

        // Create a set of source label names for efficient lookup
        const sourceLabelNames = new Set(
          sourceLabels.map((label) => label.name),
        );

        // 2. Iterate through the destination repositories
        for (const repo of destinations) {
          callback({
            id: repo.id,
            message: 'Getting labels from destination',
            status: ProcessStatus.InProgress,
          });

          // Get all labels from the destination repository
          const destLabels = await octokit.paginate(
            octokit.rest.issues.listLabelsForRepo,
            {
              owner: repo.owner.login,
              repo: repo.name,
            },
          );

          callback({
            id: repo.id,
            message: 'Deleting redundant labels',
            status: ProcessStatus.InProgress,
          });

          // 3. Delete labels that don't exist in the source
          for (const destLabel of destLabels) {
            if (!sourceLabelNames.has(destLabel.name)) {
              console.log(`Deleting label: ${destLabel.name}`);
              await octokit.rest.issues.deleteLabel({
                owner: repo.owner.login,
                repo: repo.name,
                name: destLabel.name,
              });
            }
          }

          callback({
            id: repo.id,
            message: 'Creating/ updating relevant labels',
            status: ProcessStatus.InProgress,
          });

          // 4. Create/update labels to match the source
          for (const sourceLabel of sourceLabels) {
            try {
              console.log(`Creating/updating label: ${sourceLabel.name}`);
              await octokit.rest.issues.createLabel({
                owner: repo.owner.login,
                repo: repo.name,
                name: sourceLabel.name,
                color: sourceLabel.color,
                description: sourceLabel.description ?? undefined,
              });
            } catch (error: any) {
              // If the label already exists, update it
              if (error.status === 422) {
                console.log(`Updating label: ${sourceLabel.name}`);
                await octokit.rest.issues.updateLabel({
                  owner: repo.owner.login,
                  repo: repo.name,
                  name: sourceLabel.name,
                  color: sourceLabel.color,
                  description: sourceLabel.description ?? undefined,
                });
              } else {
                console.error(
                  `Error creating/updating label ${sourceLabel.name}:`,
                  error,
                );
              }
            }

            callback({
              id: repo.id,
              message: 'Done!',
              status: ProcessStatus.Success,
            });
          }
        }
      } catch (error) {
        console.error('Error syncing labels:', error);
      }
    },
    [octokit],
  );

  const copyContentFromRepository = useCallback(
    async (
      key: string,
      templateSyncData: TemplateSyncData,
      branchName: string,
      path: string,
      callback: (state: ProcessState) => void,
    ) => {
      if (octokit === null || user === null) return;

      const { source, destinations } = templateSyncData;

      if (source === null) return;

      try {
        // 1. Get the default branch of the source repository
        const { data: sourceRepoData } = await octokit.rest.repos.get({
          owner: source.owner.login,
          repo: source.name,
        });
        const sourceDefaultBranch = sourceRepoData.default_branch;

        // 2. Get the contents of the source repository's .github/ISSUE_TEMPLATE directory
        const { data: sourceIssueTemplates } =
          await octokit.rest.repos.getContent({
            owner: source.owner.login,
            repo: source.name,
            path,
          });

        // 3. Iterate through the destination repositories
        for (const destRepo of destinations) {
          callback({
            key,
            id: destRepo.id,
            status: ProcessStatus.InProgress,
            message: `Copying ${path} from ${source.full_name}`,
            url: '',
          });

          try {
            // 4. Get the SHA of the HEAD of the default branch
            const { data: refData } = await octokit.rest.git.getRef({
              owner: destRepo.owner.login,
              repo: destRepo.name,
              ref: `heads/${destRepo.default_branch}`,
            });

            // 5. Create a new branch for the changes
            await octokit.rest.git.createRef({
              owner: destRepo.owner.login,
              repo: destRepo.name,
              ref: `refs/heads/${branchName}`,
              sha: refData.object.sha,
            });

            let existingTemplates;
            try {
              const { data } = await octokit.rest.repos.getContent({
                owner: destRepo.owner.login,
                repo: destRepo.name,
                ref: branchName,
                path,
              });
              existingTemplates = data;
            } catch (error: any) {
              // Ignore if the directory doesn't exist
              if (error.status !== 404) {
                throw error;
              }
            }

            // 7. Prepare the tree items for the commit
            const treeItems = [];

            // Add existing templates (if any) to the tree for deletion
            if (Array.isArray(existingTemplates)) {
              for (const template of existingTemplates) {
                treeItems.push({
                  path: template.path,
                  mode: '100644',
                  type: 'blob',
                  sha: null, // Setting sha to null deletes the file
                });
              }
            }

            // Add new issue templates to the tree
            if (Array.isArray(sourceIssueTemplates)) {
              for (const template of sourceIssueTemplates) {
                const { data: templateContent } =
                  await octokit.rest.repos.getContent({
                    owner: source.owner.login,
                    repo: source.name,
                    path: template.path,
                    ref: sourceDefaultBranch,
                  });

                if ('content' in templateContent) {
                  const decodedContent = decodeURIComponent(
                    escape(atob(templateContent.content)),
                  );
                  treeItems.push({
                    path: template.path,
                    mode: '100644', // File mode
                    type: 'blob',
                    content: decodedContent,
                  });
                } else {
                  console.log(`${template.path} is a directory, skipping...`);
                }
              }
            }

            if ('content' in sourceIssueTemplates) {
              const decodedContent = decodeURIComponent(
                escape(atob(sourceIssueTemplates.content)),
              );
              treeItems.push({
                path: sourceIssueTemplates.path,
                mode: '100644', // File mode
                type: 'blob',
                content: decodedContent,
              });
            }

            // 8. Create a tree with the changes
            const { data: newTree } = await octokit.rest.git.createTree({
              owner: destRepo.owner.login,
              repo: destRepo.name,
              tree: treeItems as any,
              base_tree: refData.object.sha, // Base the tree on the new branch
            });

            // 9. Create a commit with the new tree
            const { data: newCommit } = await octokit.rest.git.createCommit({
              owner: destRepo.owner.login,
              repo: destRepo.name,
              message: `Copied ${path} from ${source.full_name}`,
              tree: newTree.sha,
              parents: [refData.object.sha],
            });

            // 10. Update the branch to point to the new commit
            await octokit.rest.git.updateRef({
              owner: destRepo.owner.login,
              repo: destRepo.name,
              ref: `heads/${branchName}`,
              sha: newCommit.sha,
            });

            callback({
              key,
              id: destRepo.id,
              status: ProcessStatus.InProgress,
              message: 'Creating Pull Request',
              url: '',
            });

            // 11. Create a Pull Request for the new branch
            const { data: pullRequest } = await octokit.rest.pulls.create({
              owner: destRepo.owner.login,
              repo: destRepo.name,
              title: `[OctoSync] - Copied ${path} from ${source.full_name}`,
              head: branchName,
              base: destRepo.default_branch,
              body: '',
            });

            callback({
              key,
              id: destRepo.id,
              status: ProcessStatus.InProgress,
              message: 'Adding assignee to Pull Request',
              url: '',
            });

            // 12. Assign the authenticated user to the Pull Request
            await octokit.rest.issues.addAssignees({
              owner: destRepo.owner.login,
              repo: destRepo.name,
              issue_number: pullRequest.number, // Use the pull request number
              assignees: [user.login],
            });

            callback({
              key,
              id: destRepo.id,
              status: ProcessStatus.Success,
              message: 'Completed successfully!',
              url: '',
            });
          } catch (error: any) {
            callback({
              key,
              id: destRepo.id,
              status: ProcessStatus.Failed,
              message: error.message,
              url: '',
            });
          }
        }
      } catch (error) {
        console.error('Error copying issue templates:', error);
      }
    },
    [octokit, user],
  );

  return {
    user,
    getAllReposForUser,
    copyContentFromRepository,
    copyLabelsFromRepository,
  };
}
