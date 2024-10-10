import { fetchProjects, fetchAuthors, fetchMergeRequests } from './gitlab.js';
import { createWordDocument } from './wordUtils.js';
import inquirer from 'inquirer';

async function run() {
  const repos = await fetchProjects();
  if (repos.length === 0) {
    console.error('Нет доступных проектов.');
    return;
  }

  const repoChoices = repos.map((repo) => ({
    name: repo.name,
    value: repo.id,
  }));

  const { searchAllProjects } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'searchAllProjects',
      message: 'Хотите искать MR по всем проектам?',
      default: false,
    },
  ]);

  let selectedProjects = searchAllProjects
    ? repos
    : await inquirer
        .prompt([
          {
            type: 'list',
            name: 'projectId',
            message: 'Выберите проект:',
            choices: repoChoices,
          },
        ])
        .then(({ projectId }) => repos.filter((repo) => repo.id === projectId));

  const allAuthors = new Map();
  await Promise.all(
    selectedProjects.map(async (project) => {
      const projectAuthors = await fetchAuthors(project.id);
      projectAuthors.forEach((author) => allAuthors.set(author.id, author));
    })
  );

  const { selectedAuthor } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedAuthor',
      message: 'Выберите автора:',
      choices: Array.from(allAuthors.values()).map((author) => ({
        name: author.name,
        value: author,
      })),
    },
  ]);

  const { startDate, endDate } = await inquirer.prompt([
    {
      type: 'input',
      name: 'startDate',
      message: 'Введите начальную дату (YYYY-MM-DD):',
      validate: (input) => /\d{4}-\d{2}-\d{2}/.test(input),
    },
    {
      type: 'input',
      name: 'endDate',
      message: 'Введите конечную дату (YYYY-MM-DD):',
      validate: (input) => /\d{4}-\d{2}-\d{2}/.test(input),
    },
  ]);

  const mergeRequests = (
    await Promise.all(
      selectedProjects.map((project) =>
        fetchMergeRequests(
          project.id,
          new Date(startDate),
          new Date(endDate),
          selectedAuthor.username
        )
      )
    )
  ).flat();

  if (mergeRequests.length === 0) {
    console.error('Нет доступных MR.');
    return;
  }

  const authorName = selectedAuthor.name;
  createWordDocument(mergeRequests, authorName);
}

run();
