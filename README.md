# Car Towing

## How to run

  Node.js should be installed
  Mongodb should be installed and runned
  Gulp should be installed

  * npm i

### Without server autoreloading
```
gulp build
node dev/server
open http://localhost:3000/
```

### With server autoreloading
```
npm install nodemon -g
Run in different consoles
  nodemon dev/server
  gulp dev
```
---

## Code convention

  * two spaces insted of tab

---

## Info

  Front end development folder: dev/publicDev

  Static part deployed at http://advocate-meeting-62733.netlify.com/

---

## Branching

New feature:
```
git checkout -b feature/{JiraTicketNumber}_{Description_with_lodashs}
git checkout -b feature/CART-5_property_page
```

Finish feature:
```
git checkout develop
git pull
git checkout {branchName}
git merge develop
{resolve conflicts}
git checkout develop
git merge {branchName}
```
