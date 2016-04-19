#!/bin/sh

# Get the last tag and build and upload the las version tagged
# Ask miguel.barrenechea@vizzuality.com for more info

# START HERE

# Step 0: copy/move/add this script to .git/hooks/pre-push (create if this file does not exist) and give proper permissions, run chmod +x .git/hooks/pre-push

# 1st: check we're working on the master branch, if we're not then the script finish (exit 1)
# 2nd: get the last tag/release 
# so, in case it doesn't have anything different than the existing file, we have something to commit
# 3rd: git add and commit the file generated
# 5th: the script ends with exit 0

protected_branch='hook'
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ $protected_branch = $current_branch ]
then
	echo $process.env.AWS_ACCESS_KEY_ID
	echo $(printenv)
	# set access of AMAZON
	aws_access_key_id='AKIAJ54ZF2ZAUSLMKELQ'
	aws_secret_access_key='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'

	# set version
	version=$(git describe --abbrev=0 --tags)
	node_env='production'

  echo 'uploading script with version '$version' to AS3'

 #  # build last version
	# AWS_ACCESS_KEY_ID=$aws_access_key_id AWS_SECRET_ACCESS_KEY=$aws_secret_access_key VERSION=$version NODE_ENV=$node_env npm run build

	# # after doing this, we should add the version tagged and commit it
 #  echo 'adding and commiting the file created'
 #  git add .
 #  git commit -m'Version: '$version' uploaded'

  exit 0 # push will execute
else
  echo 'Pushing, no file attached'
  exit 0 # push will execute with no file on it
fi
