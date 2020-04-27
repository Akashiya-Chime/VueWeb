let vm = new Vue({
    el: '#app',
    data: {
        msg: '搞个跑马灯，为了让效果看起来好点，就写得长一点！！！！',
        intervalId: null  //在定时器上定义一个定时器 Id
    },
    methods: {
        begin: function () {
            if (this.intervalId != null) return;  //每次先判断一下以确定不能多点
            this.intervalId = setInterval(() => {  //箭头函数让 this 指向了外部？
                let top = this.msg.substring(0, 1);  //取第一个字符
                let bottom = this.msg.substring(1);  //取剩下的字符
                this.msg = bottom + top;  //把第一个字符拼到最后
                // Vue 会自动监听 data 改变（动态？），如有变化，立即应用回 html
            }, 300)
        },
        stop() {  //似乎是一种新奇的写法
            clearInterval(this.intervalId);
            this.intervalId = null;  //每次清除定时器之后，还得把 intervalId 置为 null
        }
    },
});

let nvm = new Vue({
    el: '#calc',
    data: {
        n1: null,
        n2: null,
        opt: '+',
        resoult: null
    },
    methods: {
        calc(){
            let needToDo = 'Number(this.n1)' + this.opt + 'Number(this.n2)';
            this.resoult = eval(needToDo);
        }
    }
});