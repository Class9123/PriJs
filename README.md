# ![Priy Icon](https://iili.io/FErz9lS.png) Priy (`priy`)

**Priy** is a blazing-fast reactive frontend framework that compiles `.pri` components into highly optimized DOM updates. It offers fine-grained reactivity, declarative rendering, and clean HTML-first syntax — all with minimal runtime overhead.

---

## 🚀 Features

- ✅ Fine-grained reactivity (like SolidJS)
- ✅ HTML + logic together in `.pri` files
- ✅ Declarative rendering with `<If>`, `<Else>`, and `<Repeat>`
- ✅ Built-in hooks: `useState`, `useEffect`, `useMemo`
- ✅ Support for custom hooks
- ✅ Vite plugin support for native `.pri` compilation

---

## 📦 Installation

With **pnpm**:

```bash
pnpx create-priy-app priy
cd priy
pnpm install
```

With npm:

```bash 
npx create-priy-app priy
cd priy
npm install
```

---

✨ Example .pri Component

```js
import { useState } from "priy";

const [count, setCount] = useState(0);
setInterval(() => setCount(count() + 1), 1000);

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

🔁 Loops with <Repeat>

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

Only the necessary parts of the DOM update when items change.


---

🧠 Reactivity & Hooks
```js
useState(initialValue)
```
```js
const [count, setCount] = useState(0);
count();        // Read
setCount(5);    // Update
```

---
```js
useEffect(() => {})
```
```js
useEffect(() => {
  console.log("Count is:", count());
});
```
Priy automatically tracks dependencies used inside effects.


---
```js
useMemo(() => {})
```
```js
const double = useMemo(() => count() * 2);
```
Efficient memoization — only recomputes when dependencies change.


---

🧩 Create Custom Hooks
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
```
Custom hooks help you encapsulate logic and reuse across .pri files.


---

⚙️ Using with Vite

Add this to your vite.config.js:
```js
import { Scan } from "priy/plugin";

export default {
  plugins: [Scan()]
};
```
This enables .pri compilation at build time with HMR support during dev.


---

🧪 Upcoming Features

 ⚠️ Note: Priy is under active development — some features are experimental and more are coming soon!



Planned:

$if, $for, $show shorthand syntax

on:click directive support

Directive customization & better compiler output



---

👤 Author

Made with ❤️ by Jay Govind Mahato

🐙 GitHub: github.com/Class9123

💬 Discord (DM): Class9123

📦 NPM: Priy on npm



---

🤝 Contributing

Want to improve Priy?

1. Fork the repo: https://github.com/Class9123/Priy-js


2. Edit the files inside the priy-js/ directory


3. Commit changes and make a pull request


4. Once verified, they will be added to the GitHub repo and npm package




---

💬 Join the Community

Got questions or want to contribute?

Join our developer Discord server:


 Ask questions, suggest features, or just chat about reactive frontend frameworks — all skill levels welcome!




---

📄 License

MIT


---

 ℹ️ The README is still in progress. You can DM me on Discord or Reddit if you'd like help or want to learn more.
