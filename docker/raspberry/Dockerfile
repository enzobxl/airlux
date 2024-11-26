FROM debian:latest

# Ajouter un utilisateur et définir son mot de passe
RUN useradd register -p root

RUN mkdir -p /home/register

# Copier le script register.sh dans l'image
COPY ./register.sh /home/register/register.sh

RUN chmod +x /home/register/register.sh

# Redis
RUN apt-get update && apt-get install -y autossh lsof wget build-essential tcl
RUN wget http://download.redis.io/redis-stable.tar.gz
RUN tar xzf redis-stable.tar.gz
RUN apt-get install -y procps
RUN cd redis-stable && make
RUN cd redis-stable && make install
# RUN cd redis-stable && make test
RUN rm -rf redis-stable redis-stable.tar.gz /var/lib/apt/lists/*

# Exposer les ports nécessaires (22 pour SSH et 6379 pour Redis)
EXPOSE 22 6379

# Commande par défaut à l'exécution
CMD ["/home/register/register.sh"]
