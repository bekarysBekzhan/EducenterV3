const {exec} = require('child_process');

const cudePushRun = () => {
  //Educenter
  let name = 'Educenter';
  let android = '-Android';
  let ios = '-IOS';
  let bashCommand = '';

  const readline = require('readline-sync');

  let chooseOS = readline.question('1. iOS\n2. Android\n3. all\n');

  if (chooseOS == 1) {
    bashCommand = `appcenter codepush release-react -a Educenter/${name}${ios} -d Production`;
    console.log(bashCommand);
  } else if (chooseOS == 2) {
    bashCommand = `appcenter codepush release-react -a Educenter/${name}${android} -d Production`;
    console.log(bashCommand);
  } else if (chooseOS == 3) {
    bashCommand = `appcenter codepush release-react -a Educenter/${name}${ios} -d Production && appcenter codepush release-react -a Educenter/${name}${android} -d Production`;
    console.log(bashCommand);
  } else {
    console.log('ERROR');
    return;
  }

  exec(bashCommand, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('STDOUT: \n' + stdout);
    console.log('STDERR: \n' + stderr);
  });
};

cudePushRun();
