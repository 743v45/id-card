# ID-Card

查询十五位和十八位身份证信息

## Installation

> npm install node-id-card

## Usage

### isValid

```
> idcard.isValid('610422199201012871');   // true
> idcard.isValid('610422199201012872');   // false
```

### query 

```
> idcard.query('610422199201012871');
/**
 * {
 *   valid: true,
 *   address: '陕西省咸阳市三原县',
 *   gender: 'M',
 *   year: 1992,
 *   month: 1,
 *   day: 1,
 *   age: 23
 * }
 */

> idcard.query('610422199201012872');   // { valid: false }
```

### generate

name 是随机瞎扯的...调用死月的 [chinese-random-name](https://github.com/XadillaX/chinese-random-name)

```
> idcard.generate();
/**
 * {
 *   ID: '142230193910277603',
 *   name: '全说',
 *   valid: true,
 *   address: '山西省忻州地区五寨县',
 *   gender: 'M',
 *   year: 1939,
 *   month: 10,
 *   day: 27,
 *   age: 76
 * }
 */

> idcard.generate({ bits: 15 });
/**
 * {
 *   ID: '420984580415694',
 *   name: '闵确',
 *   valid: true,
 *   address: '湖北省孝感市汉川市',
 *   gender: 'F',
 *   year: 1958,
 *   month: 4,
 *   day: 15,
 *   age: 57
 * }
 */
```
