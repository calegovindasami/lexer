# Lexer Implementation - Detailed Step-by-Step Guide

## Step 1: Define Your Token Structure

### What You're Doing
Creating a data structure to represent each "piece" your lexer finds. Think of tokens as labeled boxes - each box contains a piece of text and a label saying what kind of piece it is.

### Why This Matters
Without a consistent way to represent tokens, your lexer has nowhere to put its results. This structure is what you'll hand off to a parser later. A **token** is the fundamental unit that lexers produce - it's like saying "I found the word 'apple' and it's a noun" instead of just "I found the letters a-p-p-l-e".

### What You Need to Build
A token needs two essential pieces of information:
- **Type**: What category this piece belongs to (NUMBER, PLUS, etc.)
- **Value**: The actual text that was found ("123", "+", etc.)

You'll also need to define all your token types upfront. For arithmetic expressions, you need: NUMBER, PLUS, MINUS, MULTIPLY, DIVIDE, LPAREN, RPAREN.

### Clear Outcome - Step 1 Complete When:
You can create individual token instances and they contain both a type and a value. You should be able to make a token representing the number 42, a token representing the plus symbol, and a token representing a left parenthesis. If someone asks "what token represents the text '123'?" you can confidently answer "a NUMBER token with value '123'".

---

## Step 2: Build the Core Lexer Loop

### What You're Doing
Creating the "engine" that moves through your input text character by character. This is like reading a book - you need to keep track of where you are and what you're looking at.

### Why This Matters
This loop is the heart of your lexer. Everything else just plugs into this basic "look at character, make decision, move forward" pattern. The **lexer** itself is just a machine that steps through text systematically - no magic, just methodical examination of each character.

### What You Need to Build
Your lexer needs to manage state: it holds the input string, tracks the current position (like a bookmark), and can examine the current character. You need a main function that starts at the beginning and visits every character until reaching the end.

The core pattern is: look at current character → decide what to do → move to next character → repeat until done.

You need helper functions to "peek" at the current character (what am I looking at?) and to advance to the next position (move the bookmark forward).

### Clear Outcome - Step 2 Complete When:
You can feed your lexer any string and it will visit every character from start to finish without crashing. It doesn't need to create tokens yet - just prove it can traverse the entire input. Test with "ABC" and verify it examines 'A', then 'B', then 'C', then recognizes it's done.

---

## Step 3: Handle Single-Character Tokens

### What You're Doing
Teaching your lexer to recognize symbols that are exactly one character long. These are the "easy" tokens because you just need to match the character exactly.

### Why This Matters
Single-character tokens are your lexer's building blocks. Master these simple cases before handling the complex multi-character cases like numbers. This step teaches you the fundamental decision-making pattern your lexer will use.

### What You Need to Build
Inside your main loop, you need decision logic. When you look at the current character, you ask a series of questions: "Is it a '+'? Then create a PLUS token. Is it a '-'? Then create a MINUS token." And so on for all single-character operators and parentheses.

After creating each token, you must advance to the next character. This is crucial - if you don't advance, you'll get stuck looking at the same character forever.

### Clear Outcome - Step 3 Complete When:
Input `"+-*/()"` produces exactly six tokens in the correct order: PLUS, MINUS, MULTIPLY, DIVIDE, LPAREN, RPAREN. Each token should have the correct value ("+", "-", etc.). If you input just `"*"`, you get exactly one MULTIPLY token.

---

## Step 4: Handle Numbers

### What You're Doing
Teaching your lexer to recognize sequences of digits as a single NUMBER token. Unlike single-character tokens, numbers can be multiple characters long, so you need to "look ahead" and collect digits until you find something that's not a digit.

### Why This Matters
This is your first **multi-character token**. The pattern you learn here (keep reading while condition is true) applies to many other complex tokens. You're learning how to handle **lookahead** - the ability to consume multiple characters for one token.

### What You Need to Build
When you encounter a digit, you can't immediately create a token because you don't know if more digits follow. You need to start a "collection phase" where you gather consecutive digits into a string. Only when you hit a non-digit do you know the number is complete.

The tricky part: after collecting a multi-character token, your position is already pointing to the character AFTER the number. Don't advance again or you'll skip the next character.

### Clear Outcome - Step 4 Complete When:
Input `"123"` produces one NUMBER token with value "123". Input `"12+34"` produces three tokens: NUMBER("12"), PLUS("+"), NUMBER("34"). Input `"5"` produces one NUMBER token with value "5". Most importantly, input `"42+7"` should not skip the "+" or the "7".

---

## Step 5: Skip Whitespace

### What You're Doing
Teaching your lexer to ignore spaces, tabs, and other "invisible" characters that don't affect the meaning of your expression.

### Why This Matters
`"12+34"` and `"12 + 34"` should produce identical tokens. **Whitespace** is just formatting - it helps humans read code but doesn't change the meaning. Your lexer needs to be a good citizen and ignore formatting differences.

### What You Need to Build
Add another case to your decision logic: when you encounter a space or tab, simply advance to the next character without creating any token. This is called "consuming" or "skipping" whitespace.

You need to recognize different types of whitespace: spaces, tabs, and potentially newlines (though for arithmetic expressions, you might treat newlines the same as spaces).

### Clear Outcome - Step 5 Complete When:
Input `"12 + 34"` produces exactly the same three tokens as `"12+34"`: NUMBER("12"), PLUS("+"), NUMBER("34"). Input with multiple spaces like `"  123   +   456  "` should also work correctly. Whitespace at the beginning, middle, or end of input should be handled gracefully.

---

## Step 6: Handle End of Input

### What You're Doing
Ensuring your lexer stops cleanly when it reaches the end of the input string, without crashing or getting confused.

### Why This Matters
A robust lexer must handle the **boundary condition** of running out of input. This seems trivial but is where many bugs hide. Your lexer needs to recognize "I'm done" and exit gracefully.

### What You Need to Build
Logic to detect when you've reached the end of the input string. Your main loop should terminate when there are no more characters to examine. You also need to handle the case where you're in the middle of collecting a multi-character token (like a number) when you hit the end.

Consider edge cases: what if the input is an empty string? What if it ends with whitespace?

### Clear Outcome - Step 6 Complete When:
Any valid input terminates cleanly without errors or infinite loops. Empty string input should produce an empty list of tokens. Input ending with a complete token (like `"123"`) should work. Input ending with whitespace (like `"123 "`) should also work.

---

## Step 7: Basic Error Handling

### What You're Doing
Deciding what happens when your lexer encounters a character it doesn't recognize, like `@`, `#`, or `%`.

### Why This Matters
Real-world input often contains unexpected characters. A professional lexer needs a strategy for handling invalid input rather than just crashing. This teaches you about **error recovery** - how to fail gracefully.

### What You Need to Build
A decision about what to do with unrecognized characters. You have several options:
- Throw an error immediately (strict approach)
- Create an ERROR token and continue (lenient approach)  
- Skip the character and keep going (very lenient)

Choose one approach and implement it consistently. The strict approach is often best for learning because it forces you to be precise about what you accept.

### Clear Outcome - Step 7 Complete When:
Invalid input like `"12@34"` either throws a clear, helpful error message or produces tokens that include some representation of the error (like an ERROR token). Your lexer doesn't crash or produce confusing results. You can explain your error handling strategy and why you chose it.