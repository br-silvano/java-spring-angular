# Node JS
[Documentação](https://nodejs.org/en/).

## Instalação
```shell
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ sudo apt-get update
$ sudo apt-get upgrade
```

### Validação
```shell
$ node -v
$ npm -v
```


# Angular CLI
[Documentação](https://cli.angular.io/).

## Instalação
```shell
$ sudo npm install -g @angular/cli
```

### Validação
```shell
$ ng -v
$ ng help
```


# Desenvolvimento

## Execução
```shell
$ ng serve
```

## Componente
```shell
$ ng generate component component-name
```
[Exemplos]
```shell
$ ng generate directive|pipe|service|class|module
```

## Publicação
```shell
ng build
```
[Artefatos]
```shell
$ dist/
ng build -prod
```
