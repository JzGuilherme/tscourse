# Trilha de estudos: TypeScript do iniciante ao avancado

Este guia reorganiza os assuntos do video em uma sequencia de aprendizado. O arquivo `index.ts` contem a apostila comentada, exemplos compilaveis e exercicios para acompanhar cada etapa. Os trechos de React Native estao comentados porque este projeto nao instala essas dependencias.

## Como usar este material

1. Assista ao trecho indicado e leia o resumo correspondente.
2. Reescreva os exemplos sem copiar e observe os erros que o compilador aponta.
3. Faca os exercicios antes de consultar documentacao ou pedir ajuda.
4. Ao final de cada etapa, compile o projeto e explique em voz alta por que cada tipo foi escolhido.

## Preparacao do ambiente

O projeto ja tem TypeScript como dependencia de desenvolvimento. No terminal, dentro da pasta `Sample`, execute:

```sh
npm install
npx tsc --noEmit
```

`--noEmit` verifica os tipos sem substituir o `index.js` que ja existe. Para gerar uma versao JavaScript isolada do exemplo:

```sh
npx tsc index.ts --strict --target ES2020 --module commonjs --outDir dist
node dist/index.js
```

No uso diario, prefira `npx tsc --noEmit` para validar e deixe a compilacao gerar arquivos em uma pasta separada. O TypeScript verifica tipos antes da execucao; ele nao adiciona validacao automatica dos dados recebidos em tempo de execucao.

## Mapa do curso

### Etapa 1: Fundamentos

| Assunto | Trecho |
| --- | --- |
| O que e TypeScript e por que ele e importante | Introducao do video |
| Preparacao do ambiente | [02:27](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=147s) |
| Sintaxe basica e tipos | [08:07](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=487s) |
| Variaveis e tipos simples | [10:52](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=652s) |
| `any`, `unknown`, `never` e `void` | [15:41](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=941s) |
| Arrays e tuplas | [17:38](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=1058s) |

TypeScript e um superset de JavaScript: adiciona um sistema de tipos estatico e depois e compilado para JavaScript. Tipos ajudam ferramentas a encontrar incompatibilidades antes da execucao, melhoram autocomplete e documentam contratos. Eles nao garantem que uma API ou entrada de usuario esteja correta em runtime.

```ts
let courseName: string = "TypeScript";
let lessonCount = 12; // inferido como number
const isPublished = true; // inferido como boolean

const scores: number[] = [8, 9, 10];
const coordinates: [number, number] = [12, 30];
```

Use `const` por padrao e deixe o TypeScript inferir tipos simples. Anote parametros de funcoes, formatos publicos e casos em que a anotacao torna a intencao mais clara. `number` inclui inteiros e decimais; nao existe um tipo separado para inteiro.

Tipos especiais:

- `any` desativa a verificacao de tipo naquele valor; evite, pois a falta de seguranca se propaga.
- `unknown` aceita qualquer valor, mas exige verificacao antes de ser usado. E a escolha mais segura para dados externos.
- `void` indica que uma funcao nao fornece um valor util ao chamador.
- `never` representa algo que nao acontece, como uma funcao que sempre lanca erro ou um ramo impossivel depois de todos os casos serem tratados.
- `null` e `undefined` representam ausencia de valor e devem ser considerados com `strictNullChecks` (ativado por `strict`).

```ts
function printMessage(message: string): void {
  console.log(message);
}

function fail(message: string): never {
  throw new Error(message);
}

function printIfString(value: unknown): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  }
}
```

### Etapa 2: Modelagem de dados e funcoes

| Assunto | Trecho |
| --- | --- |
| Tipos de objetos e enums | [20:07](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=1207s) |
| Alias de tipo e interfaces | [22:13](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=1333s) |
| Unions e intersections | [24:42](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=1482s) |
| Declaracoes, expressoes e arrow functions | [26:47](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=1607s) |
| Tratamento de `null` e `undefined` | [31:59](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=1919s) |

Objetos descrevem dados nomeados. Propriedades podem ser opcionais com `?` ou somente para leitura com `readonly`.

```ts
interface User {
  id: number;
  name: string;
  email?: string;
  readonly createdAt: Date;
}

type UserId = string | number;
type Contact = { email: string } & { phone: string };
type LoadState = "idle" | "loading" | "success" | "error";
```

`interface` e `type` podem descrever objetos e ser estendidos. Uma interface pode ser reaberta e combinada (declaration merging), o que e util em algumas APIs e bibliotecas. `type` tambem representa unions, intersections, tuplas e tipos primitivos. Escolha o que comunica melhor o contrato; nao e correto dizer que um e sempre mais flexivel que o outro.

Prefira unions de literais para estados pequenos e previsiveis. `enum` tambem existe, mas pode gerar JavaScript e tem particularidades de runtime; use quando o projeto ou a API realmente se beneficiar disso.

Uma union (`A | B`) aceita uma das alternativas; uma intersection (`A & B`) exige as propriedades dos dois tipos. Para usar com seguranca uma union, refine-a com um type guard ou discriminante:

```ts
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function showResult(result: ApiResult<string>): string {
  if (result.success) {
    return result.data;
  }

  return result.error;
}
```

Funcoes podem ser declaradas, atribuidas a variaveis ou escritas como arrow functions. O compilador infere o retorno quando possivel. Aprenda tambem parametros opcionais, valores padrao, rest parameters e assinaturas de callback.

```ts
function add(a: number, b: number): number {
  return a + b;
}

const multiply = (a: number, b: number): number => a * b;
const greet = (name = "pessoa"): string => `Ola, ${name}`;
```

Com `strictNullChecks`, trate valores ausentes explicitamente. Use `?.` para acesso opcional, `??` para um valor alternativo apenas diante de `null`/`undefined` e guards quando a ausencia muda o fluxo. Evite `!` (non-null assertion) sem uma garantia real.

```ts
function getUserName(user: User | undefined): string {
  return user?.name ?? "Usuario anonimo";
}
```

### Etapa 3: Recursos intermediarios e avancados

| Assunto | Trecho |
| --- | --- |
| Generics e utility types | [29:39](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=1779s) |
| Novidades do TypeScript 5.x | [34:11](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=2051s) |
| Classes e modificadores de acesso | [36:44](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=2204s) |
| O operador `keyof` | [38:40](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=2320s) |
| Definitely Typed e bibliotecas externas | [40:51](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=2451s) |

Generics preservam a relacao entre os tipos de entrada e saida sem recorrer a `any`:

```ts
function identity<T>(value: T): T {
  return value;
}

function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}
```

Um constraint como `T extends { id: number }` limita o que um generic aceita. Utility types transformam tipos existentes: `Partial<T>` torna propriedades opcionais, `Pick<T, K>` seleciona propriedades, `Omit<T, K>` remove propriedades e `Record<K, V>` descreve um mapa de chaves e valores.

`keyof T` produz a union das chaves de `T`; `T[K]` consulta o tipo de uma propriedade. Juntos permitem APIs que mantem a relacao entre uma chave e seu valor:

```ts
function getProperty<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}
```

Tipos avancados para estudar depois: generics com multiplos constraints, conditional types (`T extends U ? X : Y`), mapped types (`{ [K in keyof T]: ... }`), template literal types, `infer`, overloads e tipos discriminados exaustivos.

Classes agrupam estado e comportamento. `public`, `protected` e `private` controlam acesso no sistema de tipos; `readonly` impede reatribuicao. Em JavaScript moderno tambem existem campos privados com `#`, cuja restricao e aplicada em runtime. Prefira interfaces e composicao quando uma hierarquia de classes nao trouxer beneficio claro.

```ts
class Counter {
  private value = 0;

  increment(): number {
    this.value += 1;
    return this.value;
  }
}
```

#### TypeScript 5.x

O trecho do curso apresenta novidades da familia 5.x, que mudou ao longo de varias versoes. Estude os recursos em relacao a versao instalada no projeto, sem tratar "5.x" como uma unica versao: a familia trouxe, entre outros, `const` type parameters, suporte padronizado a decorators e inferencia melhorada em diferentes contextos. Confirme disponibilidade e detalhes nas notas oficiais da versao usada antes de adotar um recurso.

#### Tipos de bibliotecas

Antes de instalar tipos, confira se a biblioteca ja inclui declarations TypeScript. Para pacotes JavaScript sem tipos incluidos, procure `@types/nome-do-pacote` no Definitely Typed, por exemplo `@types/node`. Instale somente o pacote correspondente e mantenha suas versoes alinhadas. Se nao houver tipos publicados, avalie criar uma declaracao local minima em vez de recorrer a `any` global.

### Etapa 4: TypeScript com React Native

| Assunto | Trecho |
| --- | --- |
| Configuracao de TypeScript em React Native | [43:15](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=2595s) |
| Componentes e hooks tipados | [45:46](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=2746s) |
| Estado e props | [47:55](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=2875s) |
| Navegacao tipada | [49:54](https://www.youtube.com/watch?v=nKbdBcIkpkk&t=2994s) |

O projeto atual nao instala React Native; esta etapa e conceitual ate voce criar ou abrir um app React Native. Use a configuracao recomendada pela versao do framework e pela ferramenta de navegacao escolhida.

Props e estado devem descrever os dados que o componente realmente recebe e mantem. Para estado simples, `useState` normalmente infere o tipo inicial; informe o generic quando o valor inicial nao for suficiente para inferir a union desejada.

```tsx
type GreetingProps = { name: string; subtitle?: string };

function Greeting({ name, subtitle }: GreetingProps) {
  return <Text>{subtitle ? `${name}: ${subtitle}` : name}</Text>;
}

const [selectedId, setSelectedId] = useState<number | null>(null);
```

Para navegacao, defina um param list por rota e use-o nos navegadores e nas props de tela conforme a documentacao da biblioteca instalada. Assim, nomes de rota e parametros ficam sincronizados; evite `any` para contornar os generics da biblioteca.

## Exercicios e projetos

1. Crie uma funcao `formatPrice` que receba um numero e devolva uma string em moeda brasileira.
2. Modele `Book` com `interface`, incluindo uma propriedade opcional `publishedYear` e uma propriedade somente leitura `isbn`.
3. Crie um tipo `Result<T>` discriminado para sucesso ou erro e trate ambos os ramos sem assertions.
4. Implemente `findById<T extends { id: number }>` e retorne `T | undefined`.
5. Use `keyof` para criar uma funcao que le uma propriedade de um objeto sem perder seu tipo.
6. Modele uma lista de tarefas com estados literais, filtros e atualizacao imutavel.
7. Projeto final: crie um catalogo de produtos com cadastro, busca, filtros e resultados de API simulados. Mantenha `strict` habilitado e valide toda entrada externa como `unknown`.

## Criterios para avancar

- **Iniciante:** tipa variaveis, arrays, objetos e funcoes; explica inferencia e tipos simples.
- **Intermediario:** modela unions, interfaces, nullability e callbacks; usa narrowing sem `any`.
- **Avancado:** escreve generics reutilizaveis, usa utility types e `keyof`, entende declarations de bibliotecas e configura contratos de UI/navegacao.

## Referencias

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript: Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html)
- [Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped)
