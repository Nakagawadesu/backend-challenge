 ## Instalação
- Primeiro clone o Repositório
 ```bash
   git clone <https://github.com/nome-do-usuário/nome-da-aplicação>
```
  - Instale as depedências
```bash
   npm install
```
- Configure as variáveis de ambiente (cire um arquivo .env no diretório raiz e adicione as variáveis):
```typescript
NODE_ENV=development
PORT=3000
USERS_API_URL=http://localhost:8080/users
```

 ## Execução

 - Rodar a API mock com o Docker (recomnedado):
```bash
docker-compose up
```
Ou com o pacote NPM 

```bash
npm install -g json-server
cd config
json-server --watch db.json
```

 - Para rodar a aplicação em ambiente de desenvolvimento
```bash
npm install -g json-server
cd config
json-server --watch db.json
```
 > OBS:O CI/CD foi integrado utilizando o Github Actions e foram demonstados funcnionando no fim do terceiro vídeo

 ## Decisões Técnicas
 - A tentativa principal foi amnter uma arquitura e códigos limpos para garantir a escalabilidade futura.
 - Separação do Script src/app.ts e src/api/v1/server.ts
 - Decidi fazer desssa maneira pois assim ocorre a separação de responsabilidades, o app.ts é apeas o arquivo de entrada responsável por abrir o servidor em uma porta selecionada, e identificar se se trata de um ambiente de produçãoou de desenvolvimento, o arquivo server.tsé responsáevl por chamar os middlewares, que seriam as camadas de cada uma das rotas, assim fica mais exuto e entendível o código.
```typescript
   import express from "express";
import Logger from "./helpers/Logger";
import routes from "@routes/index";
import ResponseHandler from "@middlewares/Responsehandler";
Logger.groupEnd();
Logger.group("Server");

if (process.env.NODE_ENV === "development") {
  Logger.info(`Running on development mode`);
  require("dotenv").config();
} else if (process.env.NODE_ENV === "production") {
  Logger.info(`Running on production mode`);
}

const server = express();

server.use(express.json());
server.use("/api/v1", routes);
server.use(ResponseHandler.handle);
export default server;

```
 - Posteriormente o arquivos server.ts pode ser importado em routes por exemplo , para adicionar individualmetne os middlewares conforme necessário , deixando a applciação mais facil de escalar em funcionalidades por endpoint.
### O Logger
- O helper mais util de todos, já me ajudou a encontrar muitos bugs.
- o mais importante nele é o agrupamento.
- Ao agrupar logs no terminal fica muti facil entontrar qaul o responsável pelo erro, alémm disso as cores ajuda muito a identificar a natureza do lof de forma rápida
## Utils
- HttpStatusCode em src/utils/HttpStatusCode : eu fiz esse Enum para poder deixar o código mais legível , ele é utilizado em diversas partes do código , e também me serve como consulta rápida para saber qual código usar , meu favorito é o I_AM_A_TEAPOT -> 418
```typescript
  /**
   * This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol,
   * and is not expected to be implemented by actual HTTP servers. The RFC specifies this code should be returned by
   * teapots requested to brew coffee. This HTTP status is used as an Easter egg in some websites, including Google.com.
   */
  I_AM_A_TEAPOT = 418,
```
### helpers
- A separação de pequenas fucnções com responsabilidade única nos helpers foi feita para manter o código mais exuto e limpo, pois assim fazer alterações e encontrar bugs asssim como incorporar novos membros na equipe se torna mais fácil. caso fosse um bloco de código no controller executando todas as validações seria um pouco confusoe  caótico diminuindo a produtividade futuramente.
- Eu Fiz uma classe para o formatador de dados apenas para demonstar uma forma de utilizar OOP para organizar a egrupar funcionalidades seguindo os princípios SOlID
```typescript
import { emailRegex } from "./Regexes";

class DateFormatter {
  static dateFromUnixEpoch(unixEpoch: number): string {
    return new Date(unixEpoch).toISOString();
  }

  static obfuscator = (email: string): string => {
    if (RegExp(emailRegex).test(email) === false) {
      return "invalidEmailFormat";
    }
    const [user, domain] = email.split("@");
    const userLength = user.length;
    if (userLength <= 2) return email;
    const obfuscatedEmail = `${user.slice(0, 2)}${"*".repeat(
      userLength
    )}@${domain}`;

    return obfuscatedEmail;
  };

  static isNiucoDomain = (email: string): boolean => {
    const [, domain] = email.split("@");
    return domain === "niuco.com.br";
  };

  static formatEmail = (email: string): string => {
    if (DateFormatter.isNiucoDomain(email)) {
      return email;
    }
    return DateFormatter.obfuscator(email);
  };
}

export default DateFormatter;
```
-  Já no outro helper decidi fazer apenas funções oq ue tabmbém fucnciona e respeita o priemiro princípios solid, porém na hora de importar esssa funcionalidades é preciso raciocinar qual delas vai querer.
-  mesmo assim quando preciso delas e elas aparecem o código fica limpo e declarativo, muito importante dar nomes corretos a elas
-  Também utilizei de um dicionário ao invés de vários ifs 
```typescript
import { UserFromDatabase } from "../types/User";

const PayerDictionary: { [key: string]: boolean } = {
  viewer: false,
  system: false,
  editor: true,
  admin: true,
};

const isUserEnabled = (user: UserFromDatabase) => {
  let isEnabled = true;
  if (user.status === "disabled") {
    isEnabled = false;
  }
  return isEnabled;
};

const isUserPayerByRole = (user: UserFromDatabase) => {
  let isPayer = false;
  return (isPayer = PayerDictionary[user.role]);
};

const isUserPayer = (user: UserFromDatabase) => {
  return isUserEnabled(user) && isUserPayerByRole(user);
};

export { isUserEnabled, isUserPayerByRole, isUserPayer };

```
### Response handler e Response Assembler
- é muito importante padronizar op código hoje em dia  por conta do uso do copilot que analisa seu workspace para tentar adivinhar oque você vai escrever, por isso código despadronizado confunde ele deixando o trabalho mais lento, mais importante é enxugar ao máximo coisas que se repetem.
- pensando nisso criei dois middlewares  um que é sempre cahamdo por ultimo , por isso no arquivo server.ts ele está por ultimo no app.use()
- Isso porque ele é respoável por lidar com todos os tipos de status e quando o status não existe isso aocntece se tentar acessar um endpoint não existente , ele sabe lidar com esse casos:
```typescript
 try {
      Logger.groupEnd();
      res.status(req.status).json({
        payload: req.payload ? req.payload : null,
        message: req.message,
        details: req.details ? req.details : null,
      });
    } catch (error) {
      Logger.groupEnd();
      res.status(500).json({
        message: "Invalid URL",
      });
    }
  }
```
- Ele também faz os logs na cor correta , que pode não aprecer mas ajuda muito no desenvolvimento
```typescript

    if (req.status === 500) {
      req.log ? Logger.error(req.log) : null;
    } else if (req.status >= 400 && req.status < 500) {
      req.log ? Logger.warning(req.log) : null;
    } else {
      req.log ? Logger.info(req.log) : null;
    }
```
- O request Assembrle como o nome diz ele apenas monta a requisição , se a qualquer momento do seu controller você precisar enviar a resposta : (exemplo quando ocorre um throw error)
```
    Logger.groupEnd();
    return ResponseAssembler.assemble(req, next, {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
      details: `${error}`,
      log: "mensagem qualquer"
    });
```
- Na hora de desenvolver ajuda bastante , é facil de usar , fácil de ler, não contém depencia de pacotes e deixa o código bem apdronizado alavancando o uso do copilot.
## separação das interfaces
- Ao invés de delcarar interfaces de entidades da apicação logo acima onde são usadas decidi colocá-las na pasta types
```typescript

export interface UserReponse {
  id: string;
  name: string;
  email: string;
  lastActivity: string;
  isPayer: boolean;
  isActive: boolean;
}

export interface UserFromDatabase {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  last_activity: number;
}
```
- Ainda mais quando são tipos que são necessáriso várias veses  é importante pra facilitar o desenvolvimento e garantir escalabilidade
### Testes e Mocks
  - Escolhi manter um Mock da base de dados teste em src/common/db.ts
- A utilização de Mocks de dados e resposta da API(porta 8080) foi escolhido ao invés de rodar um container toda a vez pois, rodar cointeineres em um ambiente de CI/CD apesar de menos próximo da realidade consome menos recursos na plataforma escolhida, além disso para o escopo deste desafio , onde foi requisitado um CI/CD básico acredito ser mais cabível .
- Escrevi alguns Aliases dos comandos no package.json para facilitar comandos communs, muitas vezes se tratando de craição de indices em banco de dados ou outras opeações que ocorrem apenas quando você quer que occorram e não toda a vez que inicia aplicação por exemplo, costumo fazer isso, se torna bem prático .
 ### Api Design
 - escolhi declarar o endpoint base da API como /api/v1/... por ser uma boa prática principalmente relacionadas à manutenção, escalabilidade e clareza da API.
 - Utilizar /v1/, /v2/, etc., na URL permite que você faça alterações significativas na API sem quebrar a funcionalidade dos clientes que ainda dependem de versões antigas.
### Escalabilidade 
- Com a arquitetura escolhida o código é escalável da seguitne forma
- S empre que necessário uma nova funcnionalidade na API é basta criar um novo controller , o mesmo deve ter um nome significativo que explique oque faz
- Além disso sdeve se manter todas as micro perações dentro dele com responsábilidades únicas assim fica facil reutilizar , ampliar e validar , eles podem ser helpers, services middlewares dependendo da natureza, e como podem ser utilziadas e com que frequência
- A declaração de endpoinst na pasta routes pode ser amplida craindo scripts de roteamente para cada entidade conforme necessário , e todas elas sendo agrupadas no index.ts
- os testes devem ser impementados orientados para o endpooint e a organização deles devee sefeita da seguitne forma , por exemplo caso existisse uma entidade produto
- src/controllers/produtos/test/searchProductsByString.test.ts
- Com o sua de uma arquitetura adequada fica masi facil de escalar a aplciação sempre focando em deuzir linahs , transformar códgos que se repetem em funcções e mante-las com uma responsbilidade sempre que possível
- os testes também podem ajudar a aencontrar gargalos de performance , então sempre que possivel é interessante faze-los

 
