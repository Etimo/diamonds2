#!/bin/bash

echo "Working directory: $(pwd)"

# Create a sed script-file for replacing "___ENV_VARS___" with "$ENV_VARS"
# so that they can be replaced by the 'envsubst' program.
touch /.env.sed
variable_names=$(grep "^[^#]" /.env | cut -f1 -d= | xargs)
for v in $variable_names; do
  echo "s/___${v}___/\\\$${v}/g" >> /.env.sed
done

shopt -s globstar
subst_variables=$(grep "^[^#]" /.env | cut -f1 -d= | xargs -I {} printf "\${} " | xargs)
echo "Substitution variables: $subst_variables"

substitute() {
  echo "Substituting variables in $1"
  sed -i -f /.env.sed "$1"
  envsubst "$subst_variables" < "$1" > "$1.substituted"
  mv -v "$1.substituted" "$1"
}

# Replace the variables with the actual environment variables
for f in ./**/*.js; do
  substitute "$f"
done
substitute /etc/nginx/nginx.conf

echo "Starting nginx"
nginx -g 'daemon off;'
