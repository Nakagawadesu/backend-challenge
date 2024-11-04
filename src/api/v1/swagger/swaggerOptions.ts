const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Desafio Niuco 2024",
      version: "1.0.0",
      description:
        "Documentação da API do desafio da Niuco para desenvolvedor backend Node.js. A aplicação é responsável por integrar-se com a API do SaaS Mock da Niuco, coletar dados dos usuários, aplicar regras específicas e exibir as informações formatadas conforme os requisitos do desafio.\n\n" +
        "**Requisitos de Formatação:**\n\n" +
        "- **ID**: Identificador único do usuário.\n" +
        "- **Nome**: Nome completo do usuário.\n" +
        "- **Email**: E-mail ofuscado se o domínio não for `niuco.com.br`. Apenas os primeiros e últimos 2 caracteres do alias são visíveis, junto com o domínio.\n" +
        "- **Data de Última Atividade**: Convertida do formato Unix Epoch para ISO-8601 (fuso horário UTC).\n" +
        "- **Pagante**: Flag que indica se o usuário é pagante:\n" +
        "  - `viewer` e `system`: Não pagantes.\n" +
        "  - `editor` e `admin`: Pagantes.\n" +
        "  - **Regra Adicional**: Usuários inativos (status `disabled`) nunca são pagantes, mesmo que o papel indique o contrário.\n" +
        "- **Ativo/Inativo**: Determinado pelo campo `status`. O usuário está ativo se o `status` for `enabled`, caso contrário, é inativo.\n\n" +
        "**Regras de Processamento:**\n\n" +
        "- A verificação de inatividade ocorre antes de qualquer outra regra.\n" +
        "- A última atividade é convertida para o formato ISO-8601.\n" +
        "- O email é ofuscado para domínios diferentes de `niuco.com.br`.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local para desenvolvimento",
      },
    ],
  },
  apis: ["./src/api/v1/routes/*.ts"],
};

export default swaggerOptions;
