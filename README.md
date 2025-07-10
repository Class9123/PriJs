# Priy (`priy`)

**Priy** is a blazing-fast reactive frontend framework that compiles `.pri` components into highly optimized DOM updates. It offers fine-grained reactivity, declarative conditional rendering, and looping — all within a clean HTML-first component format.

---

## 🚀 Features

* ✅ Fine-grained reactive state management (like SolidJS)
* ✅ Logic and markup together in `.pri` files
* ✅ Declarative `<If>`, `<Else>`, and  `<Repeat>`
* support
* ✅ Powerful hooks: `useState`, `useEffect`, `useMemo`
* ✅ Support for writing your own custom hooks
* ✅ Full Vite plugin for seamless `.pri` integration

---

## 📦 Installation

```bash
pnpx create-priy-app priy
cd priy
pnpm install 
```

or 
```bash
npx create-priy-app priy
cd priy
npm install 
```
---

## ✨ Example `.pri` File

```js
import { useState } from "priy";

const [count, setCount] = useState(0);
setInterval(() => {
  setCount(count() + 1);
}, 1000);

<Component>
  <p>Count is {count()}</p>

  <If condition="count() > 5">
    <p>Greater than five</p>
  </If>
  <Else>
    <p>Five or less</p>
  </Else>
</Component>
```

---

## 🔁 Loops

Priy supports declarative looping with the `<Repeat>` tag.

### Syntax:

```html
<Repeat for="item in items()">
  <p>{item}</p>
</Repeat>
```

### Example:

```js
const [items, setItems] = useState(["apple", "banana", "cherry"]);

<Component>
  <ul>
    <Repeat for="fruit in items()">
      <li>{fruit}</li>
    </Repeat>
  </ul>
</Component>
```

This creates a reactive list that updates only the necessary parts when `items` changes.

---

## 🧠 Reactivity & Hooks

Priy provides a set of hooks similar to React and Solid, but optimized for DOM-first updates.

### `useState(initialValue)`

Creates a reactive signal:

```js
const [count, setCount] = useState(0);
count();        // Read value
setCount(5);    // Update value
```

### `useEffect(callback)`

Runs a side effect when reactive dependencies used inside change:

```js
useEffect(() => {
  console.log("Count is:", count());
});
```

Priy automatically tracks the dependencies inside `useEffect` and re-runs it only when they change.

### `useMemo(fn)`

Memoizes a computed value based on dependencies:

```js
const double = useMemo(() => count() * 2);
```

`useMemo` will only recompute when `count()` changes, and caches the result for performance.

---

## 🧩 Creating Custom Hooks

Custom hooks in Priy are just functions that use other hooks.

### Example:

```js
import { useState, useEffect } from "priy";

function useTimer() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTime(time() + 1), 1000);
    return () => clearInterval(id);
  });

  return time;
}

const time = useTimer();
```

Custom hooks allow composition of logic and reuse across `.pri` files.

---

## 📄 Using with Vite

In `vite.config.js`:

```js
import { Scan } from "priy/plugin";

export default {
  plugins: [Scan()]
};
```

Now you can write `.pri` components in your project, and they will be compiled at build time.

---

## 📝 License

MIT

---

## 👤 Author

Built by **Jay Govind Mahato** — open to feedback, improvements, and contributions!

## How to contribute 

To contribute in the **Priy** framework you have you clone the repo and edit the files inside the https://github.com/Class9123/PriJs/tree/main/priy-js 

After completing the updates commit changes and make the pull request and later it will be verified and added to the GitHub repo and the npm Package .


**Note :// This is under development now so some features might not support and many features afe going ti added, like $if ,$for ,$show , on:click(directives with customisation ) **
