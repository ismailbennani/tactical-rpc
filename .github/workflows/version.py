# Update the version entry of environment.prod.ts before build

import os.path
import json
import datetime
import math

if __name__ == "__main__":
  package_json_path = 'package.json'
  environment_path = 'src/environments/environment.prod.ts'

  if (not os.path.exists(package_json_path)):
    print(f'::error file={package_json_path}::Could not find package.json')
    exit(1)

  if (not os.path.exists(environment_path)):
    print(f'::error file={environment_path}::Could not find environment.ts')
    exit(1)

  with open(package_json_path, 'r') as f:
    package = json.load(f)
    version = package['version']

    print(f'::notice file={package_json_path},::Found package.json with version {version}')

    now = datetime.datetime.now()
    nowFloat = datetime.datetime.timestamp(now)
    nowMs = math.floor(nowFloat * 1000)

    newVersion = f'{version}~{nowMs}'

    print(f'::notice::New version: {newVersion}')
    print(f'::set-output name=version::{newVersion}')

  with open(environment_path, 'r+') as f:
    lines = f.readlines()

    for i in range(0, len(lines)):
      if 'version:' in lines[i]:
        lines[i] = f'  version: \'{newVersion}\'\n'

  with open(environment_path, 'w') as f:
    f.writelines(lines)
