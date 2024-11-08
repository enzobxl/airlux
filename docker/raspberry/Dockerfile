FROM debian:latest

RUN useradd register -p root
RUN apt-get update && apt-get install -y autossh lsof jq curl openssh-client

RUN mkdir /home/register && ssh-keygen -t rsa -b 2048 -f /home/register/device_key -q -N ""

COPY register.sh /home/register/register.sh
RUN chmod +x /home/register/register.sh

EXPOSE 22

CMD ["/home/register/register.sh"]
