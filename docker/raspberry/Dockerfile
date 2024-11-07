FROM debian:latest

RUN useradd register -p root
COPY register.sh /home/register/register.sh
RUN apt-get update && apt-get install -y autossh lsof

EXPOSE 22

CMD ./home/register/register.sh