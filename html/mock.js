let obj = {
    aa: '11',
    bb: '22',
    cc: '33',
    dd: '44'
}
Mock.mock('yourdomain.com/getlist', {
    "user|3-5": [{
        "id|+1": 1,
        name: "@cname",
        "age|18-28": 0,
        birthday: '@date("yyyy-MM-dd")',
        city: "city",
        "fromobj|2": obj
    }]
})