#!/bin/bash
grep -rh --color "\.jqx" * | sed -e 's/\(.*\)jqx\(.*\)/jqx\2/' | cut -d'(' -f1 | sort -u

