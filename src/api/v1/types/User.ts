// ID
// Nome
// Email (ofuscado conforme regra abaixo)
// Data de última atividade (em formato ISO-8601)
// Flag para indicar se o usuário é pagante ou não
// Flag para determinar se o usuário está ativo ou não

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
