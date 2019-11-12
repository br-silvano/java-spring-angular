# Java

## Instalação
```shell
$ sudo apt-get update
$ sudo add-apt-repository ppa:webupd8team/java
$ sudo apt-get update
$ sudo apt-get install oracle-java8-installer
```

### Configuração
```shell
$ sudo update-alternatives --config java
$ sudo nano /etc/environment
```
[Exemplo]<br/>
JAVA_HOME="/usr/lib/jvm/java-8-oracle"
```shell
$ source /etc/environment
```

### Validação
```shell
$ echo $JAVA_HOME
$ java -version
```


# Maven
[Download](https://maven.apache.org/download.cgi).

## Instalação
```shell
$ sudo tar xzvf apache-maven-3.5.2-bin.tar.gz
$ sudo cp -rf apache-maven-3.5.2 /opt
```

### Configuração
```shell
$ sudo nano /etc/environment
```
[Exemplo]<br/>
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/opt/apache-maven-3.5.2/bin"
```shell
$ source /etc/environment
```

### Validação
```shell
$ mvn -version
```

### Publicação
```shell
$ mvn clean package
$ java -jar target/curso-api-0.1.0.jar
```


# Spring Tool Suite
[Download](https://spring.io/tools/sts/all).

## Instalação
```shell
$ sudo tar xzvf spring-tool-suite-3.9.2.RELEASE-e4.7.2-linux-gtk-x86_64.tar.gz
$ sudo cp -rf sts-bundle /opt
```

### Configuração
```shell
$ sudo nano /usr/share/applications/STS.desktop
```
[Desktop Entry]<br/>
Name=STS<br/>
Comment=Spring Tool Suite<br/>
Exec=/opt/sts-bundle/sts-3.9.2.RELEASE/STS<br/>
Icon=/opt/sts-bundle/sts-3.9.2.RELEASE/icon.xpm<br/>
StartupNotify=true<br/>
Terminal=false<br/>
Type=Application<br/>
Categories=Development;IDE;Java;<br/>
