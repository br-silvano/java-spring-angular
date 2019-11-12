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
[Exemplo]
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
```shell

### Configuração
```shell
$ sudo nano /etc/environment
```
[Exemplo]
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
mvn clean package
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
`$ sudo nano /usr/share/applications/STS.desktop`
[Desktop Entry]
Name=STS
Comment=Spring Tool Suite
Exec=/opt/sts-bundle/sts-3.9.2.RELEASE/STS
Icon=/opt/sts-bundle/sts-3.9.2.RELEASE/icon.xpm
StartupNotify=true
Terminal=false
Type=Application
Categories=Development;IDE;Java;
