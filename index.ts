type LexerResult = {
  tokens: Token[];
  error?: string;
};

type TokenRecognizer = (input: string) => RecognitionResult | null;

type RecognitionResult = {
  token: Token;
  consumed: number;
};

enum TokenType {
  NUMBER = "NUMBER",
  PLUS = "PLUS",
  MINUS = "MINUS",
  MULTIPLY = "MULTIPLY",
  DIVIDE = "DIVIDE",
  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
  EOF = "EOF",
}

class Token {
  constructor(public type: TokenType, public value: string) {}
}

const operators: Record<string, TokenType> = {
  "+": TokenType.PLUS,
  "-": TokenType.MINUS,
  "*": TokenType.MULTIPLY,
  "/": TokenType.DIVIDE,
};

const parenthesis: Record<string, TokenType> = {
  "(": TokenType.LPAREN,
  ")": TokenType.RPAREN,
};

const tokenize = (input: string): LexerResult => {
  const tokens: Token[] = [];
  let position = 0;

  const recognizers: TokenRecognizer[] = [
    recognizeNumber,
    recognizeOperator,
    recognizeParenthesis,
    recognizeLetter,
  ];

  while (position < input.length) {
    const char = input[position];

    if (isWhitespace(char)) {
      position++;
      continue;
    }

    const result = tryRecognizers(recognizers, input.slice(position));

    if (result) {
      tokens.push(result.token);
      position += result.consumed;
    } else {
      return {
        tokens: [],
        error: `Unrecognized token at position ${position + 1}: '${char}'`,
      };
    }
  }

  return { tokens };
};

const tryRecognizers = (
  recognizer: TokenRecognizer[],
  input: string
): RecognitionResult | null => {
  for (const recognize of recognizer) {
    const result = recognize(input);
    if (result) return result;
  }

  return null;
};

const recognizeNumber: TokenRecognizer = (input: string) => {
  if (!isDigit(input[0])) return null;

  let consumed = 0;
  while (consumed < input.length && isDigit(input[consumed])) {
    consumed++;
  }

  return {
    token: new Token(TokenType.NUMBER, input.slice(0, consumed)),
    consumed,
  };
};

const recognizeOperator: TokenRecognizer = (input: string) => {
  const tokenType = operators[input[0]];

  if (!tokenType) return null;

  return {
    token: new Token(tokenType, input[0]),
    consumed: 1,
  };
};

const recognizeParenthesis: TokenRecognizer = (input: string) => {
  const tokenType = parenthesis[input[0]];

  if (!tokenType) return null;

  return {
    token: new Token(tokenType, input[0]),
    consumed: 1,
  };
};

const recognizeLetter: TokenRecognizer = (input: string) => {
  if (!isLetter(input[0])) return null;

  let consumed = 0;

  while (consumed < input.length && isLetter(input[consumed])) {
    consumed++;
  }

  return {
    token: new Token(TokenType.NUMBER, input.slice(0, consumed)),
    consumed,
  };
};

const isDigit = (char: string): boolean => char >= "0" && char <= "9";

const isLetter = (char: string): boolean =>
  (char >= "A" && char <= "Z") || (char >= "a" && char <= "z");

const isWhitespace = (char: string): boolean => char === " ";

const lexer = (input: string): void => {
  const result = tokenize(input);

  if (result.error) {
    console.error(result.error);
  } else {
    console.log("Tokens:", result.tokens);
  }
};

lexer("34+ 6 + 99 SS@");
