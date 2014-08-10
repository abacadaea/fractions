#!/bin/bash

mkdir -p /tmp/fractions
PID_FILE=/tmp/fractions/fractions.pid
LOG_FILE=/tmp/fractions/fractions.log
SOCKET=/tmp/fractions/fractions.socket

export PYTHON_PATH=~/Websites/fractions/src:~/fractions/src

uwsgi --stop $PID_FILE
uwsgi -s $SOCKET --module server --callable app --chmod-socket=666 --pidfile $PID_FILE --logto $LOG_FILE &
