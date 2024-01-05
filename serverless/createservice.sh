#!/bin/bash

# TODO: Validate the $1 is a single word

echo "Auditing common folder"
BASESHA=`sha1sum basetemplate/src/common/baseserver.ts | cut -d ' ' -f 1`
sha1sum */src/common/baseserver.ts | awk -v ref_hash="$BASESHA" '{ if ($1 != ref_hash) { print $2 " is different from reference "; }}'
BASESHA=`sha1sum basetemplate/src/common/bigquery.ts | cut -d ' ' -f 1`
sha1sum */src/common/bigquery.ts | awk -v ref_hash="$BASESHA" '{ if ($1 != ref_hash) { print $2 " is different from reference "; }}'

if [ "x$1" == "x" ];
then
    echo "Missing service name";
    exit 1;
fi

echo "Creating service $1"
mkdir "$1"

cp -r basetemplate/src "$1/"
cp -r basetemplate/package.json "$1/"
cp -r basetemplate/tsconfig.json "$1/"
sed -i s/BASENAMETEMPLATE/$1/g "$1/package.json"
