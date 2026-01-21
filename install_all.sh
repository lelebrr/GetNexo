#!/bin/bash

# Script para instalar todas as alternativas Ubuntu aos serviços AWS do roadmap
# Baseado em ROADMAP_UBUNTU.md

set -e  # Parar em erro

echo "Atualizando repositórios..."
sudo apt update

echo "Instalando pacotes APT comuns..."
sudo apt install -y \
  qemu-kvm libvirt-daemon-system virt-manager \
  docker.io \
  slurm-wlm \
  apache2 mysql-server php libapache2-mod-php \
  lvm2 \
  nfs-kernel-server \
  bacula \
  postgresql postgresql-contrib \
  mongodb \
  clickhouse-server clickhouse-client \
  redis-server \
  netplan.io \
  nginx \
  bind9 \
  haproxy \
  freeipa-client \
  openscap-scanner \
  lynis \
  slapd ldap-utils \
  kafka \
  hadoop \
  mosquitto mosquitto-clients \
  rabbitmq-server \
  activemq \
  curl openssh-server ca-certificates tzdata perl \
  jenkins \
  ansible \
  prometheus \
  grafana \
  auditd \
  nmap \
  vsftpd \
  asterisk \
  mycroft-core \
  nodejs npm \
  gnuradio \
  godot3 \
  ffmpeg \
  obs-studio \
  blender \
  python3-pip \
  python3-opencv \
  festival \
  git \
  unzip

echo "Habilitando e iniciando serviços APT..."
sudo systemctl enable libvirtd docker apache2 postgresql mongod clickhouse-server redis-server mosquitto rabbitmq-server jenkins prometheus grafana-server auditd vsftpd
sudo systemctl start libvirtd docker apache2 postgresql mongod clickhouse-server redis-server mosquitto rabbitmq-server jenkins prometheus grafana-server auditd vsftpd

echo "Adicionando repositórios externos..."

# Neo4j
wget -O - https://debian.neo4j.com/neotechnology.gpg.key | sudo apt-key add -
echo 'deb https://debian.neo4j.com/ stable latest' | sudo tee /etc/apt/sources.list.d/neo4j.list

# InfluxDB
wget -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/os-release
echo "deb https://repos.influxdata.com/${ID} ${VERSION_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list

# Cassandra
echo "deb http://www.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
wget -qO - https://www.apache.org/dist/cassandra/KEYS | sudo apt-key add -

# Kubernetes
curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/kubernetes-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list

# HashiCorp Vault
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com jammy main" | sudo tee /etc/apt/sources.list.d/hashicorp.list

# GitLab
curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | sudo bash

# Ethereum
sudo add-apt-repository -y ppa:ethereum/ethereum

# Unity (opcional, para Sumerian)
wget -qO - https://hub.unity3d.com/linux/keys/public | sudo apt-key add -
sudo sh -c 'echo "deb https://hub.unity3d.com/linux/repos/deb stable main" > /etc/apt/sources.list.d/unityhub.list'

sudo apt update

echo "Instalando pacotes de repositórios externos..."
sudo apt install -y neo4j influxdb cassandra kubelet kubeadm kubectl vault gitlab-ce ethereum unityhub

echo "Habilitando serviços externos..."
sudo systemctl enable neo4j influxdb cassandra kubelet vault

sudo systemctl start neo4j influxdb cassandra kubelet vault

echo "Instalando binários via wget..."

# MinIO
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/
sudo useradd -r minio-user -s /sbin/nologin
sudo mkdir /usr/local/share/minio
sudo chown minio-user:minio-user /usr/local/share/minio

# Keycloak
wget https://github.com/keycloak/keycloak/releases/download/18.0.0/keycloak-18.0.0.tar.gz
tar -xzf keycloak-18.0.0.tar.gz
cd keycloak-18.0.0
# Nota: Para iniciar, executar ./bin/standalone.sh em background se desejado

# OpenSearch
wget https://artifacts.opensearch.org/releases/bundle/opensearch/2.6.0/opensearch-2.6.0-linux-x64.tar.gz
tar -xzf opensearch-2.6.0-linux-x64.tar.gz
cd opensearch-2.6.0
# Executar ./bin/opensearch em background

# Trino
wget https://repo1.maven.org/maven2/io/trino/trino-server/403/trino-server-403.tar.gz
tar -xzf trino-server-403.tar.gz
cd trino-server-403
# ./bin/launcher start

# OSSEC
wget https://github.com/ossec/ossec-hids/archive/3.6.0.tar.gz
tar -xzf 3.6.0.tar.gz
cd ossec-hids-3.6.0
sudo ./install.sh

cd ..

echo "Instalando pacotes Python..."
pip3 install apache-airflow jupyter tensorflow scikit-learn spacy nltk rasa scikit-surprise qiskit

echo "Iniciando containers Docker..."

# OpenFaaS
docker run -d -p 8080:8080 --name faas -e basic_auth=true -e secret_mount_path=/run/secrets -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/openfaas/faas:0.24.0

# Kong
docker run -d --name kong-database -p 5432:5432 -e POSTGRES_PASSWORD=kong -e POSTGRES_USER=kong -e POSTGRES_DB=kong postgres:9.6
docker run -d --name kong -e KONG_DATABASE=postgres -e KONG_PG_HOST=localhost -e KONG_PG_PASSWORD=kong -e KONG_CASSANDRA_CONTACT_POINTS=localhost kong:latest

# Metabase
docker run -d -p 3000:3000 --name metabase metabase/metabase

# Hasura
docker run -d -p 8080:8080 -e HASURA_GRAPHQL_DATABASE_URL=postgres://username:password@host:port/dbname hasura/graphql-engine:latest

# Jaeger
docker run -d --name jaeger -p 16686:16686 -p 14268:14268 jaegertracing/all-in-one:latest

# SonarQube
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts

# Nexus
docker run -d -p 8081:8081 --name nexus sonatype/nexus3

# Wazuh
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | sudo apt-key add -
echo "deb https://packages.wazuh.com/4.x/apt/ stable main" | sudo tee /etc/apt/sources.list.d/wazuh.list
sudo apt update
sudo apt install wazuh-manager

echo "Configurando GitLab..."
sudo gitlab-ctl reconfigure

echo "Instalando Node-RED..."
sudo npm install -g node-red

echo "Instalação concluída. Verifique logs e inicie serviços manuais se necessário."