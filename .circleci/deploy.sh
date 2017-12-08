#!/bin/bash

COMPONENT_NAME="rise-twitter"
VERSION=$(cat version)
echo "deploying $VERSION"

git clone git@github.com:Rise-Vision/private-keys.git
gcloud auth activate-service-account 452091732215@developer.gserviceaccount.com --key-file ./private-keys/storage-server/rva-media-library-ce0d2bd78b54.json

mkdir -p manifests
gsutil cp gs://install-versions.risevision.com/display-modules-*.json manifests

find manifests -name "*.json" -exec node ./node_modules/common-display-module/update-module-version.js '{}' $COMPONENT_NAME $VERSION 0 "component" \;
gsutil cp manifests/*.json gs://install-versions.risevision.com/staging/components/$COMPONENT_NAME/$VERSION
gsutil setmeta -h "Cache-Control:private, max-age=0" gs://install-versions.risevision.com/staging/components/$COMPONENT_NAME/$VERSION/*
gsutil setmeta -h "Content-Disposition:attachment" gs://install-versions.risevision.com/staging/components/$COMPONENT_NAME/$VERSION/*.sh
gsutil acl ch -u AllUsers:R gs://install-versions.risevision.com/staging/components/$COMPONENT_NAME/$VERSION/*
gsutil cp -r -p gs://install-versions.risevision.com/staging/components/$COMPONENT_NAME/$VERSION/* gs://install-versions.risevision.com/backups/components/$COMPONENT_NAME/$VERSION
gsutil -m cp -r -p gs://install-versions.risevision.com/staging/components/$COMPONENT_NAME/$VERSION/* gs://install-versions.risevision.com/components/$COMPONENT_NAME/
gsutil -m cp -r -p gs://install-versions.risevision.com/staging/components/$COMPONENT_NAME/$VERSION/* gs://install-versions.risevision.com/releases/components/$COMPONENT_NAME/$VERSION
