FROM mysql:5.7

RUN usermod -u 1000 mysql

ADD initdb.sql /docker-entrypoint-initdb.d
