FROM debian:latest

# Create the directory for the 'register' user
RUN mkdir -p /home/register

# Create the 'register' user and its home directory
RUN useradd -m register -p root

RUN apt-get update && apt-get install -y dos2unix

# Copier le script register.sh dans l'image
COPY ./register.sh /home/register/register.sh
RUN dos2unix /home/register/register.sh


RUN chmod +x /home/register/register.sh

RUN apt-get update && apt-get install -y autossh lsof wget build-essential tcl curl redis
# Redis
RUN redis-server -v
# RUN wget http://download.redis.io/redis-stable.tar.gz
# RUN tar xzf redis-stable.tar.gz
# RUN apt-get install -y procps
# RUN cd redis-stable && make
# RUN cd redis-stable && make install
# RUN cd redis-stable && make test
# RUN rm -rf redis-stable redis-stable.tar.gz /var/lib/apt/lists/*

# Exposer les ports nécessaires (22 pour SSH et 6379 pour Redis)
EXPOSE 22 6379

# Commande par défaut à l'exécution
# CMD tail -f /dev/null
CMD ["/home/register/register.sh"]
