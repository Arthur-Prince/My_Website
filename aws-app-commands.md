
# entra no aws
ssh -i fbgh54rt.pem ubuntu@2600:1f16:1596:df00:9175:327c:6c87:dff0


# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# adiciona o ssl para decriptar arquivos secretos
sudo apt-get install -y openssl && sudo apt-get clean

# clona o repositorio/ usar so na primeira vez
git clone https://github.com/Arthur-Prince/My_Website.git


# encripta secret.properties
openssl enc -aes-256-cbc -salt -pbkdf2 -in src/main/resources/config/secrets.properties -out src/main/resources/config/secrets.enc -k "sua-senha"

# prepara projeto para rodar
git pull

openssl enc -aes-256-cbc -d -salt -pbkdf2 -in src/main/resources/config/secrets.enc -out src/main/resources/config/secrets.properties -k "sua-senha"

# roda o docker

sudo docker build -t website:1.2.0 -t website:latest .

sudo docker run -d --name website -p 8080:8080 website

