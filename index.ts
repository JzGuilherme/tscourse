// CURSO DE TYPESCRIPT: DO INICIANTE AO AVANCADO
// Este arquivo funciona como apostila comentada e como exemplo executavel.
// Leia uma secao por vez, altere os exemplos e rode `npx tsc --noEmit`.
// O TypeScript aponta problemas antes da execucao, mas nao valida dados externos
// automaticamente quando o programa esta rodando.

// ROTEIRO DO VIDEO
// Introducao: Exploring TypeScript: What It Is & Why It's Essential
// 02:27 Environment Setup
// 08:07 Basic Syntax and Types
// 10:52 Variables and Simple Types
// 15:41 Any, Unknown, Never, and Void
// 17:38 Arrays and Tuples
// 20:07 Object Types and Enums
// 22:13 Type Aliases vs. Interfaces
// 24:42 Union and Intersection Types
// 26:47 Functions
// 29:39 Generics and Utility Types
// 31:59 Null and Undefined
// 34:11 What's New in TypeScript 5.x
// 36:44 Classes and Access Modifiers
// 38:40 The Power of keyof
// 40:51 Definitely Typed
// 43:15-49:54 React Native, components, hooks, props, state, and navigation

// 1. O QUE E TYPESCRIPT E COMO CONFIGURAR
// TypeScript e JavaScript com verificacao estatica de tipos. O compilador remove
// as anotacoes de tipo e gera JavaScript. Tipos ajudam a encontrar incompatibilidades
// cedo, melhoram o autocomplete e documentam os contratos do codigo.
// Instale dependencias com `npm install`. Este projeto ja declara TypeScript.
// Use `npx tsc --noEmit` para verificar sem sobrescrever o index.js existente.
// Para gerar em uma pasta separada: `npx tsc index.ts --strict --target ES2020
// --module commonjs --outDir dist` e depois `node dist/index.js`.

// 2. VARIAVEIS, TIPOS SIMPLES E INFERENCIA
// `let` permite reatribuir; `const` impede reatribuir a variavel. Prefira const
// quando nao precisar reatribuir. O compilador infere os tipos pelo valor inicial.
let courseName: string = "TypeScript";
let lessonCount = 12; // Inferido como number; nao e necessario repetir o tipo.
const isPublished = true; // Inferido como boolean.

// Tipos primitivos comuns: string, number, boolean, bigint, symbol, null e undefined.
// O tipo number cobre inteiros e decimais; nao ha um tipo int separado.
const wholeNumber: number = 10;
const decimalNumber: number = 3.14;
const uniqueId: symbol = Symbol("id");

// 3. ANY, UNKNOWN, VOID E NEVER
// any aceita qualquer coisa e desliga a verificacao para aquele valor.
// Evite-o: erros podem passar pelo compilador sem aviso.
let unsafeValue: any = "texto";
unsafeValue = 42;

// unknown tambem aceita qualquer valor, mas exige uma verificacao antes do uso.
// E normalmente a melhor escolha para resposta de API, JSON ou erro desconhecido.
function printIfString(value: unknown): void {
  if (typeof value === "string") {
    // Depois do type guard, o TypeScript sabe que value e string neste bloco.
    console.log(value.toUpperCase());
  }
}

// void descreve uma funcao chamada pelo efeito colateral, sem valor util de retorno.
function logMessage(message: string): void {
  console.log(message);
}

// never representa um fluxo que nao termina normalmente, como lancar um erro.
function fail(message: string): never {
  throw new Error(message);
}

// 4. ARRAYS E TUPLAS
// Array guarda zero ou mais itens do mesmo tipo. `T[]` e `Array<T>` sao equivalentes.
const scores: number[] = [8, 9, 10];
const names: Array<string> = ["Ana", "Bruno"];

// Tupla descreve posicoes com tipos conhecidos; pode tambem restringir o tamanho.
const coordinates: [number, number] = [12, 30];
const readonlyCoordinates: readonly [number, number] = [4, 7];

// 5. TIPOS DE OBJETOS, TYPE ALIASES, INTERFACES E ENUMS
// Interface nomeia o formato de um objeto. `?` marca propriedade opcional;
// `readonly` impede reatribuicao dessa propriedade durante a verificacao estatica.
interface User {
  id: number;
  name: string;
  email?: string;
  readonly createdAt: Date;
}

const user: User = {
  id: 1,
  name: "Ana",
  createdAt: new Date(),
};

// Type alias cria um nome para qualquer tipo: primitivo, objeto, tupla ou combinacao.
type UserId = string | number;
type Point = { x: number; y: number };
type UserContact = { email: string } & { phone: string };

// Interface e type podem modelar objetos e ser estendidos. Interfaces podem ser
// declaradas mais de uma vez e se combinam (declaration merging), recurso usado
// por algumas bibliotecas. Type aliases sao necessarios para unions e outros tipos
// que nao sao apenas formatos de objeto. Escolha pela intencao, nao por uma regra
// falsa de que um e sempre mais flexivel que o outro.
interface Auditable {
  createdBy: string;
}

interface Auditable {
  updatedAt: Date;
}

const auditInfo: Auditable = {
  createdBy: "Ana",
  updatedAt: new Date(),
};

// Enum cria um conjunto de nomes associados a valores e pode gerar JavaScript.
// Para estados simples, uma union de literais costuma ser mais direta e leve.
enum Direction {
  North = "NORTH",
  South = "SOUTH",
}

const direction: Direction = Direction.North;
type LoadState = "idle" | "loading" | "success" | "error";
const currentState: LoadState = "loading";

// 6. UNION, INTERSECTION E TYPE GUARDS
// Union A | B aceita um valor que corresponda a uma das alternativas.
// Intersection A & B exige um valor que tenha as caracteristicas de ambas.
type Success<T> = { success: true; data: T };
type Failure = { success: false; error: string };
type ApiResult<T> = Success<T> | Failure;

function describeResult(result: ApiResult<string>): string {
  // O campo success e um discriminante: testar seu valor refina a union.
  if (result.success) {
    return result.data;
  }

  return result.error;
}

type Employee = { name: string; employeeId: number };
type DepartmentMember = Employee & { department: string };

// `typeof`, `instanceof`, verificacoes de propriedade e discriminantes sao formas
// comuns de narrowing. O teste em runtime permite ao compilador refinar o tipo.
function describeUnknownError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocorreu um erro desconhecido.";
}

// never tambem ajuda a verificar que todos os casos de uma union foram tratados.
type PaymentStatus = "pending" | "paid";

function assertNever(value: never): never {
  throw new Error(`Caso nao tratado: ${String(value)}`);
}

function describePayment(status: PaymentStatus): string {
  switch (status) {
    case "pending":
      return "Pagamento pendente";
    case "paid":
      return "Pagamento confirmado";
    default:
      return assertNever(status);
  }
}

// 7. FUNCOES: DECLARACAO, EXPRESSAO, ARROW, PARAMETROS E RETORNOS
// Anote parametros para definir o contrato. O retorno pode ser inferido, mas
// anota-lo em funcoes publicas pode tornar a intencao mais clara.
function add(a: number, b: number): number {
  return a + b;
}

// Function expression guarda a funcao em uma variavel.
const multiply = function (a: number, b: number): number {
  return a * b;
};

// Arrow function oferece sintaxe concisa e captura o `this` do contexto externo.
const greet = (name = "pessoa"): string => `Ola, ${name}`;

// `?` indica parametro opcional; parametros com valor padrao tambem podem ser omitidos.
function formatName(firstName: string, lastName?: string): string {
  return lastName ? `${firstName} ${lastName}` : firstName;
}

// Rest parameter coleta zero ou mais argumentos do mesmo tipo em um array.
function sumAll(...values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

// Tipo de funcao descreve os argumentos e o retorno esperado de um callback.
type Comparator<T> = (left: T, right: T) => number;
const compareNumbers: Comparator<number> = (left, right) => left - right;

// 8. NULL E UNDEFINED
// Com strictNullChecks (incluido em strict), null e undefined sao tipos distintos.
// Explicite que um valor pode faltar e trate essa possibilidade antes de usa-lo.
function getUserName(person: User | undefined): string {
  // `?.` para o acesso opcional; `??` usa fallback somente para null/undefined.
  return person?.name ?? "Usuario anonimo";
}

// Evite `!` (non-null assertion) sem uma garantia concreta: ele apenas silencia
// o compilador e nao verifica o valor durante a execucao.

// 9. GENERICS E UTILITY TYPES
// Generics permitem reutilizar logica sem perder o tipo especifico da entrada.
function identity<T>(value: T): T {
  return value;
}

function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

// `extends` e um constraint: o generic precisa ter ao menos a propriedade id.
function findById<T extends { id: number }>(items: readonly T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

// Utility types transformam tipos existentes sem repetir suas propriedades.
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  status: "available" | "out-of-stock";
}

type NewProduct = Omit<Product, "id">; // Todas as propriedades menos id.
type ProductSummary = Pick<Product, "id" | "name" | "price">; // Seleciona campos.
type ProductDraft = Partial<Product>; // Todas as propriedades passam a ser opcionais.
type ProductById = Record<number, Product>; // Mapa de chaves number para Product.

// 10. KEYOF E ACESSO INDEXADO
// keyof T cria uma union com os nomes das propriedades de T.
// T[K] consulta o tipo da propriedade K e mantem a relacao entre chave e valor.
function getProperty<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}

// 11. TIPOS AVANCADOS PARA APROFUNDAR
// Mapped types percorrem as chaves de outro tipo para construir um tipo novo.
type Optional<T> = { [K in keyof T]?: T[K] };

// Conditional types escolhem um tipo com base em uma condicao de tipos.
type ElementOf<T> = T extends readonly (infer Item)[] ? Item : T;

// Outros assuntos avancados: template literal types, overloads, tipos recursivos,
// infer, satisfies, const assertions e distribuicao de conditional types.

// 12. CLASSES E MODIFICADORES DE ACESSO
// Classes agrupam estado e comportamento. public e o padrao; private e protected
// controlam acesso pelo sistema de tipos. readonly impede reatribuicao da propriedade.
class Counter {
  private value = 0;

  increment(): number {
    this.value += 1;
    return this.value;
  }
}

// `private` do TypeScript e uma restricao de tipos. Campos `#private` do JavaScript
// tambem aplicam privacidade em runtime. Prefira composicao a herancas desnecessarias.

// 13. NOVIDADES DO TYPESCRIPT 5.x
// A familia 5.x inclui varias versoes; consulte as release notes da versao instalada.
// Exemplos de recursos introduzidos nessa familia incluem const type parameters,
// decorators padronizados e melhorias progressivas na inferencia. Nem todo recurso
// pertence a todas as versoes 5.x. O projeto declara TypeScript ^7.0.2 no package.json.

// 14. DEFINITELY TYPED E PACOTES DE TERCEIROS
// Primeiro verifique se a propria biblioteca ja inclui declarations TypeScript.
// Se ela nao incluir, procure os tipos comunitarios `@types/nome-do-pacote`.
// Exemplo de instalacao para tipos do Node: `npm install -D @types/node`.
// Confira compatibilidade de versoes. Se nao houver declarations, considere escrever
// uma declaracao local minima; evite declarar um modulo inteiro como any sem necessidade.

// 15. REACT NATIVE: COMPONENTES, HOOKS, PROPS, ESTADO E NAVEGACAO
// Este workspace nao instala React Native; os exemplos abaixo sao conceituais e ficam
// comentados para que este arquivo continue compilando sem dependencias de UI.
// Crie/abra um app React Native e siga as instrucoes da versao do framework e da
// biblioteca de navegacao antes de usar esses trechos.
//
// type GreetingProps = { name: string; subtitle?: string };
// function Greeting({ name, subtitle }: GreetingProps) {
//   return <Text>{subtitle ? `${name}: ${subtitle}` : name}</Text>;
// }
// Props tipadas definem os dados que o componente pai deve fornecer.
//
// const [selectedId, setSelectedId] = useState<number | null>(null);
// O generic de useState e util quando o estado comeca null mas depois guarda um number.
//
// type RootStackParamList = {
//   Home: undefined;
//   Details: { productId: number };
// };
// Associe esse param list ao navigator e aos tipos de tela da biblioteca escolhida.
// Assim, nome de rota e parametros ficam verificados pelo TypeScript.

// 16. EXEMPLO INTEGRADO: ESTOQUE DE PRODUTOS
// A classe combina interface, union, generic com constraint e tipo de retorno opcional.
class Inventory<T extends { id: number }> {
  private readonly items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  find(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  list(): readonly T[] {
    return this.items;
  }
}

const inventory = new Inventory<Product>();
const firstProduct: Product = {
  id: 1,
  name: "Caderno",
  price: 24.9,
  category: "Papelaria",
  status: "available",
};

const secondProduct: NewProduct = {
  name: "Caneta",
  price: 4.5,
  category: "Papelaria",
  status: "out-of-stock",
};

inventory.add(firstProduct);
inventory.add({ ...secondProduct, id: 2 });

const selectedProduct = inventory.find(1);
if (selectedProduct) {
  console.log(`Produto encontrado: ${selectedProduct.name}`);
}

const selectedName = getProperty(firstProduct, "name");
console.log(`Propriedade obtida com keyof: ${selectedName}`);
console.log(describeResult({ success: true, data: firstProduct.name }));
console.log(describeResult({ success: false, error: "Produto indisponivel" }));
console.log(describePayment("paid"), direction, currentState);
console.log(add(2, 3), multiply(2, 3), greet(), formatName("Ana"));
console.log(sumAll(1, 2, 3), compareNumbers(3, 5), first(scores));
console.log(identity(courseName), getUserName(user), inventory.list().length);
printIfString("TypeScript");
logMessage(`Aula ${lessonCount}: ${courseName}; publicado: ${isPublished}`);
console.log(wholeNumber, decimalNumber, uniqueId, coordinates, readonlyCoordinates);
console.log(names, unsafeValue, user.id, auditInfo.createdBy, direction === Direction.North);
console.log(findById(inventory.list(), 2)?.name, fail === undefined, assertNever === undefined);

// 17. EXERCICIOS PARA PRATICAR
// 1. Escreva formatPrice(valor: number): string usando Intl.NumberFormat.
// 2. Modele Book com interface, isbn readonly e publishedYear opcional.
// 3. Crie Result<T> discriminado e trate sucesso e erro sem any ou assertions.
// 4. Escreva uma funcao generica que filtra produtos por status.
// 5. Use keyof para implementar uma funcao de leitura de propriedade tipada.
// 6. Modele tarefas com status literal, filtros e atualizacao imutavel.
// 7. Projeto final: catalogo com cadastro, busca, filtros e resposta de API simulada.
// Criterio avancado: mantenha strict ativo e trate toda entrada externa como unknown.

// REFERENCIAS
// Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
// Release notes: https://www.typescriptlang.org/docs/handbook/release-notes/overview.html
// Definitely Typed: https://github.com/DefinitelyTyped/DefinitelyTyped