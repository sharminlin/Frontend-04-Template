const { exec, execSync } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora')

const { name: projectName, version: currentVersion } = require('../package');
const regVersion = /^\d+\.\d+\.\d+$/;
const regLineBreak = /\s/;
const getGitBranch = execSync('git name-rev --name-only HEAD', { encoding: 'utf-8' }).replace(regLineBreak, '');

inquirer.prompt([
  {
    type: 'confirm', //type：input, number, confirm, list, checkbox ... 
    name: 'isRelease', // key 名
    message: `${getGitBranch} - Do you need to release a version(current: ${currentVersion})`, // 提示信息
    default: false // 默认值
  },
  {
    type: 'input',
    name: 'releaseVersion',
    message: `please input next release version(current: ${currentVersion})`,
    when (question) {
      return question.isRelease
    },
    validate (version) {
      if (!regVersion.test(version)) {
        console.log(chalk.red(`\n [error!] The format of the version ${version} is incorrect, Please enter a format such as 0.0.1`))
        return false
      } else if (!isToBeGreaterThan(version, currentVersion)) {
        console.log(chalk.red(`\n [error!] The release version need to be greater than current version(${currentVersion})`))
        return false
      }
      return true
    }
  }
]).then(async answers => {
  const { isRelease, releaseVersion } = answers
  try {
    await stepForLint()

    if (!isRelease) {
      process.exit(0)
    }

    await stepForUpdateVersion(releaseVersion)
    await stepForChoreCommit(releaseVersion)
    process.exit(0)
  } catch (error) {
    console.log(chalk.red(error) + '\n')
    process.exit(1)
  }
})

// lint
async function stepForLint() {
  const spinner = ora('lint start...').start()
  try {
    await execCommand('yarn run lint')
    spinner.succeed(chalk.green(`[success!] lint success!`))
  } catch (error) {
    spinner.fail(chalk.red(`[error!] lint failed.`))
    return Promise.reject(error)
  }
}

// update vesion
async function stepForUpdateVersion(releaseVersion) {
  const spinner = ora('updated version').start()
  try {
    await command(`yarn version --no-git-tag-version --new-version ${releaseVersion}`)
    spinner.succeed(chalk.green(`[success!] ${projectName} version updated successfully to ${releaseVersion}`))
  } catch (error) {
    spinner.fail(chalk.red(`[error!] ${projectName} version update to ${releaseVersion} failed!`))
    return Promise.reject(error)
  }
}

// commit message
async function stepForChoreCommit(releaseVersion) {
  const spinner = ora('chore commit...').start()
  try {
    await command(`git add package.json && git commit -m "chore: bump version to ${releaseVersion} from ${currentVersion}"`)
    spinner.succeed(chalk.green('[success!] chore commit successfully'))
  } catch (error) {
    await command(`yarn version --no-git-tag-version --new-version ${currentVersion}`)
    spinner.fail(chalk.red(`[error!] chore commit failed.`))
    return Promise.reject(error)
  }
}

function execCommand(cmd, options = {}) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else {
        console.log(stdout)
        resolve(true)
      }
    })
  })
}

function isToBeGreaterThan(version, oldVersion) {
  const versionNumbers = version.split('.');
  const oldVersionNumber = oldVersion.split('.');

  for (let i = 0; i < 3; i++) {
    const number = Number(versionNumbers[i]);
    const oldNumber = Number(oldVersionNumber[i]);

    if (oldNumber === number) {
      continue;
    }
    return oldNumber < number
  }
  return version !== oldVersion
}
