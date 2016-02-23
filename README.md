# ID-Card

查询十八位身份证信息

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
 *   kaddress: '陕西省咸阳市三原县',
 *   gender: 'M',
 *   year: 1992,
 *   month: 1,
 *   day: 1,
 *   age: 23
 * }
 */

> idcard.query('610422199201012872');   // { valid: false }
```

## TODO:

- random 随机获得一个有效身份证
