FROM mysql:5.7

ADD initdb.sql /docker-entrypoint-initdb.d

RUN usermod -u 1000 mysql