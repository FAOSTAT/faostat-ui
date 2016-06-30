
import sys, os

root = "/work/prod/nginx/cache/faostat/v1"

# matching search
check_codes_domains = 'domain_codes=FS'
check_data_domains = '/QC'

for path, subdirs, files in os.walk(root):
    for name in files:
        #print os.path.join(path, name)
        filepath = os.path.join(path,name)
        with open(filepath, 'r') as f:
            for line in f:
                if (check_codes_domains in line) or (check_data_domains in line):
                    print "hit", filepath, line
                    os.remove(filepath)
                    break