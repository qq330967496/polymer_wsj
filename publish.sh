#!/bin/bash
sh /d/apache-tomcat-7.0.68/bin/shutdown.sh
rm -r /d/apache-tomcat-7.0.68/webapps/wsj_system
cp -r ./src/webapp /d/apache-tomcat-7.0.68/webapps/wsj_system
sh /d/apache-tomcat-7.0.68/bin/startup.sh
tail -f /d/apache-tomcat-7.0.68/logs/catalina.out