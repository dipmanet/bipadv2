if [[ $CI_COMMIT_REF_SLUG == 'staging' ]]; then
    SERVER_IP=$STAGING_SERVER_IP
    SERVER_USER=$STAGING_SERVER_USER
elif [[ $CI_COMMIT_REF_SLUG =~ ^release-.+$ ]]; then
    SERVER_IP=$PRODUCTION_SERVER_IP
    SERVER_USER=$PRODUCTION_SERVER_USER
fi

which ssh-agent || ( apk add --update openssh )
eval $(ssh-agent -s)
echo "$SSH_PRIVATE_KEY" | ssh-add - > /dev/null
ssh -tt -o "StrictHostKeyChecking=no" $SERVER_USER@$SERVER_IP << EOF
    cd ~/client_staging
    git fetch --all
    git reset --hard origin/$CI_COMMIT_REF_SLUG

    cd ~/client_staging/src/vendor/react-store/
    git fetch --all
    git reset --hard origin/$REACT_STORE_BRANCH

    cd ~/client_staging/src/vendor/osm-liberty/
    git fetch --all
    git reset --hard origin/$OSM_LIBERTY_BRANCH

    cd ~/client_staging
    yarn build
    exit 0
EOF

