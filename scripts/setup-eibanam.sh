#!/bin/bash

# Color codes
CYAN='\033[1;36m'
NC='\033[0m'

printf "\n${CYAN}Please read the project's README or Conflunece before running this script:${NC}\n"
printf "${CYAN}https://manabie.atlassian.net/wiki/spaces/TECH/pages/437847006/Required+Setup+Eibanam${NC}\n\n"

while true; do
    read -p "Do you want to proceed? (y/n) " yn
    case $yn in
    [yY])
        echo "Setup initiated."
        break
        ;;
    [nN])
        echo "Setup aborted."
        exit
        ;;
    *) echo "Invalid response." ;;
    esac
done

# setup GITHUB_TOKEN env var
if [[ -z "$GITHUB_TOKEN" ]]; then
    echo "Enter your Github PAT: "
    read PAT
    export GITHUB_TOKEN=$PAT
    echo "export GITHUB_TOKEN=$PAT" >>~/.bashrc
    source ~/.bashrc
fi

# check env var
if [[ -z "$GITHUB_TOKEN" ]]; then
    echo "GITHUB_TOKEN is missing."
    exit 1
fi

# collect data for .env.local
echo "Enter the Unleash Client Key: "
read CLIENT_KEY

set -x

# install snapd
echo -e "${CYAN}install snapd${NC}"
sudo apt update
sudo apt install snapd

# install node
echo -e "${CYAN}install node${NC}"
sudo snap install node --classic
node --version

# install make command
echo -e "${CYAN}install make command${NC}"
sudo apt-get update
sudo apt-get install build-essential

# install flutter
echo -e "${CYAN}install flutter${NC}"
sudo snap install flutter --classic
flutter --version

# downgrade flutter
echo -e "${CYAN}downgrade flutter${NC}"
cd $(flutter sdk-path)/bin
git checkout 3.3.6
flutter --version
cd -

# setup docker repo
echo -e "${CYAN}setup docker repo${NC}"
sudo apt-get remove docker docker-engine docker.io containerd runc
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null

# install docker engine + docker-compose
echo -e "${CYAN}install docker engine + docker-compose${NC}"
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo docker run hello-world

# enable docker experimental
echo -e "${CYAN}enable docker experimental${NC}"
echo "{
    \"experimental\": true
}" | sudo tee /etc/docker/daemon.json

# setup docker to run without sudo
echo -e "${CYAN}setup docker to run without sudo${NC}"
sudo usermod -aG docker $USER
newgrp docker <<END
set -x
docker run hello-world

# setup git config
echo -e "${CYAN}setup git config${NC}"
git config --global url."https://${GITHUB_TOKEN}:x-oauth-basic@github.com/".insteadOf git@github.com:
git config --global url."https://".insteadOf git://
git config --global --add url."https://${GITHUB_TOKEN}:x-oauth-basic@github.com/manabie-com".insteadOf "https://github.com/manabie-com"

# setup .env.local
echo -e "${CYAN}setup .env.local${NC}"
printf "TEACHER_FLAVOR=manabie_teacher_staging
LEARNER_FLAVOR=manabie_learner_staging
CMS_FLAVOR=.env.manabie.staging
FE_REF=develop
ME_REF=develop
UNLEASH_CLIENT_KEY=$CLIENT_KEY
PLATFORM=WEB
ENV=staging" >.env.local

echo -e "${CYAN}setup local libraries and github${NC}"
# setup local libraries and github
make setup

echo -e "${CYAN}setup cms${NC}"
# setup cms
make setup-cms

echo -e "${CYAN}setup teacher and learner app${NC}"
# setup teacher and learner app
make setup-teacher-learner

echo -e "${CYAN}setup docker images${NC}"
# setup docker images
make setup-docker-images
END

set +x

echo -e "\n${CYAN}The setup is complete${NC}"
echo -e "In the root of this project, the file ${CYAN}.env.local${NC} has been generated."
echo -e "The default branch is ${CYAN}develop${NC}"
echo -e "To run e2e test on other branches, edit the ${CYAN}FE_REF${NC} and ${CYAN}ME_REF${NC} properties of the file."
echo -e "The default environment is ${CYAN}staging${NC}"
echo -e "To run e2e test on other environments, edit the ${CYAN}ENV${NC} property of the file."
echo -e "After editing the file, make sure to rerun ${CYAN}make setup-cms${NC} and ${CYAN}make setup-teacher-learner${NC}"
