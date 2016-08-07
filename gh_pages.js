import 'shelljs/global';
import Git from 'git-repository';
import SimpleGit from 'simple-git';
import path from 'path';
import YAML from 'yamljs';
import fs from 'fs';

const yaml = YAML.parse(fs.readFileSync(path.join(__dirname, '_config.yml'), { encoding: 'utf8' }));

const conf = {
	url: yaml.deploy.repo,
	name: 'origin',
	branch: yaml.deploy.branch
};

const public_path = path.join(__dirname, 'public');

function run(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, (code, output) => {
			if (code !== 0) {
				return reject(code);
			}
			resolve();
		});
	});
}

async function main() {
	try {
		try {
			const stat = fs.statSync(public_path);
			if (!stat.isDirectory()) {
				fs.mkdirSync(public_path);
			}
		} catch (e) {
			fs.mkdirSync(public_path);
		}
		const repo = await Git.open(public_path, { init: true });
		await repo.setRemote(conf.name, conf.url);
		// Fetch the remote repository if it exists
		const simpleGit = SimpleGit(public_path);

		if ((await repo.hasRef(conf.url, conf.branch))) {
			await repo.fetch(conf.name);
			await repo.reset(`${conf.name}/${conf.branch}`, { hard: true });
			await repo.clean({ force: true });
			await simpleGit.checkout(conf.branch);
		} else {
			await simpleGit.checkout(['-b', conf.branch]);
		}


  	await run(`hexo generate -f`);

  	await repo.add('--all .');
  	await repo.commit(`${conf.branch} update`);
  	await repo.push(conf.name, conf.branch, { force: true });

	} catch (e) {
		console.log('error =', e, e.stack);
	}
	process.exit(0);
}

main();
