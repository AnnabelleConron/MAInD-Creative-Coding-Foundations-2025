# Lesson 1
## Naming convention

Every language has its naming convention recommendation, but some naming rules and styles generally apply for better code **readability**.

[Wikipedia article about it](https://en.wikipedia.org/wiki/Naming_convention_(programming))

### Naming rules

**“Throw-away” variables**

For a “throw-away” variable, like the one used in a for loop, it’s common practice to use one-letter naming:

```jsx
// short naming of throw-away variables (let i)

for(let i = 0; i < 10; i++) {
	console.log(i);
}
```

**Meaningful naming**

For variables or functions that are used multiple times in the code, it makes sense to name them in a meaningful way in order to help with the understanding of the logic of the code:

```jsx
// DO!
// meaningful naming

let hourlyPayRate = 200;
let hoursWorked = 5.5;
let payCheck = hourlyPayRate * hoursWorked;

console.log("The current paycheck amount is : " + payCheck);

// DON'T!
// same result, but without a meaningful naming; it is way harder to
// understand what is going on in the logic of the code!

let value1 = 200;
let total = 5.5;
let count = value1 * total;

console.log("The current paycheck amount is : " + count);
```

### Naming formats

Programming languages recommend naming styles for different elements. Among many, the most common naming formats are the following:

- **🐫 camelCase**: thisIsMyVariable
- **🐍 snake_case**: this_is_my_variable
- 🥙 **kebab-case**: this-is-my-variable
- **PascalCase, UpperCamelCase:** ThisIsMyVariable
- **flatcase**: thisismyvariable
- **UPPERCASE, SCREAMINGCASE**: THISISMYVARIABLE
- **ALL_CAPS, SCREAMING_SNAKE_CASE**: THIS_IS_MY_VARIABLE

### Naming for CSS and JS

During this course, we will apply this naming convention for CSS and JS:

```css
/* CSS */
/* 🥙 kebab-case */

#main-paragraph {
	font-size: 1.5rem;
}

.best-quotes {
	font-style: italic;
}
```

```jsx

// JS

// 🐫 lowerCamelCase
// function, methods, and variables

let currentUser = undefined;
const subtractionCalculator = (a, b) => a - b;

// 🐍 SCREAMING_SNAKE_CASE
// constant values

const MAX_SCORE = 12;

// 🐫 UpperCamelCase
// classes

class ~~B~~ouncingBox {
	constructor(height, width) {
		this.height = height;
		this.width = width;
	}
}
```
# Data Types

In computer science and computer programming, a **data type** (or simply **type**) is a collection of data values specified by a set of possible values and allowed operations on those values.

Most programming languages support basic data types like:

| **Integers** numbers | Positive and negative numbers without comma | … -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, … |
| --- | --- | --- |
| **Floating** numbers | positive and negative numbers with a comma | 1.254, -10.7, 3.1416, 15002.5, … |
| **Characters** | individual characters | ‘a’, ‘!’, ‘$’, ‘B’, ‘Z’, ‘8’, ‘.’, ‘=’, ‘k’, … |
| **Strings** | a sequence of characters | “Hi, I’m a series of characters, aka a String.” |
| **Booleans** | it can only have one out of two possible values | true or false |

Every programming language also has more data types specific to it.

### Data type size

Every data type defines how much space in the memory will be required to store it. When a variable is declared of a particular data type, a certain amount of space (bytes) in the memory is reserved for it (memory allocation).

Here are some examples of some programming languages:

```jsx
// JS
let number = 10; // integer
let character = 'J'; // character
let point_number = 3.1416; // float
let message = "Hello!"; // string
```

```python
# Python
test = True  # boolean type
number = 10  # integer type
point_number = -3.1416 # float number
message = "Hello world!"  # string type
```

```cpp
// C++
int number = 10; // size 4 bytes, -2,147,483,648 to 2,147,483,647
char character = 'A'; // size 1 byte, 0 to 255
long double big_number = -1209978080; // size 12 bytes, -1.1×10^4932 to 1.1×10^4932
float point_number = -56.563; // size 4 bytes, -3.4×10^38 to 3.4×10^38
```

```php
// PHP
$number = 10; // integer
$message = "Hi there!"; // string
$test = False; // boolean
$first_character = 'k'; // character
$point_number = 3.1416; // float
```

# Variables

In computer programming, a **variable** is an abstract storage location paired with an associated **symbolic name**, which contains a certain quantity of **data** (or object) referred to as a **value**.

Simpler: **a variable is a named container for a value of a specific data type.**

// ADD VARIABLE Datatype name and value schema!
Variable declaration
For a variable to exist, it has to be declared in the code:
// JS

let my_varaible;   // the value CAN be changed afterward

const my_fix_varaible;   // the value CANNOT be changed afterward

# Code debugging (console.log)

Debugging is a core part of code and software development.

A bug 🪲 (from which the term “debugging” comes) is an error in the code that prevents the code from properly functioning.

It is called a bug because when computers still used to have relays instead of transistors, bugs could get between the relays' electrical contacts and cause a malfunction during code execution.

Debugging is narrowing down and finding the errors to fix them.

A good approach is to “print” or “log” values and status inside the code to see if the behavior is as expected.

It’s better to start from the beginning to the end of the code and verify that things work until they don’t anymore. There, it’s where a possible problem exists, and you can narrow it down and further investigate to fix it.

The most helpful tool is to log or print the parameters and values on a console or terminal to understand what is happening.

In JS, there is the console.log() command for that:

```jsx
// JS
console.log()
```

The console.log can output multiple type of data:

```jsx
// print some text
console.log("Hello");    // on the console/terminal, the word Hello appears

// print a variable
const course_name = "Coding";
console.log(course_name);  // print on the console: Coding

// print a concatenation of Strings and variables
const course_name = 'Creative Coding Foundations';
const program = 'Maind';
console.log(course_name + " is a course of the " + program + " program.");
// Creative Coding Foundations is a course of the Maind program.
```

# HTML (index.html)

HTML (HyperText Markup Language) defines the **meaning** and **structure** of web content.

**HTML elements**

![[Source](https://www.notion.so/68b46a41c97842df9c0fe588086f9a3d?pvs=21)](https://prod-files-secure.s3.us-west-2.amazonaws.com/ab1d67ee-9a19-4812-aa7c-688ee60df704/0371ec24-c3cb-4ee1-ad88-a3140bcb85c0/anatomy-of-an-html-element.png)

[Source](https://www.notion.so/68b46a41c97842df9c0fe588086f9a3d?pvs=21)

[List of the available elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

```html
<p>Content text of the paragraph</p>

<h1>Page title</h1>

<a href="https://maind.supsi.ch/">Link to the MAIND website</a>

<img src="image.jpg">
```

**HTML structure: nested elements (parent/child)**

```html
<h1>FAQ</h1>

<section>
	<h2>Content</h2>
	<ul>
		<li>...</li>
		<li>...</li>
		<li>...</li>
	</ul>
</section>

<section>
	<h2>Admission requirements</h2>
	<ul>
		<li>
			<h3>What background do I need?</h3>
			<p>The program is multidisciplinary and ...</p>
		</li>
		<li>
			<h3>Which are the admission requirements?</h3>
			<p>It requires a Bachelor of Arts degree ...</p>
		</li>
	</ul>
</section>
```

The <h3> and <p> elements are **children** of the <li> element.

The <li> element is the **parent** of <h3> and <p> elements.

**HTML attributes (for example: href, src, id, class, style, …)**

```html
<p id="abstract_text">The project is about the ...</p>

<div class="container">...</div>

<img src="image.jpg">
```

**HTML comments**

```html
<!-- This is a comment in HTML -->

<!--
The comment can also be spread on
multiple lines if necessary
-->
```

**HTML minimum structure (generic)**

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8" />
	<title>Title</title>
</head>
<body>

</body>	
</html>
```

**HTML used for the course (with the CSS and JS file link)**

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8" />
	<title>Title of the page</title>
	<link rel="stylesheet" href="style.css">
	<script src="script.js" defer></script>
</head>
<body>

</body>	
</html>
```