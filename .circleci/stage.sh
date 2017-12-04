#!/bin/bash

COMPONENT_NAME="rise-twitter"
VERSION=$(cat version)
echo "staging $VERSION"

git clone git@github.com:Rise-Vision/private-keys.git
gcloud auth activate-service-account 452091732215@developer.gserviceaccount.com --key-file ./private-keys/storage-server/rva-media-library-ce0d2bd78b54.json
gsutil -m cp -r dist/* gs://install-versions.risevision.com/staging/components/$COMPONENT_NAME/$VERSION/
gsutil setmeta -r -h "Cache-Control:private, max-age=0" gs://install-versions.risevision.com/staging/components/$COMPONENT_NAME/$VERSION/*
gsutil -m acl ch -r -u AllUsers:R gs://install-versions.risevision.com/staging/components/$COMPONENT_NAME/$VERSION/*
