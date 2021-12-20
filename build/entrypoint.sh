#!/bin/sh

set -u
set -o errexit
set -o pipefail
set -o nounset

supervisord -c /etc/supervisord.conf
