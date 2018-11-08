const gulp = require('gulp');
const zip = require('gulp-zip');
const unzip = require('gulp-unzip');
const gulpSequence = require('gulp-sequence');
const eslint = require('gulp-eslint');
const fs = require('fs');
const exec = require('child_process').exec;
const serverlessGulp = require('serverless-gulp');
const commandLineArgs = require('command-line-args');
const del = require('del');
const optionDefinitions = [{ name: 'env', alias: 'e', type: String }];
const cmdoptions = commandLineArgs(optionDefinitions);

/* Config for production - master branch */
const ProductionSkillConfig = {
  skill_env_name: 'prod',
  alexa_app_name: 'Goodnight Kiddo',
  table_name: 'goodnight-kiddo',
  bucket_name: 'goodnight-kiddo-prod',
  region: 'us-east-1',
  lambda_function_name: 'goodnight-kiddo-prod',
  description: 'Goodnight kiddo production skill',
  secret_key_id: process.env.AWS_SECRET_ACCESS_KEY,
  access_key_id: process.env.AWS_ACCESS_KEY_ID,
};

const StagingSkillConfig = {
  skill_env_name: 'staging',
  alexa_app_name: 'Goodnight Kiddo',
  table_name: 'goodnight-kiddo-staging',
  bucket_name: 'goodnight-kiddo-staging',
  region: 'us-east-1',
  lambda_function_name: 'goodnight-kiddo-staging',
  description: 'Goodnight kiddo staging environment skill',
  secret_key_id: process.env.AWS_SECRET_ACCESS_KEY,
  access_key_id: process.env.AWS_ACCESS_KEY_ID,
};

const ITSkillConfig = {
  skill_env_name: 'it',
  alexa_app_name: 'Goodnight Kiddo',
  table_name: 'goodnight-kiddo-it',
  bucket_name: 'goodnight-kiddo-it',
  region: 'us-east-1',
  lambda_function_name: 'goodnight-kiddo-it',
  description: 'Goodnight kiddo IT environment skill',
  secret_key_id: process.env.AWS_SECRET_ACCESS_KEY,
  access_key_id: process.env.AWS_ACCESS_KEY_ID,
};

const DevelopmentSkillConfig = {
  skill_env_name: 'dev',
  alexa_app_name: 'Goodnight Kiddo',
  table_name: 'goodnight-kiddo-dev',
  region: 'us-east-1',
  description: 'Goodnight kiddo development skill',
  secret_key_id: process.env.AWS_SECRET_ACCESS_KEY,
  access_key_id: process.env.AWS_ACCESS_KEY_ID,
};

var skillconfig;
switch (cmdoptions.env) {
  case 'prod':
  skillconfig = ProductionSkillConfig;
  break;
  
  case 'st':
  skillconfig = StagingSkillConfig;
  break;

  case 'it':
  skillconfig = ITSkillConfig;
  break;

  case 'dev':
  skillconfig = DevelopmentSkillConfig;
  break;

  default:
  skillconfig = DevelopmentSkillConfig;
}

var paths = {
  javascript: ['index.js'],
  config: 'goodnightKiddoSkillConfig.json',
  serverless: ['serverless.yml']
};

// generate alexa skill configuration
gulp.task('default', function(cb) {
  if (!('env' in cmdoptions)) {
    console.error('❌ Provide a token (-e) with environment name.');
    process.exit();
  } else {
    gulpSequence(['createconfig'], cb);
  }
});

// sequence: run unit tests with unit test configuration and generate eslint report
gulp.task('test', function(cb) {
  return gulpSequence('createconfigtest', 'runtest', 'lint', cb);
});


// generate es lint report, configured in .eslintrc.json
gulp.task('lint', () => {
  return gulp.src(paths.javascript)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

// sequence: package a single archive suitable for deployment to aws lambda
// see serverless.yml for configuration of packaging
gulp.task('deploy', function(cb) {
  if (!('env' in cmdoptions)) {
    console.error('❌  Provide a token (-e) with environment name. Example "gulp deploy -e it"');
    process.exit();
  } else {
    return gulpSequence('createconfig', 'modclean', 'serverlessDeploy', cb);
  }
});

// to set the environment and database details for the skill
// see goodnightKiddoSkillConfig.json file
gulp.task('createconfig', function(cb) {
  if (!('env' in cmdoptions)) {
    console.error('❌  Provide a token (-e) with environment name. Example "gulp createconfig -e it"');
    process.exit();
  } else {
    console.log('✅ creating goodnightKiddoSkillConfig.json file.');
    return fs.writeFile(paths.config, JSON.stringify(skillconfig), cb);
  }
});

// remove unnecessary files from our node_modules to save disk space
gulp.task('modclean', function(cb) {
  return exec('./node_modules/.bin/modclean -r --no-progress', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

// https://www.npmjs.com/package/serverless-plugin-optimize
gulp.task('serverlessDeploy', () => {
  return gulp.src(paths.serverless, { read: false })
  .pipe(serverlessGulp.exec('deploy',{ stage: cmdoptions.env}));
});

// Create a project zip file to upload manually to lambda
// check dist folder
gulp.task('dist', function(cb) {
  if (!('env' in cmdoptions)) {
    console.error('❌  Provide a token (-e) with environment name. Example "gulp deploy -e it"');
    process.exit();
  } else {
    return gulpSequence('createconfig', 'modclean', 'delete-dist', 'package', 'unzip-optimized', 'zip-optimized', 'clean', 'remove', cb);
  }
});

// generate an optimized, single file version of our alexa skill js codebase
// https://www.npmjs.com/package/serverless-plugin-optimize
gulp.task('package', () => {
  return gulp.src(paths.serverless, {
    'read': false
  })
  .pipe(serverlessGulp.exec('package', {
    'package': 'tmp-pkg'
  }));
});

// extract js file in a subdirectory, intended for a new zip archive at the top level
gulp.task('unzip-optimized', function() {
  return gulp.src('./tmp-pkg/goodnight-kiddo.zip')
  .pipe(unzip())
  .pipe(gulp.dest('./tmp-ozip'));
});

// delete previous build while creating new build
gulp.task('delete-dist', function(){
  return del(['dist/'+ skillconfig.goodnight_kiddo_env_name + '_skill_lambda' + '.zip']);
});

// zip an optimized js file at the top level of the archive
gulp.task('zip-optimized', () => {
  return gulp.src('tmp-ozip/_optimize/'+ skillconfig.bucket_name +'/index.js')
  .pipe(zip(skillconfig.goodnight_kiddo_env_name + '_skill_lambda' + '.zip'))
  .pipe(gulp.dest('dist'));
});

// delete tmp folder after zip and unzip
gulp.task('clean', function() {
  return del(['tmp-ozip/**', 'tmp-pkg/**']);
});

// Remove the existing s3 files, cloudformation stack and lambda function
gulp.task('remove', () => {
  if (!('env' in cmdoptions)) {
    console.error('❌  Provide a token (-e) with environment name. Example "gulp remove -e it"');
    process.exit();
  } else {
    gulp.src(paths.serverless, { read: false })
    .pipe(serverlessGulp.exec('remove', { stage: cmdoptions.env }));
  }
});
