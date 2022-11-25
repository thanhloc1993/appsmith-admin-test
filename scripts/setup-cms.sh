#!/bin/bash
set -e
set -x

BO_FLAVOR="$CMS_FLAVOR"

echo "flavor $BO_FLAVOR"
echo "checkout $FE_REF"

 
folder=./packages/cms


if [[ ! -d "$folder" ]]; then
    git clone https://github.com/manabie-com/school-portal-admin.git $folder
fi

cd $folder


git reset --hard && git fetch && git checkout "$FE_REF" && git pull

cd ../../

rm -f ./packages/cms/start-cms.sh || true
rm -f ./packages/cms/build-cms.sh || true

# Something we dont pass `BO_FLAVOR` it will understand that we copy all folder
rm -rf ./packages/cms/environments/.env || true
rm -f ./packages/cms/environments/.env || true

cp -R ./scripts/start-cms.sh ./packages/cms/start-cms.sh
cp -R ./scripts/build-cms.sh ./packages/cms/build-cms.sh
cp -R ./packages/cms/environments/$BO_FLAVOR ./packages/cms/environments/.env